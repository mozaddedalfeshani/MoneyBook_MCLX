import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { ThemeStore, ThemeType } from '../store/themeStore';
import { getColors } from '../styles/theme/colors';
import { Typography } from '../styles/theme/typography';
import { Spacing } from '../styles/theme/spacing';

export default function SettingsScreen() {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Get current theme colors
  const colors = getColors(currentTheme);

  // Load theme on component mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const theme = await ThemeStore.loadTheme();
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeToggle = async () => {
    try {
      const newTheme = await ThemeStore.toggleTheme(currentTheme);
      setCurrentTheme(newTheme);

      Alert.alert(
        'Theme Changed',
        `Switched to ${newTheme} theme. Please restart the app to see all changes.`,
        [{ text: 'OK' }],
      );
    } catch (error) {
      console.error('Error toggling theme:', error);
      Alert.alert('Error', 'Failed to change theme');
    }
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    },
    subtitle: {
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
    },
    toggleContainer: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.large,
      padding: Spacing.xl,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      shadowColor: colors.shadowPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      marginBottom: Spacing.xl,
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
    },
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  return (
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
  );
}
