import React from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../contexts';
import { Typography } from '../styles/theme/typography';
import { Spacing } from '../styles/theme/spacing';

export default function SettingsScreen() {
  const { currentTheme, colors, toggleTheme, isLoading } = useTheme();

  const handleThemeToggle = async () => {
    try {
      await toggleTheme();
      Alert.alert(
        'Theme Changed',
        `Switched to ${currentTheme === 'light' ? 'dark' : 'light'} theme!`,
        [{ text: 'OK' }],
      );
    } catch (error) {
      console.error('Error toggling theme:', error);
      Alert.alert('Error', 'Failed to change theme');
    }
  };

  // Theme-compatible gradient colors - Much lighter and subtle
  const gradientColors =
    currentTheme === 'light'
      ? ['#f8f9ff', '#f0f2ff', '#e8f0fe'] // Very light blue-purple gradient
      : ['#2a2a2a', '#252525', '#1f1f1f']; // Subtle dark gradient

  const styles = {
    gradientContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingTop: 60, // Add padding for status bar since header is removed
      paddingHorizontal: Spacing.xl,
    },
    header: {
      alignItems: 'center' as const,
      marginBottom: 60,
    },
    title: {
      fontSize: Typography.fontSize.xxl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: 8,
      textShadowColor:
        currentTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    subtitle: {
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
      textShadowColor:
        currentTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    toggleContainer: {
      backgroundColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(45, 45, 45, 0.9)',
      borderRadius: Spacing.borderRadius.large,
      padding: Spacing.xl,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      shadowColor: colors.shadowPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(255, 255, 255, 0.1)',
    },
    toggleContent: {
      flex: 1,
      marginRight: Spacing.lg,
    },
    toggleTitle: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    toggleDescription: {
      fontSize: Typography.fontSize.regular,
      color: colors.textSecondary,
    },
    themeIcon: {
      marginRight: Spacing.md,
    },
    currentThemeText: {
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      marginTop: Spacing.xl,
      fontStyle: 'italic' as const,
      textShadowColor:
        currentTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingText: {
      color: colors.textSecondary,
      textShadowColor:
        currentTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <FontAwesome5
            name="cog"
            size={48}
            color={colors.primary}
            style={{ marginBottom: 16 }}
          />
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </View>

        {/* Theme Toggle */}
        <View style={styles.toggleContainer}>
          <FontAwesome5
            name={currentTheme === 'light' ? 'sun' : 'moon'}
            size={24}
            color={currentTheme === 'light' ? '#FFA726' : '#4A90E2'}
            style={styles.themeIcon}
          />
          <View style={styles.toggleContent}>
            <Text style={styles.toggleTitle}>Dark Mode</Text>
            <Text style={styles.toggleDescription}>
              Switch between light and dark themes
            </Text>
          </View>
          <Switch
            value={currentTheme === 'dark'}
            onValueChange={handleThemeToggle}
            trackColor={{
              false: colors.lightGray,
              true: colors.primary,
            }}
            thumbColor={colors.white}
            ios_backgroundColor={colors.lightGray}
          />
        </View>

        {/* Current Theme Display */}
        <Text style={styles.currentThemeText}>
          Current theme:{' '}
          {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}
        </Text>
      </View>
    </LinearGradient>
  );
}
