import Foundation

/// A language the translator can work with, wrapping `Locale.Language`.
struct Language: Identifiable, Hashable {
    /// Identifier used in storage and pickers, e.g. "en", "zh-TW".
    let id: String
    let locale: Locale.Language

    init(_ locale: Locale.Language) {
        self.locale = locale
        self.id = locale.minimalIdentifier
    }

    init(id: String) {
        self.init(Locale.Language(identifier: id))
    }

    /// Name in the person's own UI language, e.g. "Spanish".
    var name: String {
        Locale.current.localizedString(forIdentifier: id)?.capitalized(with: Locale.current) ?? id
    }

    /// Name in the language itself, e.g. "español".
    var nativeName: String {
        Locale(identifier: id).localizedString(forIdentifier: id) ?? name
    }

    var languageCode: String? { locale.languageCode?.identifier }

    /// The most likely script and region, e.g. "zh" → script "Hans", region "CN".
    private var maximal: Locale.Language { Locale.Language(identifier: locale.maximalIdentifier) }
    var script: String? { maximal.script?.identifier }
    var region: String? { maximal.region?.identifier }

    /// BCP-47 tag such as "en-US" for speech and text-recognition APIs.
    var bcp47: String {
        guard let code = languageCode else { return id }
        if let region { return "\(code)-\(region)" }
        return code
    }

    /// Sentinel ID used when the source language should be detected automatically.
    static let autoID = "auto"
}
