# MoneyBook App Icons

This folder contains the original app icon and generated sizes for the MoneyBook app.

## Original Icon

- `appicon.png` - Original high-resolution app icon (1024x1024) with dark blue background
- `appicon_transparent_final.png` - Transparent background version optimized for theme adaptation

## Theme Adaptation

The app now uses **transparent background icons** that adapt beautifully to both light and dark themes:

- ✅ **Light Theme**: Icon elements stand out clearly against light backgrounds
- ✅ **Dark Theme**: Icon elements blend naturally with dark system themes
- ✅ **System Theme Changes**: Icons automatically adapt when users switch themes
- ✅ **Consistent Branding**: Maintains professional appearance across all system contexts

## Android Icons Generated (Transparent)

The following transparent background sizes are currently deployed:

- **mipmap-mdpi**: 48x48 (`ic_launcher_48_transparent.png`)
- **mipmap-hdpi**: 72x72 (`ic_launcher_72_transparent.png`)
- **mipmap-xhdpi**: 96x96 (`ic_launcher_96_transparent.png`)
- **mipmap-xxhdpi**: 144x144 (`ic_launcher_144_transparent.png`)
- **mipmap-xxxhdpi**: 192x192 (`ic_launcher_192_transparent.png`)

## iOS Icons Generated (Transparent)

The following transparent background sizes are currently deployed:

- **20x20@2x**: 40x40 (`ios_40_transparent.png`)
- **20x20@3x**: 60x60 (`ios_60_transparent.png`)
- **29x29@2x**: 58x58 (`ios_58_transparent.png`)
- **29x29@3x**: 87x87 (`ios_87_transparent.png`)
- **40x40@2x**: 80x80 (`ios_80_transparent.png`)
- **40x40@3x**: 120x120 (`ios_120_transparent.png`)
- **60x60@2x**: 120x120 (`ios_120_transparent.png`)
- **60x60@3x**: 180x180 (`ios_180_transparent.png`)
- **App Store**: 1024x1024 (`ios_1024_transparent.png`)

## Icon Design Features

The MoneyBook app icon features:

- 💰 Dollar sign symbol representing money management
- 🗃️ Stack of data disks symbolizing data storage and organization
- 👥 User figures representing personal finance tracking
- 🔄 Arrow indicating money flow and transactions
- 🎨 Teal/green accents maintaining brand colors without background dependency
- ✨ Transparent background for seamless theme integration
- 📱 Modern, adaptive design suitable for all system themes

## Background Removal Process

The transparent versions were created using ImageMagick with multiple transparency operations:

```bash
convert appicon.png -alpha set -fuzz 30% -transparent "#1e2a4e" -fuzz 25% -transparent "#2d3748" -fuzz 20% -transparent "#1a365d" appicon_transparent_final.png
```

This process removes various shades of the dark blue background while preserving the icon elements and their original colors.

## Regenerating Transparent Icons

If you need to update the transparent app icons:

1. Replace `appicon.png` with your new design (recommended 1024x1024)
2. Create transparent version:

```bash
convert appicon.png -alpha set -fuzz 30% -transparent "#1e2a4e" -fuzz 25% -transparent "#2d3748" -fuzz 20% -transparent "#1a365d" appicon_transparent_final.png
```

3. Generate platform-specific sizes:

```bash
# Android transparent sizes
convert appicon_transparent_final.png -resize 48x48 ic_launcher_48_transparent.png
convert appicon_transparent_final.png -resize 72x72 ic_launcher_72_transparent.png
convert appicon_transparent_final.png -resize 96x96 ic_launcher_96_transparent.png
convert appicon_transparent_final.png -resize 144x144 ic_launcher_144_transparent.png
convert appicon_transparent_final.png -resize 192x192 ic_launcher_192_transparent.png

# iOS transparent sizes
convert appicon_transparent_final.png -resize 40x40 ios_40_transparent.png
convert appicon_transparent_final.png -resize 60x60 ios_60_transparent.png
convert appicon_transparent_final.png -resize 58x58 ios_58_transparent.png
convert appicon_transparent_final.png -resize 87x87 ios_87_transparent.png
convert appicon_transparent_final.png -resize 80x80 ios_80_transparent.png
convert appicon_transparent_final.png -resize 120x120 ios_120_transparent.png
convert appicon_transparent_final.png -resize 180x180 ios_180_transparent.png
convert appicon_transparent_final.png -resize 1024x1024 ios_1024_transparent.png
```

4. Copy the generated files to their respective platform folders
5. Clean and rebuild the project

## File Structure

```
assets/icons/
├── README.md
├── appicon.png                      # Original icon (with background)
├── appicon_transparent_final.png    # Transparent version (currently used)
├── appicon_transparent.png          # Transparent variant
├── appicon_no_bg.png               # Background removed variant
│
├── # Android Transparent Icons (Currently Deployed)
├── ic_launcher_48_transparent.png   # Android MDPI
├── ic_launcher_72_transparent.png   # Android HDPI
├── ic_launcher_96_transparent.png   # Android XHDPI
├── ic_launcher_144_transparent.png  # Android XXHDPI
├── ic_launcher_192_transparent.png  # Android XXXHDPI
│
├── # iOS Transparent Icons (Currently Deployed)
├── ios_40_transparent.png           # iOS 20@2x
├── ios_60_transparent.png           # iOS 20@3x
├── ios_58_transparent.png           # iOS 29@2x
├── ios_87_transparent.png           # iOS 29@3x
├── ios_80_transparent.png           # iOS 40@2x
├── ios_120_transparent.png          # iOS 40@3x & 60@2x
├── ios_180_transparent.png          # iOS 60@3x
├── ios_1024_transparent.png         # iOS App Store
│
└── # Legacy Icons (With Background - Not Currently Used)
    ├── ic_launcher_48.png           # Android MDPI (legacy)
    ├── ic_launcher_72.png           # Android HDPI (legacy)
    ├── ic_launcher_96.png           # Android XHDPI (legacy)
    ├── ic_launcher_144.png          # Android XXHDPI (legacy)
    ├── ic_launcher_192.png          # Android XXXHDPI (legacy)
    ├── ios_40.png                   # iOS 20@2x (legacy)
    ├── ios_60.png                   # iOS 20@3x (legacy)
    ├── ios_58.png                   # iOS 29@2x (legacy)
    ├── ios_87.png                   # iOS 29@3x (legacy)
    ├── ios_80.png                   # iOS 40@2x (legacy)
    ├── ios_120.png                  # iOS 40@3x & 60@2x (legacy)
    ├── ios_180.png                  # iOS 60@3x (legacy)
    └── ios_1024.png                 # iOS App Store (legacy)
```

## Version History

- **v1.0.0**: Initial icon with dark blue background
- **v1.1.0**: Updated icon design and organization
- **v1.2.0**: **Transparent background** for theme adaptation (current)
