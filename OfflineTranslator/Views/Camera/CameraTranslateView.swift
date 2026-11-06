import PhotosUI
import SwiftData
import SwiftUI
import UIKit

/// Take or pick a photo, find its text on-device, and lay translations over it.
struct CameraTranslateView: View {
    struct Block: Identifiable {
        let id = UUID()
        let original: String
        let translated: String
        let boundingBox: CGRect
    }

    @Environment(TranslationService.self) private var translator
    @Environment(LanguageCatalog.self) private var catalog
    @Environment(\.modelContext) private var modelContext

    @AppStorage(Prefs.sourceLanguage) private var sourceID = Language.autoID
    @AppStorage(Prefs.targetLanguage) private var targetID = Prefs.defaultTargetID
    @AppStorage(Prefs.saveHistory) private var saveHistory = true
    @AppStorage(Prefs.speechRate) private var speechRate = Prefs.defaultSpeechRate

    @State private var image: UIImage?
    @State private var blocks: [Block] = []
    @State private var detectedLanguage: Language?
    @State private var pickerItem: PhotosPickerItem?
    @State private var showCamera = false
    @State private var showOriginal = false
    @State private var status: String?
    @State private var errorMessage: String?
    @State private var processing: Task<Void, Never>?

    private var cameraAvailable: Bool { UIImagePickerController.isSourceTypeAvailable(.camera) }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    LanguageBar(sourceID: $sourceID, targetID: $targetID, detectedLanguage: detectedLanguage)
                        .padding(.bottom, detectedLanguage != nil && sourceID == Language.autoID ? 8 : 0)

                    if let image {
                        TranslatedImageView(image: image, blocks: blocks, showOriginal: showOriginal)
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            .overlay {
                                if let status {
                                    VStack(spacing: 8) {
                                        ProgressView()
                                        Text(status).font(.callout.weight(.medium))
                                    }
                                    .padding()
                                    .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 12))
                                }
                            }

                        if !blocks.isEmpty {
                            Picker("Show", selection: $showOriginal) {
                                Text("Translation").tag(false)
                                Text("Original").tag(true)
                            }
                            .pickerStyle(.segmented)

                            linesList
                        } else if status == nil {
                            Text("No text found in this photo.")
                                .foregroundStyle(.secondary)
                        }
                    } else {
                        ContentUnavailableView(
                            "Translate text in photos",
                            systemImage: "text.viewfinder",
                            description: Text("Signs, menus, labels, documents. Text is found and translated on your iPhone — nothing is uploaded.")
                        )
                        .padding(.vertical, 40)
                    }

                    sourceButtons
                }
                .padding()
            }
            .navigationTitle("Camera")
            .toolbar {
                if image != nil {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Clear") { clear() }
                    }
                }
            }
            .fullScreenCover(isPresented: $showCamera) {
                CameraPicker { captured in
                    load(captured)
                }
                .ignoresSafeArea()
            }
            .onChange(of: pickerItem) { _, item in
                guard let item else { return }
                Task {
                    if let data = try? await item.loadTransferable(type: Data.self),
                       let picked = UIImage(data: data) {
                        load(picked)
                    } else {
                        errorMessage = "Couldn't open that photo."
                    }
                    pickerItem = nil
                }
            }
            .onChange(of: targetID) { _, _ in rerun() }
            .onChange(of: sourceID) { _, _ in rerun() }
            .alert("Something went wrong", isPresented: Binding(isPresent: $errorMessage), presenting: errorMessage) { _ in
                Button("OK") { errorMessage = nil }
            } message: { message in
                Text(message)
            }
        }
    }

    private var sourceButtons: some View {
        HStack(spacing: 12) {
            if cameraAvailable {
                Button {
                    showCamera = true
                } label: {
                    Label("Take Photo", systemImage: "camera.fill")
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 6)
                }
                .buttonStyle(.borderedProminent)
            }

            PhotosPicker(selection: $pickerItem, matching: .images) {
                Label("Choose Photo", systemImage: "photo.on.rectangle")
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 6)
            }
            .buttonStyle(.bordered)
        }
    }

    private var linesList: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Text in photo").font(.headline)
                Spacer()
                Button {
                    UIPasteboard.general.string = blocks.map(\.translated).joined(separator: "\n")
                } label: {
                    Label("Copy All", systemImage: "doc.on.doc")
                        .font(.subheadline)
                }
            }
            .padding(.bottom, 8)

            ForEach(blocks) { block in
                VStack(alignment: .leading, spacing: 4) {
                    Text(block.original)
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    HStack(alignment: .top) {
                        Text(block.translated)
                            .textSelection(.enabled)
                        Spacer()
                        Button {
                            Speaker.shared.speak(block.translated, language: catalog.language(id: targetID), rate: speechRate)
                        } label: {
                            Image(systemName: "speaker.wave.2")
                        }
                        .accessibilityLabel("Speak")
                    }
                }
                .padding(.vertical, 8)
                Divider()
            }
        }
        .padding()
        .background(.background.secondary, in: RoundedRectangle(cornerRadius: 16))
    }

    // MARK: - Processing

    private func load(_ newImage: UIImage) {
        image = newImage.normalizedForRecognition()
        rerun()
    }

    private func clear() {
        processing?.cancel()
        image = nil
        blocks = []
        status = nil
        detectedLanguage = nil
    }

    private func rerun() {
        guard let image else { return }
        processing?.cancel()
        processing = Task { await process(image) }
    }

    private func process(_ image: UIImage) async {
        guard let cgImage = image.cgImage else { return }
        blocks = []
        showOriginal = false
        defer { status = nil }

        do {
            status = "Finding text…"
            let preferred = sourceID == Language.autoID ? nil : catalog.language(id: sourceID)
            let lines = try await TextRecognizer.recognizeText(in: cgImage, preferring: preferred)
            try Task.checkCancellation()
            guard !lines.isEmpty else { return }

            let source: Language
            if let preferred {
                source = preferred
                detectedLanguage = nil
            } else if let detected = catalog.detectLanguage(of: lines.map(\.text).joined(separator: " ")) {
                source = detected
                detectedLanguage = detected
            } else {
                errorMessage = "Couldn't tell which language the text is in. Pick it in the “from” button."
                return
            }
            let target = catalog.language(id: targetID)

            status = "Translating…"
            let translations = try await translator.translate(lines.map(\.text), from: source, to: target)
            try Task.checkCancellation()

            blocks = zip(lines, translations).map { line, translated in
                Block(original: line.text, translated: translated, boundingBox: line.boundingBox)
            }

            if saveHistory {
                TranslationRecord.save(
                    in: modelContext,
                    source: lines.map(\.text).joined(separator: "\n"),
                    translation: translations.joined(separator: "\n"),
                    from: source,
                    to: target,
                    origin: .camera
                )
            }
        } catch is CancellationError {
            return
        } catch {
            errorMessage = TranslationErrorText.describe(error)
        }
    }
}

