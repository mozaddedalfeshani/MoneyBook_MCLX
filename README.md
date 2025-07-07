# MoneyBook 💰

A beautiful and modern React Native money management app with **WatermelonDB** database and **Account Management** for superior organization and performance.

## Features ✨

- **🏦 Account Management**: Create and manage multiple accounts with individual balances
- **💸 Transaction Management**: Easy cash in/out transactions with validation and custom dates
- **📊 Real-time Balance**: Live balance updates per account with persistent storage
- **📝 Transaction History**: Complete transaction log with timestamps, reasons, and filtering
- **🎨 Modern UI**: Beautiful gradient cards with smooth animations and responsive design
- **🌙 Dark Mode**: Light/dark theme toggle with persistent preference
- **💾 SQLite Database**: Robust WatermelonDB with automatic migration from AsyncStorage
- **🔄 Pull to Refresh**: Refresh transaction history with pull-down gesture
- **❌ Delete Transactions**: Remove transactions with confirmation dialogs
- **✏️ Edit Transactions**: Modify existing transactions with date picker support
- **📅 Custom Date Selection**: Add transactions with custom dates using date picker
- **🔍 Transaction Filtering**: Filter by credit, debit, or all transactions
- **📱 Responsive Design**: Optimized for all screen sizes with adaptive layouts
- **✨ Transparent Icons**: Theme-adaptive app icons for all system contexts
- **⚠️ Negative Balance Alerts**: Visual warnings for accounts running negative

## Screenshots 📸

The app features a modern design with:

- **Home Screen**: Gradient balance card with transaction input
- **Account Detail Screen**: Comprehensive account management with transaction filtering
- **History Screen**: Beautiful transaction cards with icons and colors
- **Settings Screen**: Clean theme toggle with sun/moon icons
- **Transaction Modals**: Intuitive forms for adding and editing transactions

## Database Architecture 🏛️

### WatermelonDB Integration

MoneyBook uses **WatermelonDB**, a high-performance React Native database built on SQLite:

- **🚀 Performance**: Optimized for mobile with lazy loading and efficient queries
- **📊 Scalability**: Handles thousands of transactions across multiple accounts
- **🔒 Reliability**: ACID transactions with data integrity guarantees
- **🔄 Migration**: Automatic data migration from AsyncStorage to WatermelonDB
- **💾 Persistence**: Robust SQLite storage with backup capabilities

### Database Schema

```sql
-- Accounts table
CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

-- Transactions table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  type TEXT NOT NULL,           -- 'cash_in' or 'cash_out'
  amount REAL NOT NULL,
  reason TEXT,
  date TEXT,
  timestamp INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  FOREIGN KEY (account_id) REFERENCES accounts (id)
);
```

## Tech Stack ��️

- **React Native 0.80.1** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript
- **WatermelonDB** - High-performance SQLite database with reactive queries
- **React Navigation** - Tab and stack-based navigation
- **React Native Vector Icons** - Beautiful icons (FontAwesome5, MaterialIcons)
- **React Native Date Picker** - Custom date selection for transactions
- **React Native Linear Gradient** - Beautiful gradient backgrounds
- **React Native Safe Area Context** - Screen compatibility
- **React Native Async Storage** - Theme and migration state storage
- **Centralized Styling** - Theme-based design system with dark/light mode
- **Babel Decorators** - ES7 decorators for WatermelonDB models

## Getting Started 🚀

### Prerequisites

- Node.js (v18 or later)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)
- Yarn package manager (recommended)
- Java OpenJDK 17 (for Android builds)

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

3. **Build release AAB (Google Play Store)**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

Built artifacts will be available in the `output/` folder.

### Build Environment

- **Platform**: Linux (Ubuntu/Debian based)
- **Build Tools**: Gradle 8.14.1
- **Java**: OpenJDK 17
- **Android SDK**: Latest
- **Architecture**: Old React Native Architecture (newArchEnabled=false)
- **JavaScript Engine**: Hermes ✅
- **Target Platforms**: Android (armeabi-v7a, arm64-v8a, x86, x86_64)

### iOS

1. **Build for iOS**
   ```bash
   npx react-native run-ios --configuration Release
   ```

## Project Structure 📁

