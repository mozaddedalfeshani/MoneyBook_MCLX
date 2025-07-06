# MoneyBook App Icons

This folder contains the original app icon and generated sizes for the MoneyBook app.

## Original Icon

- `appicon.png` - Original high-resolution app icon (1024x1024)

## Android Icons Generated

The following sizes were generated for Android and placed in their respective folders:

- **mipmap-mdpi**: 48x48 (`ic_launcher_48.png`)
- **mipmap-hdpi**: 72x72 (`ic_launcher_72.png`)
- **mipmap-xhdpi**: 96x96 (`ic_launcher_96.png`)
- **mipmap-xxhdpi**: 144x144 (`ic_launcher_144.png`)
- **mipmap-xxxhdpi**: 192x192 (`ic_launcher_192.png`)

## iOS Icons Generated

The following sizes were generated for iOS and placed in `ios/muradianlearning/Images.xcassets/AppIcon.appiconset/`:

- **20x20@2x**: 40x40 (`icon-20@2x.png`)
- **20x20@3x**: 60x60 (`icon-20@3x.png`)
- **29x29@2x**: 58x58 (`icon-29@2x.png`)
- **29x29@3x**: 87x87 (`icon-29@3x.png`)
- **40x40@2x**: 80x80 (`icon-40@2x.png`)
- **40x40@3x**: 120x120 (`icon-40@3x.png`)
- **60x60@2x**: 120x120 (`icon-60@2x.png`)
- **60x60@3x**: 180x180 (`icon-60@3x.png`)
- **App Store**: 1024x1024 (`icon-1024.png`)

## Icon Design Features

The MoneyBook app icon features:

- 💰 Dollar sign symbol representing money management
- 🗃️ Stack of data disks symbolizing data storage and organization
- 👥 User figures representing personal finance tracking
- 🔄 Arrow indicating money flow and transactions
- Dark blue background with teal/green accents
- Modern, professional design suitable for a finance app

## Regenerating Icons

If you need to update the app icon:

1. Replace `appicon.png` with your new design (recommended 1024x1024)
2. Run the generation commands using ImageMagick:

```bash
# Android sizes
convert appicon.png -resize 48x48 ic_launcher_48.png
convert appicon.png -resize 72x72 ic_launcher_72.png
convert appicon.png -resize 96x96 ic_launcher_96.png
convert appicon.png -resize 144x144 ic_launcher_144.png
convert appicon.png -resize 192x192 ic_launcher_192.png

# iOS sizes
convert appicon.png -resize 40x40 ios_40.png
convert appicon.png -resize 60x60 ios_60.png
convert appicon.png -resize 58x58 ios_58.png
convert appicon.png -resize 87x87 ios_87.png
convert appicon.png -resize 80x80 ios_80.png
convert appicon.png -resize 120x120 ios_120.png
convert appicon.png -resize 180x180 ios_180.png
convert appicon.png -resize 1024x1024 ios_1024.png
```

3. Copy the generated files to their respective platform folders
4. Clean and rebuild the project

## File Structure

```
assets/icons/
├── README.md
├── appicon.png              # Original icon
├── ic_launcher_48.png       # Android MDPI
├── ic_launcher_72.png       # Android HDPI
├── ic_launcher_96.png       # Android XHDPI
├── ic_launcher_144.png      # Android XXHDPI
├── ic_launcher_192.png      # Android XXXHDPI
├── ios_40.png              # iOS 20@2x
├── ios_60.png              # iOS 20@3x
├── ios_58.png              # iOS 29@2x
├── ios_87.png              # iOS 29@3x
├── ios_80.png              # iOS 40@2x
├── ios_120.png             # iOS 40@3x & 60@2x
├── ios_180.png             # iOS 60@3x
└── ios_1024.png            # iOS App Store
```
