import AVFoundation
import Foundation

/// Reads text aloud with the voices built into iOS (works offline).
final class Speaker: NSObject, AVSpeechSynthesizerDelegate {
    static let shared = Speaker()

    private let synthesizer = AVSpeechSynthesizer()

    override private init() {
        super.init()
        synthesizer.delegate = self
    }

    /// The best installed voice for `language`, preferring the matching region
    /// and higher-quality (enhanced/premium) voices.
    static func voice(for language: Language) -> AVSpeechSynthesisVoice? {
        let voices = AVSpeechSynthesisVoice.speechVoices().filter {
            Locale.Language(identifier: $0.language).languageCode?.identifier == language.languageCode
        }
        let sameRegion = voices.filter {
            Locale.Language(identifier: $0.language).region?.identifier == language.region
        }
        let pool = sameRegion.isEmpty ? voices : sameRegion
        return pool.max { $0.quality.rawValue < $1.quality.rawValue }
            ?? AVSpeechSynthesisVoice(language: language.bcp47)
    }

    static func canSpeak(_ language: Language) -> Bool {
        voice(for: language) != nil
    }

    func speak(_ text: String, language: Language, rate: Double = Prefs.defaultSpeechRate) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }

        let session = AVAudioSession.sharedInstance()
        // `.playback` keeps speech audible even when the ring/silent switch is on.
        if session.category != .playAndRecord {
            try? session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers])
        }
        try? session.setActive(true)

        let utterance = AVSpeechUtterance(string: trimmed)
        utterance.voice = Self.voice(for: language)
        utterance.rate = Float(min(max(rate, Double(AVSpeechUtteranceMinimumSpeechRate)), Double(AVSpeechUtteranceMaximumSpeechRate)))
        synthesizer.speak(utterance)
    }

    func stop() {
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
    }

    func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        if !synthesizer.isSpeaking {
            try? AVAudioSession.sharedInstance().setActive(false, options: .notifyOthersOnDeactivation)
        }
    }
}
