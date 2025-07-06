import React from 'react';
import {
  View,
  Text,
  Switch,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../contexts';

// iOS Typography System
const Typography = {
  // iOS Font Sizes (following iOS Human Interface Guidelines)
  fontSize: {
    caption2: 11, // Caption 2
    caption1: 12, // Caption 1
    footnote: 13, // Footnote
    subheadline: 15, // Subheadline
    callout: 16, // Callout
    body: 17, // Body
    headline: 17, // Headline
    title3: 20, // Title 3
    title2: 22, // Title 2
    title1: 28, // Title 1
    largeTitle: 34, // Large Title
  },

  // iOS Font Weights
  fontWeight: {
    ultraLight: '100' as const,
    thin: '200' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },

  // iOS Line Heights
  lineHeight: {
    tight: 1.15,
    normal: 1.25,
    relaxed: 1.4,
  },

  // iOS Letter Spacing
  letterSpacing: {
    tight: -0.41,
    normal: 0,
    wide: 0.38,
  },

  // iOS Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

// iOS Spacing System (8pt grid)
const Spacing = {
  // Base spacing unit (iOS uses 8pt grid)
  base: 8,

  // iOS spacing values
  xs: 4, // 0.5x
  sm: 8, // 1x
  md: 16, // 2x
  lg: 24, // 3x
  xl: 32, // 4x
  xxl: 40, // 5x
  xxxl: 48, // 6x

  // iOS spacing
  margin: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },

  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },

  // iOS Border radius (more rounded)
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },

  // iOS Heights
  height: {
    input: 44, // iOS standard touch target
    button: 44, // iOS standard touch target
    card: 200,
    icon: 44, // iOS standard touch target
  },

  // iOS Widths
  width: {
    divider: 0.5, // iOS standard divider
    border: 1,
  },

  // iOS Gaps
  gap: {
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
};

export default function SettingsScreen({ navigation }: any) {
  const { currentTheme, colors, toggleTheme, isLoading } = useTheme();
  const insets = useSafeAreaInsets();

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

  // iOS-style clean background
  const backgroundColor = colors.background;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      paddingTop: insets.top, // Safe area top
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.md,
      paddingBottom: insets.bottom + 80, // Safe area bottom + tab bar space
    },
    header: {
      alignItems: 'center' as const,
      marginTop: Spacing.sm,
      marginBottom: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    title: {
      fontSize: 28, // Direct size instead of variable
      fontWeight: '700' as const,
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: 'center' as const,
    },
    subtitle: {
      fontSize: 16, // Direct size instead of variable
      fontWeight: '400' as const,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
    settingsSection: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontSize: 18, // Direct size
      fontWeight: '600' as const,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
      marginLeft: Spacing.md,
    },
    settingsCard: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.medium,
      padding: Spacing.md,
      paddingVertical: Spacing.lg,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      shadowColor: colors.shadowPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
      marginBottom: Spacing.sm,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    navigableCard: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.medium,
      padding: Spacing.md,
      paddingVertical: Spacing.lg,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      shadowColor: colors.shadowPrimary,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 4,
      elevation: 1,
      marginBottom: Spacing.sm,
      borderWidth: 0.5,
      borderColor: colors.border,
    },
    cardContent: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    cardTitle: {
      fontSize: 16, // Direct size
      fontWeight: '500' as const,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    cardDescription: {
      fontSize: 13, // Direct size
      fontWeight: '400' as const,
      color: colors.textSecondary,
    },
    cardIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: Spacing.md,
    },
    chevronIcon: {
      marginLeft: Spacing.sm,
    },
    currentThemeText: {
      fontSize: 12, // Direct size
      fontWeight: '400' as const,
      color: colors.textTertiary,
      textAlign: 'center' as const,
      marginTop: Spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingText: {
      fontSize: 16, // Direct size
      fontWeight: '400' as const,
      color: colors.textSecondary,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={backgroundColor}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={currentTheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
    </View>
  );
}
