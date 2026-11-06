import SwiftData
import SwiftUI
import UIKit

struct HistoryView: View {
    enum Filter: String, CaseIterable, Identifiable {
        case all = "All"
        case favorites = "Favorites"
        var id: String { rawValue }
    }

    @Environment(\.modelContext) private var modelContext
    @Query(sort: \TranslationRecord.createdAt, order: .reverse) private var records: [TranslationRecord]

    @State private var filter: Filter = .all
    @State private var query = ""
    @State private var confirmClear = false

    private var visible: [TranslationRecord] {
        records.filter { record in
            (filter == .all || record.isFavorite)
                && (query.isEmpty
                    || record.sourceText.localizedCaseInsensitiveContains(query)
                    || record.translatedText.localizedCaseInsensitiveContains(query))
        }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(visible) { record in
                    NavigationLink(value: record) {
                        HistoryRow(record: record)
                    }
                    .swipeActions(edge: .leading) {
                        Button {
                            record.isFavorite.toggle()
                        } label: {
                            Label(record.isFavorite ? "Unfavorite" : "Favorite", systemImage: record.isFavorite ? "star.slash" : "star")
                        }
                        .tint(.yellow)
                    }
                }
                .onDelete { offsets in
                    let items = visible
                    for index in offsets { modelContext.delete(items[index]) }
                }
            }
            .overlay {
                if visible.isEmpty {
                    if !query.isEmpty {
                        ContentUnavailableView.search(text: query)
                    } else if filter == .favorites {
                        ContentUnavailableView("No favorites yet", systemImage: "star", description: Text("Tap the star on a translation to keep it here."))
                    } else {
                        ContentUnavailableView("No history yet", systemImage: "clock", description: Text("Your translations are saved on this iPhone only."))
                    }
                }
            }
            .searchable(text: $query)
            .navigationTitle("History")
            .navigationDestination(for: TranslationRecord.self) { record in
                HistoryDetailView(record: record)
            }
            .safeAreaInset(edge: .top) {
                Picker("Filter", selection: $filter) {
                    ForEach(Filter.allCases) { Text($0.rawValue).tag($0) }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
                .padding(.bottom, 8)
                .background(.bar)
            }
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button("Clear History (Keep Favorites)", role: .destructive) {
                            confirmClear = true
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                    .disabled(records.isEmpty)
                }
            }
            .confirmationDialog("Clear history?", isPresented: $confirmClear, titleVisibility: .visible) {
                Button("Clear History", role: .destructive) {
                    for record in records where !record.isFavorite {
                        modelContext.delete(record)
                    }
                }
            } message: {
                Text("Favorites are kept.")
            }
        }
    }
}

private struct HistoryRow: View {
    let record: TranslationRecord

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Image(systemName: record.origin.systemImage)
                Text("\(record.sourceLanguage.name) → \(record.targetLanguage.name)")
                Spacer()
                if record.isFavorite {
                    Image(systemName: "star.fill").foregroundStyle(.yellow)
                }
                Text(record.createdAt, format: .relative(presentation: .named))
            }
            .font(.caption)
            .foregroundStyle(.secondary)

            Text(record.sourceText)
                .lineLimit(2)
            Text(record.translatedText)
                .lineLimit(2)
                .foregroundStyle(.tint)
        }
        .padding(.vertical, 2)
    }
}

struct HistoryDetailView: View {
    @Bindable var record: TranslationRecord
    @AppStorage(Prefs.speechRate) private var speechRate = Prefs.defaultSpeechRate

    var body: some View {
        List {
            Section(record.sourceLanguage.name) {
                textRow(record.sourceText, language: record.sourceLanguage)
            }
            Section(record.targetLanguage.name) {
                textRow(record.translatedText, language: record.targetLanguage)
            }
            Section {
                LabeledContent("Saved", value: record.createdAt.formatted(date: .abbreviated, time: .shortened))
                LabeledContent("From", value: record.origin.rawValue.capitalized)
            }
        }
        .navigationTitle("Translation")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    record.isFavorite.toggle()
                } label: {
                    Image(systemName: record.isFavorite ? "star.fill" : "star")
                        .foregroundStyle(.yellow)
                }
                .accessibilityLabel(record.isFavorite ? "Remove from favorites" : "Add to favorites")
            }
            ToolbarItem(placement: .topBarTrailing) {
                ShareLink(item: record.translatedText)
            }
        }
    }

    private func textRow(_ text: String, language: Language) -> some View {
        HStack(alignment: .top) {
            Text(text)
                .font(.title3)
                .textSelection(.enabled)
            Spacer()
            VStack(spacing: 16) {
                Button {
                    Speaker.shared.speak(text, language: language, rate: speechRate)
                } label: {
                    Image(systemName: "speaker.wave.2")
                }
                Button {
                    UIPasteboard.general.string = text
                } label: {
                    Image(systemName: "doc.on.doc")
                }
            }
            .buttonStyle(.borderless)
        }
    }
}
