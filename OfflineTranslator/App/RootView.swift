import SwiftUI
import Translation

struct RootView: View {
    @Environment(TranslationService.self) private var translator
    @Environment(LanguageCatalog.self) private var catalog

    var body: some View {
        TabView {
            TranslateView()
                .tabItem { Label("Translate", systemImage: "character.bubble") }

            ConversationView()
                .tabItem { Label("Conversation", systemImage: "person.2.wave.2") }

            CameraTranslateView()
                .tabItem { Label("Camera", systemImage: "camera.viewfinder") }

            PhrasebookView()
                .tabItem { Label("Phrasebook", systemImage: "book.closed") }

            HistoryView()
                .tabItem { Label("History", systemImage: "clock.arrow.circlepath") }
        }
        // The single place where Apple's on-device translation session lives.
        // Every screen asks `TranslationService` for translations; the service
        // flips this configuration, and the framework hands us a session here.
        // Because the root view never goes away, the session host is always alive.
        .translationTask(translator.configuration) { session in
            await translator.run(with: session)
        }
        .task {
            await catalog.loadIfNeeded()
        }
    }
}