/// The photo with each recognized line covered by its translation.
private struct TranslatedImageView: View {
    let image: UIImage
    let blocks: [CameraTranslateView.Block]
    let showOriginal: Bool

    var body: some View {
        Image(uiImage: image)
            .resizable()
            .scaledToFit()
            .overlay {
                GeometryReader { geometry in
                    let size = geometry.size
                    ForEach(blocks) { block in
                        let rect = CGRect(
                            x: block.boundingBox.minX * size.width,
                            y: (1 - block.boundingBox.maxY) * size.height,
                            width: block.boundingBox.width * size.width,
                            height: block.boundingBox.height * size.height
                        )
                        if !showOriginal {
                            Text(block.translated)
                                .font(.system(size: max(rect.height * 0.75, 8), weight: .semibold))
                                .lineLimit(1)
                                .minimumScaleFactor(0.3)
                                .foregroundStyle(.black)
                                .padding(.horizontal, 2)
                                .frame(width: max(rect.width, 20), height: max(rect.height, 10))
                                .background(Color.white.opacity(0.88), in: RoundedRectangle(cornerRadius: 3))
                                .position(x: rect.midX, y: rect.midY)
                        }
                    }
                }
            }
    }
}

/// Wraps the system camera for taking a single photo.
struct CameraPicker: UIViewControllerRepresentable {
    var onCapture: (UIImage) -> Void
    @Environment(\.dismiss) private var dismiss

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {
        context.coordinator.parent = self
    }

    func makeCoordinator() -> Coordinator { Coordinator(parent: self) }

    final class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        var parent: CameraPicker

        init(parent: CameraPicker) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.onCapture(image)
            }
            parent.dismiss()
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.dismiss()
        }
    }
}
