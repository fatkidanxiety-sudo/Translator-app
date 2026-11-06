import SwiftData
import SwiftUI
import UIKit

struct TranslateView: View {
    @Environment(TranslationService.self) private var translator
    @Environment(LanguageCatalog.self) private var catalog
    @Environment(\.modelContext) private var modelContext

    @AppStorage(Prefs.sourceLanguage) private var sourceID = Language.autoID
    @AppStorage(Prefs.targetLanguage) private var targetID = Prefs.defaultTargetID
    @AppStorage(Prefs.autoSpeak) private var autoSpeak = false
    @AppStorage(Prefs.saveHistory) private var saveHistory = true
    @AppStorage(Prefs.speechRate) private var speechRate = Prefs.defaultSpeechRate

    @State private var inputText = ""
    @State private var outputText = ""
    /// The input that produced `outputText`, so edits can mark the result stale.
    @State private var translatedInput = ""
    @State private var resultSource: Language?
    @State private var resultTarget: Language?
    @State private var detectedLanguage: Language?
    @State private var savedRecord: TranslationRecord?
    @State private var isTranslating = false
    @State private var errorMessage: String?
    @State private var pairStatus: PairStatus = .unknown
    @State private var speech = SpeechRecognizer()
    @State private var showSettings = false
    @State private var copied = false
    @FocusState private var inputFocused: Bool

    private var source: Language? {
        sourceID == Language.autoID ? detectedLanguage : catalog.language(id: sourceID)
    }

    private var target: Language { catalog.language(id: targetID) }

