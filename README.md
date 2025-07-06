# MoneyBook 💰

A beautiful and modern React Native money management app that helps you track your finances with ease.

## Features ✨

- **💸 Transaction Management**: Easy cash in/out transactions with amount validation
- **📊 Real-time Balance**: Live balance updates with persistent storage
- **📝 Transaction History**: Complete transaction log with timestamps and reasons
- **🎨 Modern UI**: Beautiful gradient cards with smooth animations
- **🌙 Dark Mode**: Light/dark theme toggle with persistent preference
- **💾 Offline Storage**: All data stored locally using AsyncStorage
- **🔄 Pull to Refresh**: Refresh transaction history with pull-down gesture
- **❌ Delete Transactions**: Remove transactions with confirmation dialogs
- **📱 Responsive Design**: Optimized for all screen sizes

## Screenshots 📸

The app features a modern design with:

- **Home Screen**: Gradient balance card with transaction input
- **History Screen**: Beautiful transaction cards with icons and colors
- **Settings Screen**: Clean theme toggle with sun/moon icons

## Tech Stack 🛠️

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Tab-based navigation
- **AsyncStorage** - Local data persistence
- **React Native Vector Icons** - Beautiful icons
- **Centralized Styling** - Theme-based design system

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or later)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MoneyBook
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

1. **Start Metro bundler**

   ```bash
   npm start
   # or
   yarn start
   ```

2. **Run on Android**

   ```bash
   npm run android
   # or
   yarn android
   ```

3. **Run on iOS**
   ```bash
   npm run ios
   # or
   yarn ios
   ```

## Building for Production 🏗️

### Android

1. **Build debug APK**

   ```bash
   cd android
   ./gradlew assembleDebug
   ```

2. **Build release APK**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

Built APKs will be available in the `output/` folder.

### iOS

1. **Build for iOS**
   ```bash
   npx react-native run-ios --configuration Release
   ```

## Project Structure 📁

```
src/
├── components/          # Reusable UI components
│   ├── cards/          # Card components
│   └── ui/             # UI elements
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── Home/          # Home screen
│   ├── Profile/       # History screen
│   └── Settings/      # Settings screen
├── store/             # Data management
│   ├── slices/        # Store slices
│   └── types/         # TypeScript interfaces
├── styles/            # Centralized styling
│   ├── theme/         # Theme configuration
│   ├── common/        # Common styles
│   └── components/    # Component styles
├── types/             # Global TypeScript types
└── utils/             # Utility functions
```

## Data Architecture 🏛️

The app uses a centralized store system with:

- **TransactionStore**: Manages all transaction operations
- **ThemeStore**: Handles theme persistence and switching
- **StorageService**: AsyncStorage wrapper for data persistence
- **Type Safety**: Full TypeScript support with interfaces

## Features in Detail 📋

### Transaction Management

- Add cash in/out transactions with validation
- Optional reason field (up to 100 characters)
- Real-time balance calculation
- Success notifications with new balance

### Transaction History

- Chronological list of all transactions
- Color-coded entries (Green for Cash In, Red for Cash Out)
- Delete functionality with confirmation
- Smart balance adjustment on deletion
- Empty state when no transactions exist

### Theme System

- Light and dark theme support
- Persistent theme preference
- Real-time theme switching
- Consistent color scheme across all screens

### Data Persistence

- All data stored locally using AsyncStorage
- No internet connection required
- Automatic data loading on app start
- Robust error handling

## Version History 📝

- **v1.0.0** - Initial release with full money management features
- Beautiful UI with gradient cards and modern design
- Complete transaction system with history
- Theme switching capabilities
- Production-ready builds

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

This project is licensed under the MIT License.

## Support 💬

If you encounter any issues or have questions, please open an issue on the repository.

---

Made with ❤️ using React Native
