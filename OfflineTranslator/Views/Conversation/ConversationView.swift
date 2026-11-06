import SwiftData
import SwiftUI

/// Two people, two languages: each taps their own mic, speaks, and hears the other language back.
struct ConversationView: View {
    enum Side { case a, b }

    struct Message: Identifiable {
        let id = UUID()
        let side: Side
        let original: String
        let translated: String
        let from: Language
        let to: Language
    }

    @Environment(TranslationService.self) private var translator
    @Environment(LanguageCatalog.self) private var catalog
    @Environment(\.modelContext) private var modelContext

    @AppStorage(Prefs.conversationLanguageA) private var languageAID = Prefs.deviceLanguageID
    @AppStorage(Prefs.conversationLanguageB) private var languageBID = Prefs.defaultTargetID
    @AppStorage(Prefs.conversationAutoSpeak) private var autoSpeak = true
    @AppStorage(Prefs.saveHistory) private var saveHistory = true
    @AppStorage(Prefs.speechRate) private var speechRate = Prefs.defaultSpeechRate

    @State private var messages: [Message] = []
    @State private var speech = SpeechRecognizer()
    @State private var activeSide: Side?
    @State private var isStopping = false
    @State private var isTranslating = false
    @State private var faceToFace = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                if faceToFace {
                    partnerPanel
                        .rotationEffect(.degrees(180))
                    Divider()
                }

                transcript

                Divider()

