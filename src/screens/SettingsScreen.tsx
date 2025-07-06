import React from 'react';
import {
  View,
  Text,
  Switch,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../contexts';

// Typography styles moved from centralized styles
const Typography = {
  // Font Sizes
  fontSize: {
    tiny: 10,
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xl: 20,
    xxl: 24,
    xxxl: 36,
  },

  // Font Weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },

  // Font Families (if needed for custom fonts)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

// Spacing styles moved from centralized styles
const Spacing = {
  // Base spacing unit
  base: 8,

  // Margin/Padding sizes
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Specific spacing values
  margin: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  padding: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Border radius
  borderRadius: {
    small: 8,
    medium: 10,
    large: 12,
    xl: 15,
    xxl: 20,
  },

  // Heights
  height: {
    input: 50,
    button: 50,
    card: 200,
    icon: 40,
  },

  // Widths
  width: {
    divider: 1,
    border: 1,
  },

  // Gaps
  gap: {
    small: 8,
    medium: 10,
    large: 12,
    xl: 15,
  },
};

export default function SettingsScreen({ navigation }: any) {
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

  const styles = StyleSheet.create({
    gradientContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
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
    settingsSection: {
      marginBottom: Spacing.xxl,
    },
    sectionTitle: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
      marginLeft: Spacing.sm,
    },
    settingsCard: {
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
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(255, 255, 255, 0.1)',
    },
    navigableCard: {
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
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(255, 255, 255, 0.1)',
    },
    cardContent: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    cardTitle: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    cardDescription: {
      fontSize: Typography.fontSize.regular,
      color: colors.textSecondary,
    },
    cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: Spacing.md,
    },
    chevronIcon: {
      marginLeft: Spacing.sm,
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
  });

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

        {/* Data & History Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Data & History</Text>

          <TouchableOpacity
            style={styles.navigableCard}
            onPress={() => navigation.navigate('History')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <FontAwesome5 name="history" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Transaction History</Text>
              <Text style={styles.cardDescription}>
                View all transactions with filtering options
              </Text>
            </View>
            <FontAwesome5
              name="chevron-right"
              size={16}
              color={colors.textSecondary}
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.settingsCard}>
            <View
              style={[
                styles.cardIcon,
                {
                  backgroundColor:
                    currentTheme === 'light' ? '#FFF3E0' : '#2A2A2A',
                },
              ]}
            >
              <FontAwesome5
                name={currentTheme === 'light' ? 'sun' : 'moon'}
                size={20}
                color={currentTheme === 'light' ? '#FFA726' : '#4A90E2'}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Dark Mode</Text>
              <Text style={styles.cardDescription}>
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
