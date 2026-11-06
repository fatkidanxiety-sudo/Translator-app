import AVFoundation
import Foundation
import Observation
import Speech

/// Live speech-to-text that is forced to run on-device (no audio leaves the phone).
@MainActor
@Observable
final class SpeechRecognizer {
    enum RecognizerError: LocalizedError {
        case notAuthorized
        case unavailable(String)
        case offlineUnsupported(String)

        var errorDescription: String? {
            switch self {
            case .notAuthorized:
                "Allow microphone and speech recognition access in Settings to use voice input."
            case .unavailable(let name):
                "Speech recognition isn't available for \(name) on this device."
            case .offlineUnsupported(let name):
                "Offline speech recognition isn't available for \(name) on this device yet. You can still type."
            }
        }
    }

    /// Text recognized so far in the current recording.
    private(set) var transcript = ""
    private(set) var isRecording = false

    private let audioEngine = AVAudioEngine()
    @ObservationIgnored private var request: SFSpeechAudioBufferRecognitionRequest?
    @ObservationIgnored private var task: SFSpeechRecognitionTask?
    @ObservationIgnored private var finishContinuation: CheckedContinuation<Void, Never>?

    /// Asks for speech and microphone permission. Returns true when both are granted.
    static func requestAuthorization() async -> Bool {
        let speechStatus = await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
            SFSpeechRecognizer.requestAuthorization { continuation.resume(returning: $0) }
        }
        guard speechStatus == .authorized else { return false }
        return await AVAudioApplication.requestRecordPermission()
    }

    /// Picks the closest locale the speech recognizer knows for `language`.
    static func recognizerLocale(for language: Language) -> Locale? {
        let candidates = SFSpeechRecognizer.supportedLocales().filter {
            $0.language.languageCode?.identifier == language.languageCode
        }
        return candidates.first(where: { $0.language.region?.identifier == language.region })
            ?? candidates.first(where: { $0.identifier.replacingOccurrences(of: "_", with: "-") == language.bcp47 })
            ?? candidates.first
    }

    func start(language: Language) async throws {
        if isRecording { _ = await stop() }

        guard await Self.requestAuthorization() else { throw RecognizerError.notAuthorized }
        guard let locale = Self.recognizerLocale(for: language),
              let recognizer = SFSpeechRecognizer(locale: locale),
              recognizer.isAvailable
        else { throw RecognizerError.unavailable(language.name) }
        guard recognizer.supportsOnDeviceRecognition else {
            throw RecognizerError.offlineUnsupported(language.name)
        }

        Speaker.shared.stop()

        let session = AVAudioSession.sharedInstance()
        try session.setCategory(.playAndRecord, mode: .default, options: [.defaultToSpeaker, .duckOthers, .allowBluetooth])
        try session.setActive(true, options: .notifyOthersOnDeactivation)

        let request = SFSpeechAudioBufferRecognitionRequest()
        request.shouldReportPartialResults = true
        request.requiresOnDeviceRecognition = true
        request.addsPunctuation = true
        self.request = request

        let input = audioEngine.inputNode
        let format = input.outputFormat(forBus: 0)
        input.removeTap(onBus: 0)
        input.installTap(onBus: 0, bufferSize: 1024, format: format, block: Self.makeTapBlock(feeding: request))

        transcript = ""
        audioEngine.prepare()
        try audioEngine.start()
        isRecording = true

        task = recognizer.recognitionTask(with: request, resultHandler: Self.makeResultHandler { [weak self] text, isFinal in
            Task { @MainActor [weak self] in
                guard let self else { return }
                if let text { self.transcript = text }
                if isFinal { self.finish() }
            }
        })
    }

    /// Stops listening and returns the final transcript.
    @discardableResult
    func stop() async -> String {
        guard isRecording else { return transcript }

        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        request?.endAudio()

        // Wait briefly for the recognizer's final result, which may add the last words.
        if task != nil {
            await withCheckedContinuation { (continuation: CheckedContinuation<Void, Never>) in
                finishContinuation = continuation
                Task { @MainActor [weak self] in
                    try? await Task.sleep(for: .seconds(1.5))
                    self?.finish()
                }
            }
        }
        finish()
        return transcript.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Stops immediately and throws away anything heard.
    func cancel() {
        task?.cancel()
        transcript = ""
        if audioEngine.isRunning {
            audioEngine.stop()
            audioEngine.inputNode.removeTap(onBus: 0)
        }
        finish()
    }

    // The audio tap and recognition callbacks run on background threads, so they are
    // built outside the main actor to avoid main-thread isolation assumptions.
    nonisolated private static func makeTapBlock(feeding request: SFSpeechAudioBufferRecognitionRequest) -> AVAudioNodeTapBlock {
        { buffer, _ in request.append(buffer) }
    }

    nonisolated private static func makeResultHandler(
        _ onUpdate: @escaping @Sendable (String?, Bool) -> Void
    ) -> (SFSpeechRecognitionResult?, Error?) -> Void {
        { result, error in
            onUpdate(result?.bestTranscription.formattedString, (result?.isFinal ?? false) || error != nil)
        }
    }

    private func finish() {
        if let continuation = finishContinuation {
            finishContinuation = nil
            continuation.resume()
        }
        guard isRecording || task != nil else { return }
        task?.cancel()
        task = nil
        request = nil
        isRecording = false
        if audioEngine.isRunning {
            audioEngine.stop()
            audioEngine.inputNode.removeTap(onBus: 0)
        }
    }
}
