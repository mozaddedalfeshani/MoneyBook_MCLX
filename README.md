# MoneyBook 💰

A beautiful and modern React Native money management app with **WatermelonDB** database for superior performance and scalability.

## Features ✨

- **💸 Transaction Management**: Easy cash in/out transactions with validation
- **📊 Real-time Balance**: Live balance updates with persistent storage
- **📝 Transaction History**: Complete transaction log with timestamps and reasons
- **🎨 Modern UI**: Beautiful gradient cards with smooth animations
- **🌙 Dark Mode**: Light/dark theme toggle with persistent preference
- **💾 SQLite Database**: Robust WatermelonDB with automatic migration from AsyncStorage
- **🔄 Pull to Refresh**: Refresh transaction history with pull-down gesture
- **❌ Delete Transactions**: Remove transactions with confirmation dialogs
- **📱 Responsive Design**: Optimized for all screen sizes
- **✨ Transparent Icons**: Theme-adaptive app icons for all system contexts

## Screenshots 📸

The app features a modern design with:

- **Home Screen**: Gradient balance card with transaction input
- **History Screen**: Beautiful transaction cards with icons and colors
- **Settings Screen**: Clean theme toggle with sun/moon icons

## Database Architecture 🏛️

### WatermelonDB Integration

MoneyBook now uses **WatermelonDB**, a high-performance React Native database built on SQLite:

- **🚀 Performance**: Optimized for mobile with lazy loading and efficient queries
- **📊 Scalability**: Handles thousands of transactions without performance degradation
- **🔒 Reliability**: ACID transactions with data integrity guarantees
- **🔄 Migration**: Automatic data migration from AsyncStorage to WatermelonDB
- **💾 Persistence**: Robust SQLite storage with backup capabilities

### Database Schema

```sql
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,           -- 'cash_in' or 'cash_out'
  amount REAL NOT NULL,
  reason TEXT,
  date TEXT,
  timestamp INTEGER,
  created_at INTEGER,
  updated_at INTEGER
);
```

## Tech Stack 🛠️

- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript
- **WatermelonDB** - High-performance SQLite database with reactive queries
- **React Navigation** - Tab-based navigation
- **AsyncStorage** - Theme and migration state storage
- **React Native Vector Icons** - Beautiful icons
- **Centralized Styling** - Theme-based design system with dark/light mode
- **Babel Decorators** - ES7 decorators for WatermelonDB models

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or later)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- Yarn package manager (recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MoneyBook
   ```

2. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

1. **Start Metro bundler**

   ```bash
   yarn start
   # or
   npm start
   ```

2. **Run on Android**

   ```bash
   yarn android
   # or
   npm run android
   ```

3. **Run on iOS**
   ```bash
   yarn ios
   # or
   npm run ios
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
├── contexts/           # React contexts (Theme)
├── database/           # WatermelonDB configuration
│   ├── models/         # Database models
│   ├── services/       # Database services
│   ├── index.ts        # Database setup
│   └── schema.ts       # Database schema
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── Home/          # Home screen
│   └── Settings/      # Settings screen
├── store/             # Data management layer
│   ├── slices/        # Store slices (Theme)
│   └── store.ts       # Main store interface
├── styles/            # Centralized styling
│   ├── theme/         # Theme configuration
│   ├── common/        # Common styles
│   └── components/    # Component styles
├── types/             # Global TypeScript types
└── utils/             # Utility functions
```

## Database Migration 🔄

### Automatic Migration

The app automatically migrates existing data from AsyncStorage to WatermelonDB:

- **Seamless**: Users don't lose any existing transaction data
- **One-time**: Migration runs automatically on first launch with v2.0.0
- **Safe**: Original AsyncStorage data is preserved during migration
- **Logging**: Comprehensive migration logging for debugging

### Migration Process

1. **Detection**: Check if migration has already been completed
2. **Data Loading**: Load existing transactions from AsyncStorage
3. **Transfer**: Convert and insert data into WatermelonDB
4. **Verification**: Ensure data integrity and completeness
5. **Completion**: Mark migration as complete to prevent re-runs

## App Icons 🎨

### Transparent Adaptive Icons

MoneyBook features professionally designed app icons that adapt to any theme:

- **🌈 Theme Adaptive**: Icons automatically adapt to light/dark system themes
- **✨ Transparent Background**: No jarring backgrounds in any theme
- **💎 Professional Design**: Dollar sign, data stack, and user flow icons
- **📱 Multi-Resolution**: Optimized for all device densities (MDPI to XXXHDPI)
- **🍎 iOS Ready**: Complete icon set including App Store requirements

## Features in Detail 📋

### Transaction Management

- Add cash in/out transactions with validation
- Optional reason field (up to 100 characters)
- Real-time balance calculation with database optimization
- Success notifications with new balance

### Transaction History

- Chronological list of all transactions from database
- Color-coded entries (Green for Cash In, Red for Cash Out)
- Delete functionality with confirmation and balance adjustment
- Efficient database queries with pagination support
- Empty state when no transactions exist

### Theme System

- Light and dark theme support with persistent storage
- Real-time theme switching across all components
- Consistent color scheme with centralized theme management
- Adaptive app icons that change with system theme

### Database Performance

- **Lazy Loading**: Only load transactions when needed
- **Indexed Queries**: Fast lookups with database indexes
- **Background Operations**: Non-blocking database operations
- **Memory Efficient**: Reduced memory footprint compared to AsyncStorage
- **Concurrent Safe**: Thread-safe database operations

## Version History 📝

- **v1.0.0**: Initial release with AsyncStorage

  - Basic money management features
  - Transaction history with AsyncStorage
  - Theme switching capabilities

- **v1.1.0**: Icon and UI improvements

  - Updated app icon design
  - Enhanced UI components
  - Better navigation experience

- **v1.2.0**: Transparent icon adaptation

  - Theme-adaptive transparent app icons
  - Enhanced dark/light mode support
  - Improved visual consistency

- **v2.0.0**: **WatermelonDB Migration** (current)
  - **Complete database migration** from AsyncStorage to WatermelonDB
  - **Automatic data migration** with zero user impact
  - **Enhanced performance** for large transaction datasets
  - **Improved reliability** with ACID transactions
  - **Scalable architecture** ready for advanced features
  - **Backwards compatible** interface maintaining all existing functionality

## Available Builds 📦

```
output/
├── MoneyBook-v1.0.0-release.apk          # AsyncStorage (53MB)
├── MoneyBook-v1.1.0-release.apk          # Icon updates (53MB)
├── MoneyBook-v1.2.0-transparent-release.apk # Transparent icons (53MB)
└── MoneyBook-v2.0.0-WatermelonDB-release.apk # WatermelonDB (54MB) ⭐
```

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

Made with ❤️ using React Native and WatermelonDB

_Now powered by professional-grade database technology for superior performance and reliability._