    private var canTranslate: Bool {
        !inputText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isTranslating && !speech.isRecording
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    LanguageBar(sourceID: $sourceID, targetID: $targetID, detectedLanguage: detectedLanguage)
                        .padding(.bottom, detectedLanguage != nil && sourceID == Language.autoID ? 8 : 0)

                    inputCard

                    Button {
                        Task { await translate(origin: .text) }
                    } label: {
                        HStack {
                            if isTranslating { ProgressView().tint(.white) }
                            Text(isTranslating ? "Translating…" : "Translate")
                        }
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 6)
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(!canTranslate)

                    if !outputText.isEmpty {
                        outputCard
                    }

                    OfflineStatusBadge(status: pairStatus)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding()
            }
            .scrollDismissesKeyboard(.interactively)
            .navigationTitle("Translate")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showSettings = true
                    } label: {
                        Image(systemName: "gearshape")
                    }
                    .accessibilityLabel("Settings")
                }
                ToolbarItemGroup(placement: .keyboard) {
                    Spacer()
                    Button("Done") { inputFocused = false }
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
            .alert("Something went wrong", isPresented: Binding(isPresent: $errorMessage), presenting: errorMessage) { _ in
                Button("OK") { errorMessage = nil }
            } message: { message in
                Text(message)
            }
            .task(id: "\(sourceID)>\(targetID)>\(detectedLanguage?.id ?? "")>\(catalog.isLoaded)") {
                await refreshStatus()
            }
            .onChange(of: sourceID) { _, _ in resetResult() }
            .onChange(of: targetID) { _, _ in resetResult() }
            .onChange(of: speech.transcript) { _, newValue in
                if speech.isRecording { inputText = newValue }
            }
        }
    }

    // MARK: - Cards

    private var inputCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            ZStack(alignment: .topLeading) {
                if inputText.isEmpty {
                    Text(speech.isRecording ? "Listening…" : "Enter text")
                        .foregroundStyle(.tertiary)
                        .padding(.top, 8)
                        .padding(.leading, 5)
                }
                TextEditor(text: $inputText)
                    .focused($inputFocused)
                    .scrollContentBackground(.hidden)
                    .frame(minHeight: 120)
                    .font(.title3)
            }

            HStack(spacing: 16) {
                Button {
                    Task { await toggleRecording() }
                } label: {
                    Image(systemName: speech.isRecording ? "stop.circle.fill" : "mic.fill")
                        .font(.title2)
                        .foregroundStyle(speech.isRecording ? Color.red : Color.accentColor)
                        .symbolEffect(.pulse, isActive: speech.isRecording)
                }
                .accessibilityLabel(speech.isRecording ? "Stop listening" : "Speak")

                PasteButton(payloadType: String.self) { strings in
                    let pasted = strings.first ?? ""
                    DispatchQueue.main.async { inputText = pasted }
                }
                .labelStyle(.iconOnly)
                .buttonBorderShape(.circle)

                Spacer()

                Text("\(inputText.count)")
                    .font(.caption.monospacedDigit())
                    .foregroundStyle(.secondary)

                if !inputText.isEmpty {
                    Button {
                        inputText = ""
                        resetResult()
                    } label: {
                        Image(systemName: "xmark.circle.fill").foregroundStyle(.secondary)
                    }
                    .accessibilityLabel("Clear text")
                }
            }
        }
        .padding()
        .background(.background.secondary, in: RoundedRectangle(cornerRadius: 16))
    }

    private var outputCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let resultTarget {
                Text(resultTarget.name)
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.tint)
            }

            Text(outputText)
                .font(.title3)
                .textSelection(.enabled)
                .frame(maxWidth: .infinity, alignment: .leading)
                .opacity(translatedInput == inputText ? 1 : 0.5)

            HStack(spacing: 20) {
                Button {
                    if let resultTarget { Speaker.shared.speak(outputText, language: resultTarget, rate: speechRate) }
                } label: {
                    Image(systemName: "speaker.wave.2.fill")
                }
                .accessibilityLabel("Speak translation")

                Button {
                    UIPasteboard.general.string = outputText
                    copied = true
                    Task {
                        try? await Task.sleep(for: .seconds(1.5))
                        copied = false
                    }
                } label: {
                    Image(systemName: copied ? "checkmark" : "doc.on.doc")
                }
                .accessibilityLabel("Copy translation")

                ShareLink(item: outputText) {
                    Image(systemName: "square.and.arrow.up")
                }

                Spacer()

                Button {
                    toggleFavorite()
                } label: {
                    Image(systemName: savedRecord?.isFavorite == true ? "star.fill" : "star")
                        .foregroundStyle(.yellow)
                }
                .accessibilityLabel(savedRecord?.isFavorite == true ? "Remove from favorites" : "Add to favorites")
            }
            .font(.title3)
        }
        .padding()
        .background(Color.accentColor.opacity(0.1), in: RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Actions

    private func translate(origin: TranslationOrigin) async {
        let text = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        inputFocused = false

        let sourceLanguage: Language
        if sourceID == Language.autoID {
            guard let detected = catalog.detectLanguage(of: text) else {
                errorMessage = "Couldn't tell which language this is. Pick the language you're translating from."
                return
            }
            detectedLanguage = detected
            sourceLanguage = detected
        } else {
            sourceLanguage = catalog.language(id: sourceID)
        }
        let targetLanguage = target

        isTranslating = true
        defer { isTranslating = false }

        do {
            let result = try await translator.translate(text, from: sourceLanguage, to: targetLanguage)
            outputText = result
            translatedInput = inputText
            resultSource = sourceLanguage
            resultTarget = targetLanguage
            pairStatus = await catalog.status(from: sourceLanguage, to: targetLanguage)

            if autoSpeak {
                Speaker.shared.speak(result, language: targetLanguage, rate: speechRate)
            }
            savedRecord = saveHistory
                ? TranslationRecord.save(in: modelContext, source: text, translation: result, from: sourceLanguage, to: targetLanguage, origin: origin)
                : nil
        } catch {
            errorMessage = TranslationErrorText.describe(error)
        }
    }

    private func toggleRecording() async {
        if speech.isRecording {
            let heard = await speech.stop()
            if !heard.isEmpty {
                inputText = heard
                await translate(origin: .voice)
            }
            return
        }

        // Speech recognition needs a specific language. With "Detect Language",
        // listen in the device's language.
        let listenLanguage = sourceID == Language.autoID
            ? (detectedLanguage ?? catalog.language(id: Prefs.deviceLanguageID))
            : catalog.language(id: sourceID)

        inputFocused = false
        resetResult()
        do {
            try await speech.start(language: listenLanguage)
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func toggleFavorite() {
        if let savedRecord {
            savedRecord.isFavorite.toggle()
        } else if let resultSource, let resultTarget {
            savedRecord = TranslationRecord.save(
                in: modelContext,
                source: translatedInput.trimmingCharacters(in: .whitespacesAndNewlines),
                translation: outputText,
                from: resultSource,
                to: resultTarget,
                origin: .text,
                favorite: true
            )
        }
    }

    private func resetResult() {
        outputText = ""
        translatedInput = ""
        savedRecord = nil
        if sourceID != Language.autoID { detectedLanguage = nil }
    }

    private func refreshStatus() async {
        guard catalog.isLoaded, let source else {
            pairStatus = .unknown
            return
        }
        pairStatus = await catalog.status(from: source, to: target)
    }
}
