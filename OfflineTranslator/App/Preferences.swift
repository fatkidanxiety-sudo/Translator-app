import AVFoundation
import Foundation

/// Keys and defaults for values stored with `@AppStorage`.
enum Prefs {
    static let sourceLanguage = "sourceLanguage"
    static let targetLanguage = "targetLanguage"
    static let conversationLanguageA = "conversationLanguageA"
    static let conversationLanguageB = "conversationLanguageB"
    static let phrasebookLanguage = "phrasebookLanguage"
    static let autoSpeak = "autoSpeak"
    static let conversationAutoSpeak = "conversationAutoSpeak"
    static let saveHistory = "saveHistory"
    static let speechRate = "speechRate"

    static let defaultSpeechRate = Double(AVSpeechUtteranceDefaultSpeechRate)

    /// The language the person most likely speaks, e.g. "en".
    static var deviceLanguageID: String {
        Locale.preferredLanguages.first
            .map { Locale.Language(identifier: $0).minimalIdentifier } ?? "en"
    }

    /// A sensible first target: Spanish for English speakers, English for everyone else.
    static var defaultTargetID: String {
        Locale.Language(identifier: deviceLanguageID).languageCode?.identifier == "en" ? "es" : "en"
    }
}