                HStack(alignment: .bottom, spacing: 16) {
                    controls(for: .a)
                    if !faceToFace {
                        controls(for: .b)
                    }
                }
                .padding()
            }
            .navigationTitle("Conversation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button {
                        withAnimation { faceToFace.toggle() }
                    } label: {
                        Image(systemName: faceToFace ? "rectangle.split.1x2.fill" : "rectangle.split.1x2")
                    }
                    .accessibilityLabel(faceToFace ? "Turn off face-to-face mode" : "Face-to-face mode")
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        messages.removeAll()
                    } label: {
                        Image(systemName: "trash")
                    }
                    .disabled(messages.isEmpty)
                    .accessibilityLabel("Clear conversation")
                }
            }
            .alert("Something went wrong", isPresented: Binding(isPresent: $errorMessage), presenting: errorMessage) { _ in
                Button("OK") { errorMessage = nil }
            } message: { message in
                Text(message)
            }
            .onChange(of: speech.isRecording) { wasRecording, isRecording in
                // The recognizer can end on its own (long silence or time limit).
                if wasRecording, !isRecording, !isStopping, let side = activeSide {
                    activeSide = nil
                    let heard = speech.transcript.trimmingCharacters(in: .whitespacesAndNewlines)
                    Task { await process(heard, from: side) }
                }
            }
            .onDisappear {
                speech.cancel()
                activeSide = nil
            }
        }
    }

    // MARK: - Pieces

    private var transcript: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 12) {
                    if messages.isEmpty && activeSide == nil {
                        ContentUnavailableView(
                            "Start a conversation",
                            systemImage: "person.2.wave.2",
                            description: Text("Tap a microphone, speak, then tap again. The translation is spoken in the other language — no internet needed.")
                        )
                        .padding(.top, 40)
                    }

                    ForEach(messages) { message in
                        MessageBubble(message: message, speechRate: speechRate)
                            .id(message.id)
                    }

                    if let activeSide {
                        listeningBubble(side: activeSide)
                            .id("listening")
                    }
                    if isTranslating {
                        ProgressView().padding()
                    }
                }
                .padding()
            }
            .onChange(of: messages.count) { _, _ in
                if let last = messages.last {
                    withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                }
            }
            .onChange(of: speech.transcript) { _, _ in
                if activeSide != nil { proxy.scrollTo("listening", anchor: .bottom) }
            }
        }
    }

    /// In face-to-face mode, the top half faces the other person and shows
    /// the latest message in their language, with their own mic.
    private var partnerPanel: some View {
        VStack(spacing: 16) {
            let partnerLanguage = language(for: .b)
            Group {
                if activeSide == .b {
                    Text(speech.transcript.isEmpty ? "Listening…" : speech.transcript)
                } else if let last = messages.last {
                    Text(last.side == .a ? last.translated : last.original)
                } else {
                    Text("Tap the microphone and speak \(partnerLanguage.name)")
                        .foregroundStyle(.secondary)
                }
            }
            .font(.title2.weight(.medium))
            .multilineTextAlignment(.center)
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            controls(for: .b)
                .frame(maxWidth: 220)
        }
        .padding()
        .frame(maxHeight: .infinity)
        .background(Color.accentColor.opacity(0.08))
    }

    private func controls(for side: Side) -> some View {
        let isActive = activeSide == side
        return VStack(spacing: 12) {
            LanguageButton(title: side == .a ? "Your Language" : "Their Language", selection: binding(for: side))
                .disabled(activeSide != nil)

            Button {
                Task { await tap(side) }
            } label: {
                Image(systemName: isActive ? "stop.fill" : "mic.fill")
                    .font(.system(size: 30, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 76, height: 76)
                    .background(isActive ? Color.red : (side == .a ? Color.accentColor : Color.indigo), in: Circle())
                    .symbolEffect(.pulse, isActive: isActive)
            }
            .disabled((activeSide != nil && !isActive) || isTranslating || isStopping)
            .accessibilityLabel(isActive ? "Stop and translate" : "Speak \(language(for: side).name)")
        }
        .frame(maxWidth: .infinity)
    }

    private func listeningBubble(side: Side) -> some View {
        HStack {
            if side == .b { Spacer(minLength: 40) }
            VStack(alignment: .leading, spacing: 4) {
                Label("Listening in \(language(for: side).name)…", systemImage: "waveform")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                if !speech.transcript.isEmpty {
                    Text(speech.transcript)
                }
            }
            .padding(12)
            .background(.background.secondary, in: RoundedRectangle(cornerRadius: 16))
            if side == .a { Spacer(minLength: 40) }
        }
    }

    // MARK: - Logic

    private func language(for side: Side) -> Language {
        catalog.language(id: side == .a ? languageAID : languageBID)
    }

    private func binding(for side: Side) -> Binding<String> {
        side == .a ? $languageAID : $languageBID
    }

    private func tap(_ side: Side) async {
        if let active = activeSide {
            guard active == side else { return }
            isStopping = true
            let heard = await speech.stop()
            activeSide = nil
            isStopping = false
            await process(heard, from: side)
            return
        }

        activeSide = side
        do {
            try await speech.start(language: language(for: side))
        } catch {
            activeSide = nil
            errorMessage = error.localizedDescription
        }
    }

    private func process(_ text: String, from side: Side) async {
        guard !text.isEmpty else { return }
        let from = language(for: side)
        let to = language(for: side == .a ? .b : .a)

        isTranslating = true
        defer { isTranslating = false }
        do {
            let translated = try await translator.translate(text, from: from, to: to)
            messages.append(Message(side: side, original: text, translated: translated, from: from, to: to))
            if autoSpeak {
                Speaker.shared.speak(translated, language: to, rate: speechRate)
            }
            if saveHistory {
                TranslationRecord.save(in: modelContext, source: text, translation: translated, from: from, to: to, origin: .conversation)
            }
        } catch {
            errorMessage = TranslationErrorText.describe(error)
        }
    }
}

private struct MessageBubble: View {
    let message: ConversationView.Message
    let speechRate: Double

    var body: some View {
        HStack {
            if message.side == .b { Spacer(minLength: 40) }
            VStack(alignment: .leading, spacing: 6) {
                Text(message.original)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                HStack(alignment: .top) {
                    Text(message.translated)
                        .font(.body.weight(.medium))
                        .textSelection(.enabled)
                    Spacer(minLength: 8)
                    Button {
                        Speaker.shared.speak(message.translated, language: message.to, rate: speechRate)
                    } label: {
                        Image(systemName: "speaker.wave.2.fill")
                    }
                    .accessibilityLabel("Speak again")
                }
            }
            .padding(12)
            .background(
                message.side == .a ? Color.accentColor.opacity(0.15) : Color.indigo.opacity(0.15),
                in: RoundedRectangle(cornerRadius: 16)
            )
            if message.side == .a { Spacer(minLength: 40) }
        }
    }
}
