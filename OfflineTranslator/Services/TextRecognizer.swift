import CoreGraphics
import Foundation
import UIKit
import Vision

/// A line of text found in a photo.
struct RecognizedLine: Identifiable {
    let id = UUID()
    let text: String
    /// Vision's normalized box: 0...1, origin at the bottom-left.
    let boundingBox: CGRect
}

/// On-device text recognition (OCR) using Vision.
enum TextRecognizer {
    /// Finds text lines in `image`. Pass a language to bias recognition toward it.
    static func recognizeText(in image: CGImage, preferring language: Language?) async throws -> [RecognizedLine] {
        try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                let request = VNRecognizeTextRequest()
                request.recognitionLevel = .accurate
                request.usesLanguageCorrection = true
                request.automaticallyDetectsLanguage = true

                if let language,
                   let supported = try? request.supportedRecognitionLanguages() {
                    let wanted = [language.bcp47, language.id, language.languageCode ?? ""]
                    if let match = supported.first(where: { wanted.contains($0) })
                        ?? supported.first(where: { $0.hasPrefix((language.languageCode ?? "") + "-") }) {
                        request.automaticallyDetectsLanguage = false
                        request.recognitionLanguages = [match]
                    }
                }

                let handler = VNImageRequestHandler(cgImage: image, orientation: .up)
                do {
                    try handler.perform([request])
                    let lines = (request.results ?? []).compactMap { observation -> RecognizedLine? in
                        guard let candidate = observation.topCandidates(1).first else { return nil }
                        let text = candidate.string.trimmingCharacters(in: .whitespacesAndNewlines)
                        guard !text.isEmpty else { return nil }
                        return RecognizedLine(text: text, boundingBox: observation.boundingBox)
                    }
                    // Reading order: top to bottom, then left to right.
                    let sorted = lines.sorted {
                        abs($0.boundingBox.midY - $1.boundingBox.midY) > 0.01
                            ? $0.boundingBox.midY > $1.boundingBox.midY
                            : $0.boundingBox.minX < $1.boundingBox.minX
                    }
                    continuation.resume(returning: sorted)
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
}

extension UIImage {
    /// Redraws the image upright and no larger than `maxDimension`, so Vision's
    /// coordinates line up with what's shown on screen and recognition stays fast.
    func normalizedForRecognition(maxDimension: CGFloat = 2048) -> UIImage {
        let longest = max(size.width, size.height)
        let scale = longest > maxDimension ? maxDimension / longest : 1
        let targetSize = CGSize(width: (size.width * scale).rounded(), height: (size.height * scale).rounded())

        let format = UIGraphicsImageRendererFormat.default()
        format.scale = 1
        return UIGraphicsImageRenderer(size: targetSize, format: format).image { _ in
            draw(in: CGRect(origin: .zero, size: targetSize))
        }
    }
}
