import SwiftData
import SwiftUI

@main
struct OfflineTranslatorApp: App {
    @State private var translator = TranslationService()
    @State private var catalog = LanguageCatalog()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(translator)
                .environment(catalog)
        }
        .modelContainer(for: TranslationRecord.self)
    }
}
