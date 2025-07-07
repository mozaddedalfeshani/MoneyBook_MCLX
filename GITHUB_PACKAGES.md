# GitHub Packages Integration

This project is configured to publish to GitHub Packages, GitHub's built-in package registry.

## 📦 Package Information

- **Package Name**: `@mozaddedalfeshani/moneybook`
- **Registry**: `https://npm.pkg.github.com`
- **Scope**: `@mozaddedalfeshani`

## 🚀 Publishing to GitHub Packages

### Prerequisites

1. **GitHub Token**: Create a Personal Access Token with `write:packages` scope
2. **Authentication**: Configure npm to use GitHub Packages

### Setup Authentication

```bash
# Login to GitHub Packages
npm login --registry=https://npm.pkg.github.com

# Or set the token directly
npm config set //npm.pkg.github.com/:_authToken YOUR_GITHUB_TOKEN
```

### Manual Publishing

```bash
# Install dependencies
yarn install

# Build the project
yarn build:android

# Publish to GitHub Packages
npm publish
```

### Automated Publishing

The project uses GitHub Actions for automated releases:

1. **Create a new tag**:

   ```bash
   git tag v2.4.1
   git push origin v2.4.1
   ```

2. **GitHub Actions will automatically**:
   - Build the Android APK and AAB
   - Create a GitHub Release with assets
   - Publish to GitHub Packages
   - Update the changelog

## 📥 Installing from GitHub Packages

### Configure npm

```bash
# Create .npmrc file in your project
echo "@mozaddedalfeshani:registry=https://npm.pkg.github.com" > .npmrc
```

### Install the Package

```bash
npm install @mozaddedalfeshani/moneybook
# or
yarn add @mozaddedalfeshani/moneybook
```

## 🔧 Configuration Files

### package.json Changes

```json
{
  "name": "@mozaddedalfeshani/moneybook",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mozaddedalfeshani/moneybook.git"
  }
}
```

### GitHub Actions Workflow

The `.github/workflows/release.yml` file handles:

- Building Android APK and AAB
- Creating GitHub Releases
- Publishing to GitHub Packages
- Generating changelogs

### Semantic Release

The `.releaserc.json` file configures:

- Automated versioning
- Changelog generation
- Release notes
- Package publishing

## 📋 Available Scripts

```bash
# Build Android APK
yarn build:android

# Build Android AAB (Google Play Store)
yarn build:android-bundle

# Publish to GitHub Packages
yarn publish:package

# Create new release (version bump + publish)
yarn release
```

## 🔐 Security

- GitHub Packages requires authentication
- Use Personal Access Tokens with appropriate scopes
- Tokens are automatically handled in GitHub Actions
- Package visibility follows repository visibility

## 📚 Documentation

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [npm Configuration for GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [GitHub Actions for Packages](https://docs.github.com/en/actions/publishing-packages)

## 🆘 Troubleshooting

### Common Issues

1. **Authentication Failed**:

   - Ensure your GitHub token has `write:packages` scope
   - Check if you're logged in to the correct registry

2. **Package Not Found**:

   - Verify the package name includes the scope
   - Check if the package is published and visible

3. **Build Failures**:
   - Ensure all dependencies are installed
   - Check Android SDK and Java versions
   - Verify Gradle configuration

### Support

For issues with GitHub Packages integration, please:

1. Check the GitHub Packages documentation
2. Review the GitHub Actions logs
3. Open an issue in the repository
