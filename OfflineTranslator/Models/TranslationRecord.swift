import Foundation
import SwiftData

/// A saved translation, shown in History and Favorites.
@Model
final class TranslationRecord {
    var sourceText: String
    var translatedText: String
    var sourceLanguageID: String
    var targetLanguageID: String
    var createdAt: Date
    var isFavorite: Bool
    /// Where the translation came from: see `TranslationOrigin`.
    var originRaw: String

    init(
        sourceText: String,
        translatedText: String,
        sourceLanguageID: String,
        targetLanguageID: String,
        origin: TranslationOrigin,
        isFavorite: Bool = false,
        createdAt: Date = .now
    ) {
        self.sourceText = sourceText
        self.translatedText = translatedText
        self.sourceLanguageID = sourceLanguageID
        self.targetLanguageID = targetLanguageID
        self.originRaw = origin.rawValue
        self.isFavorite = isFavorite
        self.createdAt = createdAt
    }

    var origin: TranslationOrigin { TranslationOrigin(rawValue: originRaw) ?? .text }
    var sourceLanguage: Language { Language(id: sourceLanguageID) }
    var targetLanguage: Language { Language(id: targetLanguageID) }
}

enum TranslationOrigin: String, CaseIterable {
    case text, voice, camera, conversation, phrase

    var systemImage: String {
        switch self {
        case .text: "keyboard"
        case .voice: "mic"
        case .camera: "camera"
        case .conversation: "person.2"
        case .phrase: "book.closed"
        }
    }
}

extension TranslationRecord {
    /// Saves a record unless it duplicates the most recent one.
    @discardableResult
    static func save(
        in context: ModelContext,
        source: String,
        translation: String,
        from sourceLanguage: Language,
        to targetLanguage: Language,
        origin: TranslationOrigin,
        favorite: Bool = false
    ) -> TranslationRecord {
        var latest = FetchDescriptor<TranslationRecord>(sortBy: [SortDescriptor(\.createdAt, order: .reverse)])
        latest.fetchLimit = 1
        if let last = try? context.fetch(latest).first,
           last.sourceText == source,
           last.translatedText == translation,
           last.targetLanguageID == targetLanguage.id {
            if favorite { last.isFavorite = true }
            return last
        }

        let record = TranslationRecord(
            sourceText: source,
            translatedText: translation,
            sourceLanguageID: sourceLanguage.id,
            targetLanguageID: targetLanguage.id,
            origin: origin,
            isFavorite: favorite
        )
        context.insert(record)
        return record
    }
}