```
src/
├── components/          # Reusable UI components
│   ├── cards/          # Card components & Transaction Modals
│   │   ├── AddTransactionModal.tsx    # Add transaction modal
│   │   ├── EditTransactionModal.tsx   # Edit transaction modal
│   │   └── HomeCard.tsx              # Home balance card
│   └── ui/             # UI elements
├── contexts/           # React contexts (Theme)
├── database/           # WatermelonDB configuration
│   ├── models/         # Database models (Account, Transaction)
│   ├── services/       # Database services (Account, Transaction, Migration)
│   ├── index.ts        # Database setup
│   └── schema.ts       # Database schema
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   ├── AccountDetailScreen.tsx  # Individual account management
│   ├── HomeScreen.tsx          # Main dashboard
│   ├── TableViewScreen.tsx     # Account overview
│   └── SettingsScreen.tsx      # App settings
├── store/             # Data management layer
│   ├── slices/        # Store slices (Theme, Transaction)
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
- **Account Creation**: Automatically creates default account for migrated transactions
- **Logging**: Comprehensive migration logging for debugging

### Migration Process

1. **Detection**: Check if migration has already been completed
2. **Data Loading**: Load existing transactions from AsyncStorage
3. **Account Creation**: Create default account for legacy transactions
4. **Transfer**: Convert and insert data into WatermelonDB with account relationships
5. **Verification**: Ensure data integrity and completeness
6. **Completion**: Mark migration as complete to prevent re-runs

## App Icons 🎨

### Transparent Adaptive Icons

MoneyBook features professionally designed app icons that adapt to any theme:

- **🌈 Theme Adaptive**: Icons automatically adapt to light/dark system themes
- **✨ Transparent Background**: No jarring backgrounds in any theme
- **💎 Professional Design**: Dollar sign, data stack, and user flow icons
- **📱 Multi-Resolution**: Optimized for all device densities (MDPI to XXXHDPI)
- **🍎 iOS Ready**: Complete icon set including App Store requirements

## Features in Detail 📋

### Account Management

- **Multiple Accounts**: Create and manage separate accounts (Personal, Business, Savings, etc.)
- **Account Overview**: View all accounts with balances and transaction counts
- **Individual Management**: Detailed view for each account with dedicated transaction history
- **Account Deletion**: Safe account deletion with confirmation dialogs
- **Balance Tracking**: Real-time balance calculation per account

### Transaction Management

- **Add Transactions**: Cash in/out with optional reasons and custom dates
- **Edit Transactions**: Modify existing transactions with full date picker support
- **Transaction Validation**: Amount validation with negative number auto-detection
- **Custom Dates**: Select past dates for transactions using native date picker
- **Transaction Types**: Auto-detection of debit for negative amounts
- **Confirmation Dialogs**: Success notifications with updated balance information

### Transaction History & Filtering

- **Chronological Lists**: Time-ordered transaction history per account
- **Advanced Filtering**: Filter by all, credit, or debit transactions
- **Color-coded Entries**: Green for Cash In, Red for Cash Out
- **Transaction Actions**: Edit and delete functionality with confirmations
- **Empty States**: Helpful messages when no transactions exist
- **Pull to Refresh**: Refresh transaction data with pull-down gesture

### Visual Enhancements

- **Responsive Design**: Adaptive layouts for all screen sizes
- **Background Images**: Different backgrounds for positive/negative balances
- **Gradient Overlays**: Beautiful gradient effects with transparency
- **Visual Warnings**: Special styling for negative balances
- **Floating Elements**: Decorative elements for visual appeal
- **Shadow Effects**: Professional card shadows and depth

### Theme System

- **Light and Dark Modes**: Complete theme support with persistent storage
- **Real-time Switching**: Instant theme changes across all components
- **Consistent Colors**: Centralized theme management
- **Adaptive Icons**: App icons that change with system theme
- **Context-aware Styling**: Theme-appropriate gradients and backgrounds

### Database Performance

- **Account-based Queries**: Efficient data retrieval per account
- **Indexed Lookups**: Fast transaction searches with database indexes
- **Lazy Loading**: Only load data when needed
- **Background Operations**: Non-blocking database operations
- **Memory Efficient**: Optimized memory usage for large datasets
- **Concurrent Safe**: Thread-safe database operations

## Version History 📝

- **v1.0.0**: Initial release with AsyncStorage

  - Basic money management features
  - Single balance tracking with AsyncStorage
  - Theme switching capabilities

- **v1.1.0**: Icon and UI improvements

  - Updated app icon design
  - Enhanced UI components
  - Better navigation experience

- **v1.2.0**: Transparent icon adaptation

  - Theme-adaptive transparent app icons
  - Enhanced dark/light mode support
  - Improved visual consistency

- **v2.0.0**: **WatermelonDB Migration**

  - Complete database migration from AsyncStorage to WatermelonDB
  - Automatic data migration with zero user impact
  - Enhanced performance for large transaction datasets
  - Improved reliability with ACID transactions
  - Scalable architecture ready for advanced features

- **v2.1.0**: Enhanced UI and performance

  - Improved user interface design
  - Performance optimizations
  - Better error handling

- **v2.2.0**: Advanced features

  - Additional functionality and improvements
  - Enhanced user experience

- **v2.3.0**: Stability improvements

  - Bug fixes and performance enhancements
  - Code optimization

- **v2.4.0**: **Account Management & Transaction Modals** (Current Release - July 8, 2025)
  - **🏦 Multi-Account Support**: Create and manage multiple accounts with individual balances
  - **📱 Transaction Modals**: Beautiful add/edit transaction forms with validation and custom date selection
  - **📊 Account Detail Screen**: Comprehensive account management with transaction filtering options
  - **📅 Custom Date Selection**: Add transactions with custom dates using native date picker
  - **🔍 Advanced Filtering**: Filter transactions by credit, debit, or all transactions
  - **⚠️ Negative Balance Alerts**: Visual warnings for accounts running negative with special styling
  - **✏️ Transaction Editing**: Full edit capability for existing transactions with date picker support
  - **🎨 Enhanced UI**: Responsive design with gradient backgrounds and floating visual elements
  - **🗑️ Safe Deletion**: Account and transaction deletion with confirmation dialogs
  - **📝 Improved Transaction History**: Better organization and visual representation of financial data

## Available Builds 📦

### Latest Release: v2.4.0 (July 8, 2025)

- **APK**: `moneybook-v2.4.0-release.apk` (53.7 MB) - Direct installation
- **AAB**: `moneybook-v2.4.0-release.aab` (26.6 MB) - Google Play Store

### Previous Builds

```
output/
├── MoneyBook-v1.0.0-release.apk                    # AsyncStorage (53MB)
├── MoneyBook-v1.1.0-release.apk                    # Icon updates (53MB)
├── MoneyBook-v1.2.0-transparent-release.apk        # Transparent icons (53MB)
├── MoneyBook-v2.0.0-WatermelonDB-release.apk       # WatermelonDB (54MB)
├── MoneyBook-v2.1.0-release.apk                    # Enhanced UI (55MB)
├── MoneyBook-v2.2.0-release.apk                    # Advanced features (55MB)
├── MoneyBook-v2.3.0-release.apk                    # Stability improvements (56MB)
└── moneybook-v2.4.0-release.apk                    # Account Management (53.7MB) ⭐
```

## Installation Instructions 📱

### For Android APK (Direct Installation)

1. **Enable Unknown Sources**:
   - Go to Settings → Security → Unknown Sources (Enable)
   - Or Settings → Apps → Special Access → Install Unknown Apps
2. **Transfer APK**: Copy `moneybook-v2.4.0-release.apk` to your Android device
3. **Install**: Tap the APK file and follow installation prompts
4. **Launch**: Find MoneyBook in your app drawer

### For Google Play Store (AAB)

1. **Upload to Console**: Use `moneybook-v2.4.0-release.aab` in Google Play Console
2. **Create Release**: Follow Google Play Store publishing guidelines
3. **Review Process**: App will go through Google's review process
4. **Distribution**: Available to users after approval

## Troubleshooting 🔧

### If Installation Fails:

1. **Storage Space**: Ensure device has at least 100MB free space
2. **Android Version**: Check minimum Android version compatibility
3. **Permissions**: Verify installation permissions are granted
4. **Conflicting Apps**: Uninstall any previous versions first

### If App Crashes:

1. **Clear Cache**: Clear app cache and data
2. **Restart Device**: Reboot your Android device
3. **Reinstall**: Uninstall and reinstall the app

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

_Now featuring professional account management with multi-account support, transaction modals, and advanced filtering capabilities._

**Build Status**: ✅ **BUILD SUCCESSFUL** - Release v2.4.0 created successfully!
