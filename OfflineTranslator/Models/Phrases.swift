import Foundation

/// Built-in English phrases. They are translated on-device into whatever
/// language is chosen, so no per-language phrase files need to ship with the app.
struct PhraseCategory: Identifiable, Hashable {
    let id: String
    let title: String
    let systemImage: String
    let phrases: [String]
}

enum Phrasebook {
    static let sourceLanguageID = "en"

    static let categories: [PhraseCategory] = [
        PhraseCategory(id: "basics", title: "Basics", systemImage: "hand.wave", phrases: [
            "Hello",
            "Good morning",
            "Good evening",
            "Goodbye",
            "Please",
            "Thank you very much",
            "You're welcome",
            "Yes",
            "No",
            "Excuse me",
            "I'm sorry",
            "I don't understand",
            "Do you speak English?",
            "Could you speak more slowly, please?",
            "Could you write that down for me?",
            "What is your name?",
            "My name is…",
            "Nice to meet you",
        ]),
        PhraseCategory(id: "directions", title: "Directions", systemImage: "map", phrases: [
            "Where is the bathroom?",
            "Where is the train station?",
            "Where is the bus stop?",
            "Where is the nearest pharmacy?",
            "How do I get to the airport?",
            "Is it far from here?",
            "Can I walk there?",
            "Turn left",
            "Turn right",
            "Go straight ahead",
            "Can you show me on the map?",
            "I'm lost",
        ]),
        PhraseCategory(id: "transport", title: "Transport", systemImage: "tram", phrases: [
            "One ticket, please",
            "A return ticket, please",
            "How much is a ticket?",
            "When does the next train leave?",
            "Which platform is it?",
            "Does this bus go to the city center?",
            "Please take me to this address",
            "Please stop here",
            "How long does it take?",
            "Can you call a taxi for me?",
        ]),
        PhraseCategory(id: "hotel", title: "Hotel", systemImage: "bed.double", phrases: [
            "I have a reservation",
            "Do you have a room available?",
            "For two nights",
            "What time is check-out?",
            "Is breakfast included?",
            "What is the Wi-Fi password?",
            "The air conditioning isn't working",
            "Could I have another towel?",
            "Can I leave my luggage here?",
        ]),
        PhraseCategory(id: "dining", title: "Food & Drink", systemImage: "fork.knife", phrases: [
            "A table for two, please",
            "Can I see the menu?",
            "What do you recommend?",
            "I'm vegetarian",
            "I'm allergic to nuts",
            "Does this contain gluten?",
            "Not spicy, please",
            "Water, please",
            "Another one, please",
            "It was delicious",
            "The check, please",
            "Can I pay by card?",
        ]),
        PhraseCategory(id: "shopping", title: "Shopping", systemImage: "bag", phrases: [
            "How much does this cost?",
            "That's too expensive",
            "Do you have a smaller size?",
            "Do you have a larger size?",
            "Can I try this on?",
            "I'm just looking",
            "I'll take it",
            "Do you accept credit cards?",
            "Can I get a receipt?",
            "Where can I find a supermarket?",
        ]),
        PhraseCategory(id: "numbers", title: "Numbers & Time", systemImage: "number", phrases: [
            "One, two, three, four, five",
            "Six, seven, eight, nine, ten",
            "What time is it?",
            "Today",
            "Tomorrow",
            "Yesterday",
            "In the morning",
            "In the afternoon",
            "At night",
            "What time does it open?",
            "What time does it close?",
        ]),
        PhraseCategory(id: "emergency", title: "Emergency", systemImage: "cross.case", phrases: [
            "Help!",
            "Call an ambulance!",
            "Call the police!",
            "I need a doctor",
            "Where is the hospital?",
            "I don't feel well",
            "It hurts here",
            "I lost my passport",
            "My wallet was stolen",
            "Is there someone who speaks English?",
            "I need to contact my embassy",
            "I'm allergic to penicillin",
        ]),
    ]
}
