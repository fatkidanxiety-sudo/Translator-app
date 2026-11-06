import SwiftUI

extension Binding where Value == Bool {
    /// True while `value` holds something; setting false clears it.
    /// Handy for driving alerts from an optional error message.
    init<Wrapped>(isPresent value: Binding<Wrapped?>) {
        self.init(
            get: { value.wrappedValue != nil },
            set: { if !$0 { value.wrappedValue = nil } }
        )
    }
}
