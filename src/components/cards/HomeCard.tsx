import { Text, View, StyleSheet } from 'react-native';
import React from 'react';
import { useTheme } from '../../contexts';

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

// Shadows styles moved from centralized styles
const getShadows = (colors: any) => ({
  // Small shadow
  small: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Medium shadow
  medium: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Large shadow
  large: {
    shadowColor: colors.shadowSecondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },

  // Card shadow
  card: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Header shadow
  header: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Button shadow
  button: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

interface HomeCardProps {
  balance: number;
  isLoading: boolean;
  lastCashIn: number;
  lastCashOut: number;
}

const HomeCard: React.FC<HomeCardProps> = ({
  balance,
  isLoading,
  lastCashIn,
  lastCashOut,
}) => {
  const { colors } = useTheme();
  const shadows = getShadows(colors);

  // Dynamic styles based on current theme
  const styles = StyleSheet.create({
    container: {
      margin: Spacing.lg,
      marginBottom: Spacing.md,
    },
    cardbox: {
      borderRadius: Spacing.borderRadius.xxl,
      overflow: 'hidden',
      position: 'relative',
      ...shadows.large,
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.secondary,
      opacity: 0.9,
    },
    contentContainer: {
      padding: Spacing.xxl,
      paddingBottom: Spacing.xl,
      position: 'relative',
      zIndex: 1,
    },
    balanceSection: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    balanceLabel: {
      fontSize: Typography.fontSize.medium,
      color: colors.textLight,
      marginBottom: Spacing.md,
      fontWeight: Typography.fontWeight.medium,
    },
    balanceAmount: {
      fontSize: 36,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textLight,
      marginBottom: Spacing.sm,
    },
    lastUpdated: {
      fontSize: Typography.fontSize.small,
      color: colors.overlayLight,
      fontStyle: 'italic',
    },
    bottomSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.overlayLight,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textLight,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: Typography.fontSize.small,
      color: colors.overlayLight,
      textAlign: 'center',
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.overlayLight,
      marginHorizontal: Spacing.lg,
    },
    decorativeCircle1: {
      position: 'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: colors.whiteTransparent,
      top: -75,
      right: -75,
      zIndex: 0,
    },
    decorativeCircle2: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.whiteOpaque,
      bottom: -50,
      left: -50,
      zIndex: 0,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.cardbox}>
        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />

        {/* Balance content */}
        <View style={styles.contentContainer}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <Text style={styles.balanceAmount}>
              {isLoading ? 'Loading...' : `${balance.toFixed(2)} Tk`}
            </Text>
            <Text style={styles.lastUpdated}>
              {isLoading ? 'Loading data...' : 'Last updated just now'}
            </Text>
          </View>

          {/* Bottom section with last transactions */}
          <View style={styles.bottomSection}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {lastCashIn > 0 ? `${lastCashIn.toFixed(2)} Tk` : 'No cash in'}
              </Text>
              <Text style={styles.statLabel}>Last Cash In</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {lastCashOut > 0
                  ? `${lastCashOut.toFixed(2)} Tk`
                  : 'No cash out'}
              </Text>
              <Text style={styles.statLabel}>Last Cash Out</Text>
            </View>
          </View>
        </View>

        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>
    </View>
  );
};

export default HomeCard;
