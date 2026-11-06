import SwiftData
import SwiftUI
import UIKit

struct PhrasebookView: View {
    @AppStorage(Prefs.phrasebookLanguage) private var languageID = Prefs.defaultTargetID

    var body: some View {
        NavigationStack {
            List {
                Section {
                    LanguageButton(title: "Phrasebook Language", selection: $languageID)
                        .listRowBackground(Color.clear)
                        .listRowInsets(EdgeInsets())
                }

                Section("Categories") {
                    ForEach(Phrasebook.categories) { category in
                        NavigationLink(value: category) {
                            Label {
                                VStack(alignment: .leading) {
                                    Text(category.title)
                                    Text("\(category.phrases.count) phrases")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                            } icon: {
                                Image(systemName: category.systemImage)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Phrasebook")
            .navigationDestination(for: PhraseCategory.self) { category in
                PhraseCategoryView(category: category, languageID: languageID)
            }
        }
    }
}

private struct PhraseCategoryView: View {
    let category: PhraseCategory
    let languageID: String

    @Environment(TranslationService.self) private var translator
    @Environment(LanguageCatalog.self) private var catalog
    @Environment(\.modelContext) private var modelContext
    @AppStorage(Prefs.speechRate) private var speechRate = Prefs.defaultSpeechRate

    @State private var translations: [String: String] = [:]
    @State private var errorMessage: String?
    @State private var isLoading = false

    private var target: Language { catalog.language(id: languageID) }
    private var source: Language { catalog.language(id: Phrasebook.sourceLanguageID) }

    var body: some View {
        List {
            ForEach(category.phrases, id: \.self) { phrase in
                let translated = translations[phrase]
                Button {
                    if let translated { Speaker.shared.speak(translated, language: target, rate: speechRate) }
                } label: {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(phrase)
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                            if let translated {
                                Text(translated)
                                    .font(.body.weight(.medium))
                                    .foregroundStyle(.primary)
                            } else if isLoading {
                                Text("Translating…")
                                    .font(.body)
                                    .foregroundStyle(.tertiary)
                            }
                        }
                        Spacer()
                        if translated != nil {
                            Image(systemName: "speaker.wave.2")
                                .foregroundStyle(.tint)
                        }
                    }
                }
                .contextMenu {
                    if let translated {
                        Button {
                            UIPasteboard.general.string = translated
                        } label: {
                            Label("Copy", systemImage: "doc.on.doc")
                        }
                        Button {
                            TranslationRecord.save(in: modelContext, source: phrase, translation: translated, from: source, to: target, origin: .phrase, favorite: true)
                        } label: {
                            Label("Add to Favorites", systemImage: "star")
                        }
                    }
                }
            }
        }
        .navigationTitle(category.title)
        .overlay {
            if let errorMessage {
                ContentUnavailableView {
                    Label("Couldn't translate", systemImage: "exclamationmark.triangle")
                } description: {
                    Text(errorMessage)
                } actions: {
                    Button("Try Again") { Task { await load() } }
                }
            }
        }
        .task(id: languageID) {
            await load()
        }
    }

    private func load() async {
        errorMessage = nil
        translations = [:]
        isLoading = true
        defer { isLoading = false }
        do {
            let results = try await translator.translate(category.phrases, from: source, to: target)
            translations = Dictionary(zip(category.phrases, results), uniquingKeysWith: { first, _ in first })
        } catch is CancellationError {
            return
        } catch {
            errorMessage = TranslationErrorText.describe(error)
        }
    }
}
