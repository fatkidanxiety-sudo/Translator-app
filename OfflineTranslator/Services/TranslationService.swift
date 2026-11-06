import Foundation
import Observation
import Translation

/// Translates text on-device with Apple's Translation framework.
///
/// Apple only hands out a `TranslationSession` through the SwiftUI
/// `.translationTask` modifier, so this service works as a queue:
/// callers `await translate(...)`, the service points `configuration` at the
/// needed language pair (or invalidates it to run again), and `RootView`'s
/// `.translationTask` calls `run(with:)` with a live session that drains the queue.
///
/// Once a language pair is downloaded, translation runs entirely on the device
/// with no network connection. If a pair is missing, the system shows its own
/// download prompt the first time it's used.
@MainActor
@Observable
final class TranslationService {
    /// Observed by `RootView`; changing or invalidating it starts a session.
    var configuration: TranslationSession.Configuration?

    private struct Job {
        let text: String
        let source: Locale.Language
        let target: Locale.Language
        let continuation: CheckedContinuation<String, Error>
    }

    @ObservationIgnored private var queue: [Job] = []
    @ObservationIgnored private var isRunning = false

    /// Translates `text` from `source` to `target`.
    func translate(_ text: String, from source: Language, to target: Language) async throws -> String {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return "" }
        if source.id == target.id { return text }

        return try await withCheckedThrowingContinuation { continuation in
            queue.append(Job(text: text, source: source.locale, target: target.locale, continuation: continuation))
            startNextSessionIfNeeded()
        }
    }

    /// Translates several strings with the same language pair, keeping their order.
    func translate(_ texts: [String], from source: Language, to target: Language) async throws -> [String] {
        var results: [String] = []
        results.reserveCapacity(texts.count)
        for text in texts {
            try Task.checkCancellation()
            results.append(try await translate(text, from: source, to: target))
        }
        return results
    }

    /// Called by `.translationTask` with a session for the current configuration.
    func run(with session: TranslationSession) async {
        defer {
            isRunning = false
            startNextSessionIfNeeded()
        }
        guard let configuration else { return }

        while let job = queue.first,
              job.source == configuration.source,
              job.target == configuration.target {
            queue.removeFirst()
            do {
                let response = try await session.translate(job.text)
                job.continuation.resume(returning: response.targetText)
            } catch {
                job.continuation.resume(throwing: error)
            }
        }
    }

    private func startNextSessionIfNeeded() {
        guard !isRunning, let next = queue.first else { return }
        isRunning = true

        if configuration?.source == next.source, configuration?.target == next.target {
            configuration?.invalidate()
        } else {
            configuration = TranslationSession.Configuration(source: next.source, target: next.target)
        }
    }
}

/// Turns framework errors into short messages people can act on.
enum TranslationErrorText {
    static func describe(_ error: Error) -> String {
        if error is CancellationError { return "Translation was cancelled." }
        if let message = (error as? LocalizedError)?.errorDescription, !message.isEmpty {
            return message
        }
        return "Couldn't translate. Make sure this language pair is downloaded in Settings › Offline Languages."
    }
}
