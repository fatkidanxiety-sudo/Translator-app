import SwiftUI
import Translation

/// Lists every supported language and whether it's downloaded for offline use
/// alongside the person's own language, with a button to download it.
struct LanguagePacksView: View {
    @Environment(LanguageCatalog.self) private var catalog

    @State private var homeID = Prefs.deviceLanguageID
    @State private var statuses: [String: PairStatus] = [:]
    @State private var downloadConfiguration: TranslationSession.Configuration?
    @State private var downloadingID: String?
    @State private var errorMessage: String?

    private var home: Language { catalog.language(id: homeID) }

    private var others: [Language] {
        catalog.languages.filter { $0.id != home.id }
    }

    private var downloaded: [Language] { others.filter { statuses[$0.id] == .installed } }
    private var available: [Language] { others.filter { statuses[$0.id] != .installed } }

    var body: some View {
        List {
            Section {
                LanguageButton(title: "Your Language", selection: $homeID)
                    .listRowBackground(Color.clear)
                    .listRowInsets(EdgeInsets())
            } footer: {
                Text("Downloads are shared with Apple's Translate app and stored by iOS. You can also manage them in the Settings app under Apps › Translate.")
            }

            if !downloaded.isEmpty {
                Section("Ready Offline") {
                    ForEach(downloaded) { row(for: $0) }
                }
            }

            Section("Available to Download") {
                ForEach(available) { row(for: $0) }
            }
        }
        .navigationTitle("Offline Languages")
        .overlay {
            if !catalog.isLoaded { ProgressView() }
        }
        .task(id: "\(homeID)-\(catalog.languages.count)") {
            await refreshAll()
        }
        // Presents Apple's download sheet for the chosen pair.
        .translationTask(downloadConfiguration) { session in
            do {
                try await session.prepareTranslation()
            } catch {
                errorMessage = TranslationErrorText.describe(error)
            }
            if let id = downloadingID {
                statuses[id] = await catalog.status(from: home, to: catalog.language(id: id))
            }
            downloadingID = nil
        }
        .alert("Download didn't finish", isPresented: Binding(isPresent: $errorMessage), presenting: errorMessage) { _ in
            Button("OK") { errorMessage = nil }
        } message: { message in
            Text(message)
        }
    }

    private func row(for language: Language) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(language.name)
                Text(language.nativeName)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            switch statuses[language.id] {
            case .installed:
                Image(systemName: "checkmark.circle.fill")
                    .foregroundStyle(.green)
                    .accessibilityLabel("Downloaded")
            case .needsDownload:
                if downloadingID == language.id {
                    ProgressView()
                } else {
                    Button {
                        download(language)
                    } label: {
                        Image(systemName: "arrow.down.circle")
                            .font(.title3)
                    }
                    .buttonStyle(.borderless)
                    .disabled(downloadingID != nil)
                    .accessibilityLabel("Download \(language.name)")
                }
            case .unsupported:
                Text("Not with \(home.name)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            case .unknown, nil:
                ProgressView().controlSize(.small)
            }
        }
    }

    private func download(_ language: Language) {
        downloadingID = language.id
        let source = home.locale
        let target = language.locale
        if downloadConfiguration?.source == source, downloadConfiguration?.target == target {
            downloadConfiguration?.invalidate()
        } else {
            downloadConfiguration = TranslationSession.Configuration(source: source, target: target)
        }
    }

    private func refreshAll() async {
        guard catalog.isLoaded else { return }
        let home = home
        for language in others {
            if Task.isCancelled { return }
            statuses[language.id] = await catalog.status(from: home, to: language)
        }
    }
}
