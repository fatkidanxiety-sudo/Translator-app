# Offline Translator

An iPhone translator that works with **no internet connection**. Text, voice,
camera, and two-person conversation translation all run on the phone using
Apple's built-in on-device frameworks. No accounts, servers, API keys, or
subscriptions are needed, and nothing you type, say, or photograph leaves the device.

## Features

| Tab | What it does |
| --- | --- |
| **Translate** | Type or paste text, or tap the mic and speak. Detects the source language automatically. Has buttons to speak, copy, share, and favorite the result, and shows a badge that says whether the language pair works offline. |
| **Conversation** | Two people, two languages. Each taps their own mic, and the translation is spoken aloud in the other language. **Face-to-face mode** flips the top half of the screen so the person across the table can read it. |
| **Camera** | Take or pick a photo of a sign, menu, or document. The text is found on-device and translations are laid over the photo. Shows a line-by-line list with copy and speak buttons. |
| **Phrasebook** | About 90 travel phrases in 8 categories (basics, directions, transport, hotel, food, shopping, numbers, emergency), translated into any supported language. Tap a phrase to hear it. |
| **History** | Every translation is saved on the device. You can search it, filter to favorites, swipe to favorite or delete, and clear everything except favorites. |
| **Settings** | Offline language downloads, auto-speak, speaking speed, the history on/off switch, and deleting all data. |

## How "fully offline" works

| Job | Apple framework | Offline? |
| --- | --- | --- |
| Translation | `Translation` (`TranslationSession`) | Yes, once a language is downloaded |
| Language detection | `NaturalLanguage` (`NLLanguageRecognizer`) | Always |
| Speech → text | `Speech` with `requiresOnDeviceRecognition = true` | Yes, for languages that have on-device models |
| Text → speech | `AVFoundation` (`AVSpeechSynthesizer`) | Always (uses the system voices) |
| Text in photos (OCR) | `Vision` (`VNRecognizeTextRequest`) | Always |
| History and favorites | `SwiftData` | Always (stored locally) |

The only step that needs internet is **downloading a language the first time**.
Go to **Settings (gear icon) › Offline Languages** and tap the download arrow
next to each language you want. Do this before you travel. The downloads are
shared with Apple's own Translate app.

## Requirements

- A **Mac** with **Xcode 16 or newer**
- An **iPhone on iOS 18 or newer**. Translation does not work in the Simulator, so use a real device.
- A free Apple ID is enough to run the app on your own phone.

## Running it on your iPhone

1. Clone this repo on your Mac and open `OfflineTranslator.xcodeproj`.
2. In Xcode, select the **OfflineTranslator** target and open **Signing & Capabilities**:
   - Set **Team** to your Apple ID. To add an account, use Xcode › Settings › Accounts.
   - Change **Bundle Identifier** from `com.example.OfflineTranslator` to something
     unique, such as `com.yourname.OfflineTranslator`.
3. Plug in your iPhone, pick it as the run destination, and press **Run** (⌘R).
4. The first time, iOS may block the app. On the iPhone, go to Settings › General ›
   VPN & Device Management and trust your developer certificate. On iOS 16 and later,
   also turn on Settings › Privacy & Security › Developer Mode.
5. In the app, open **Settings › Offline Languages** and download your languages.
6. To test it, turn on **Airplane Mode** and translate something.

## Project layout

```
OfflineTranslator/
├─ App/
│  ├─ OfflineTranslatorApp.swift   App entry and SwiftData container
│  ├─ RootView.swift               Tabs and the shared translation session host
│  └─ Preferences.swift            Setting keys and defaults
├─ Models/
│  ├─ Language.swift               Wraps Locale.Language (names, BCP-47 codes)
│  ├─ TranslationRecord.swift      SwiftData model for history and favorites
│  └─ Phrases.swift                Built-in phrasebook content
├─ Services/
│  ├─ TranslationService.swift     Queue in front of Apple's TranslationSession
│  ├─ LanguageCatalog.swift        Supported languages, detection, download status
│  ├─ SpeechRecognizer.swift       On-device speech → text
│  ├─ Speaker.swift                Text → speech
│  └─ TextRecognizer.swift         On-device text recognition in photos
└─ Views/
   ├─ Translate/  Conversation/  Camera/  Phrasebook/  History/  Settings/
   └─ Components/                  Language picker, language bar, offline badge
```

### A note on the translation architecture

Apple only gives apps a `TranslationSession` through the SwiftUI
`.translationTask(_:action:)` modifier. To let any screen simply call
`try await translator.translate(text, from:, to:)`, `TranslationService` keeps a
queue of requests and points a `TranslationSession.Configuration` at the
needed language pair. `RootView` hosts the one `.translationTask`, receives
the session, and drains the queue. If a pair isn't downloaded yet, iOS shows its
own download prompt automatically.

## Known limits

- **Languages:** Apple's on-device translation supports about 20 languages. The
  exact list depends on the iOS version, and the app reads it at runtime. To cover
  many more languages, you would need to bundle your own models, such as Opus-MT
  or NLLB converted to Core ML. That is a much bigger project.
- **Voice input:** some languages don't have an on-device speech model on every
  iPhone. In that case the app tells you, and typing still works.
- **Camera:** works on photos you take or pick, not as a live camera overlay.

## Ideas for next steps

- Live camera translation with VisionKit's `DataScannerViewController`
- Home Screen and Lock Screen widgets, plus a "Translate" App Intent for Siri and Shortcuts
- A keyboard extension that translates as you type in other apps
- An Apple Watch companion for quick phrases
- On iOS 26 and later, the newer `SpeechAnalyzer` API for faster, more accurate speech recognition
