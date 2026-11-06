import Foundation
import NaturalLanguage
import Observation
import Translation

/// Whether a language pair can be translated without a network connection.
enum PairStatus: Equatable {
    case unknown
    /// Downloaded; works fully offline.
    case installed
    /// Supported, but the language files still need to be downloaded once.
    case needsDownload
    case unsupported
}

/// The list of languages Apple's on-device translation supports,
/// plus helpers for language detection and download status.
@MainActor
@Observable
final class LanguageCatalog {
    private(set) var languages: [Language] = []
    private(set) var isLoaded = false

    private let availability = LanguageAvailability()

    func loadIfNeeded() async {
        guard !isLoaded else { return }
        let supported = await availability.supportedLanguages

        var seen = Set<String>()
        var result: [Language] = []
        for locale in supported {
            let language = Language(locale)
            if seen.insert(language.id).inserted {
                result.append(language)
            }
        }
        languages = result.sorted { $0.name.localizedCaseInsensitiveCompare($1.name) == .orderedAscending }
        isLoaded = true
    }

    /// Looks up a stored language ID, falling back to a best match.
    func language(id: String) -> Language {
        if let exact = languages.first(where: { $0.id == id }) { return exact }
        return bestMatch(for: Language(id: id)) ?? Language(id: id)
    }

    /// Finds the supported language closest to `language`
    /// (same code and script first, then same code).
    func bestMatch(for language: Language) -> Language? {
        if let exact = languages.first(where: { $0.id == language.id }) { return exact }
        let sameCode = languages.filter { $0.languageCode == language.languageCode }
        return sameCode.first(where: { $0.script == language.script && $0.region == language.region })
            ?? sameCode.first(where: { $0.script == language.script })
            ?? sameCode.first
    }

    /// Detects the language of `text` on-device and maps it to a supported language.
    func detectLanguage(of text: String) -> Language? {
        let recognizer = NLLanguageRecognizer()
        recognizer.processString(text)
        let hypotheses = recognizer.languageHypotheses(withMaximum: 5)
            .sorted { $0.value > $1.value }

        for (nlLanguage, _) in hypotheses where nlLanguage != .undetermined {
            if let match = bestMatch(for: Language(id: nlLanguage.rawValue)) {
                return match
            }
        }
        return nil
    }

    /// Whether `source` → `target` is downloaded and ready for offline use.
    func status(from source: Language, to target: Language) async -> PairStatus {
        if source.id == target.id { return .installed }
        let status = (try? await availability.status(from: source.locale, to: target.locale)) ?? .unsupported
        switch status {
        case .installed: return .installed
        case .supported: return .needsDownload
        case .unsupported: return .unsupported
        @unknown default: return .unknown
        }
    }
}
