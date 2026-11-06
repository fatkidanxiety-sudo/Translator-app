import SwiftUI

/// A searchable list of supported languages, optionally with "Detect Language".
struct LanguagePickerSheet: View {
    let title: String
    @Binding var selection: String
    var allowsAutoDetect = false

    @Environment(LanguageCatalog.self) private var catalog
    @Environment(\.dismiss) private var dismiss
    @State private var query = ""

    private var filtered: [Language] {
        guard !query.isEmpty else { return catalog.languages }
        return catalog.languages.filter {
            $0.name.localizedCaseInsensitiveContains(query)
                || $0.nativeName.localizedCaseInsensitiveContains(query)
                || $0.id.localizedCaseInsensitiveContains(query)
        }
    }

    var body: some View {
        NavigationStack {
            List {
                if allowsAutoDetect, query.isEmpty {
                    row(id: Language.autoID, title: "Detect Language", subtitle: "Identified on-device", systemImage: "sparkles")
                }
                ForEach(filtered) { language in
                    row(id: language.id, title: language.name, subtitle: language.nativeName, systemImage: nil)
                }
            }
            .overlay {
                if !catalog.isLoaded {
                    ProgressView("Loading languages…")
                } else if filtered.isEmpty {
                    ContentUnavailableView.search(text: query)
                }
            }
            .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always))
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private func row(id: String, title: String, subtitle: String, systemImage: String?) -> some View {
        Button {
            selection = id
            dismiss()
        } label: {
            HStack {
                if let systemImage {
                    Image(systemName: systemImage).foregroundStyle(.tint)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).foregroundStyle(.primary)
                    if subtitle != title {
                        Text(subtitle).font(.caption).foregroundStyle(.secondary)
                    }
                }
                Spacer()
                if selection == id {
                    Image(systemName: "checkmark").foregroundStyle(.tint).fontWeight(.semibold)
                }
            }
            .contentShape(Rectangle())
        }
    }
}

/// A capsule button that shows a language name and opens the picker.
struct LanguageButton: View {
    let title: String
    @Binding var selection: String
    var allowsAutoDetect = false

    @Environment(LanguageCatalog.self) private var catalog
    @State private var isPicking = false

    var label: String {
        selection == Language.autoID ? "Detect Language" : catalog.language(id: selection).name
    }

    var body: some View {
        Button {
            isPicking = true
        } label: {
            Text(label)
                .font(.subheadline.weight(.semibold))
                .lineLimit(1)
                .minimumScaleFactor(0.7)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .padding(.horizontal, 8)
                .background(.thinMaterial, in: Capsule())
        }
        .buttonStyle(.plain)
        .sheet(isPresented: $isPicking) {
            LanguagePickerSheet(title: title, selection: $selection, allowsAutoDetect: allowsAutoDetect)
        }
    }
}

/// Source and target language buttons with a swap button between them.
struct LanguageBar: View {
    @Binding var sourceID: String
    @Binding var targetID: String
    var allowsAutoDetect = true
    /// Shown in place of "Detect Language" after detection, e.g. "Spanish (detected)".
    var detectedLanguage: Language?

    var body: some View {
        HStack(spacing: 8) {
            LanguageButton(title: "Translate From", selection: $sourceID, allowsAutoDetect: allowsAutoDetect)
                .overlay(alignment: .bottom) {
                    if sourceID == Language.autoID, let detectedLanguage {
                        Text("\(detectedLanguage.name) detected")
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                            .offset(y: 16)
                    }
                }

            Button {
                swap()
            } label: {
                Image(systemName: "arrow.left.arrow.right")
                    .font(.body.weight(.semibold))
                    .frame(width: 40, height: 40)
            }
            .buttonStyle(.bordered)
            .clipShape(Circle())
            .disabled(sourceID == Language.autoID && detectedLanguage == nil)
            .accessibilityLabel("Swap languages")

            LanguageButton(title: "Translate To", selection: $targetID)
        }
    }

    private func swap() {
        let newTarget = sourceID == Language.autoID ? (detectedLanguage?.id ?? targetID) : sourceID
        sourceID = targetID
        targetID = newTarget
    }
}

/// Shows whether the current language pair works without internet.
struct OfflineStatusBadge: View {
    let status: PairStatus

    var body: some View {
        switch status {
        case .installed:
            Label("Works offline", systemImage: "checkmark.icloud")
                .font(.caption.weight(.medium))
                .foregroundStyle(.green)
        case .needsDownload:
            Label("Download needed for offline use", systemImage: "arrow.down.circle")
                .font(.caption.weight(.medium))
                .foregroundStyle(.orange)
        case .unsupported:
            Label("This pair isn't supported", systemImage: "exclamationmark.triangle")
                .font(.caption.weight(.medium))
                .foregroundStyle(.red)
        case .unknown:
            EmptyView()
        }
    }
}
