import AVFoundation
import SwiftData
import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    @AppStorage(Prefs.autoSpeak) private var autoSpeak = false
    @AppStorage(Prefs.conversationAutoSpeak) private var conversationAutoSpeak = true
    @AppStorage(Prefs.saveHistory) private var saveHistory = true
    @AppStorage(Prefs.speechRate) private var speechRate = Prefs.defaultSpeechRate

    @State private var confirmDeleteAll = false

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    NavigationLink {
                        LanguagePacksView()
                    } label: {
                        Label("Offline Languages", systemImage: "arrow.down.circle")
                    }
                } footer: {
                    Text("Download the languages you need while you have internet. After that, text, voice, camera and conversation translation all work in airplane mode.")
                }

                Section("Speech") {
                    Toggle("Speak translations automatically", isOn: $autoSpeak)
                    Toggle("Speak in conversation mode", isOn: $conversationAutoSpeak)
                    VStack(alignment: .leading) {
                        Text("Speaking speed")
                        Slider(
                            value: $speechRate,
                            in: Double(AVSpeechUtteranceMinimumSpeechRate)...Double(AVSpeechUtteranceMaximumSpeechRate)
                        ) {
                            Text("Speaking speed")
                        } minimumValueLabel: {
                            Image(systemName: "tortoise")
                        } maximumValueLabel: {
                            Image(systemName: "hare")
                        }
                    }
                    Button("Test Voice") {
                        Speaker.shared.speak("This is how translations will sound.", language: Language(id: "en"), rate: speechRate)
                    }
                }

                Section {
                    Toggle("Save translation history", isOn: $saveHistory)
                    Button("Delete All History and Favorites", role: .destructive) {
                        confirmDeleteAll = true
                    }
                } header: {
                    Text("Privacy")
                } footer: {
                    Text("Everything is processed on this device. Text, photos and voice are never sent anywhere, and history is stored only on this iPhone.")
                }

                Section("About") {
                    LabeledContent("Version", value: Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0")
                    Text("Translation by Apple's on-device Translation framework. Speech, voices and text recognition by iOS.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
            .confirmationDialog("Delete everything?", isPresented: $confirmDeleteAll, titleVisibility: .visible) {
                Button("Delete All", role: .destructive) {
                    try? modelContext.delete(model: TranslationRecord.self)
                }
            } message: {
                Text("This removes all history and favorites from this iPhone.")
            }
        }
    }
}
