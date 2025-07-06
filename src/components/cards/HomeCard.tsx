import { Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '../../contexts';
import { Typography } from '../../styles/theme/typography';
import { Spacing } from '../../styles/theme/spacing';
import { getShadows } from '../../styles/theme/shadows';

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
  const styles = {
    container: {
      margin: Spacing.lg,
      marginBottom: Spacing.md,
    },
    cardbox: {
      borderRadius: Spacing.borderRadius.xxl,
      overflow: 'hidden' as const,
      position: 'relative' as const,
      ...shadows.large,
    },
    gradientOverlay: {
      position: 'absolute' as const,
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
      position: 'relative' as const,
      zIndex: 1,
    },
    balanceSection: {
      alignItems: 'center' as const,
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
      fontStyle: 'italic' as const,
    },
    bottomSection: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.overlayLight,
    },
    statItem: {
      flex: 1,
      alignItems: 'center' as const,
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
      textAlign: 'center' as const,
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: colors.overlayLight,
      marginHorizontal: Spacing.lg,
    },
    decorativeCircle1: {
      position: 'absolute' as const,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: colors.whiteTransparent,
      top: -75,
      right: -75,
      zIndex: 0,
    },
    decorativeCircle2: {
      position: 'absolute' as const,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.whiteOpaque,
      bottom: -50,
      left: -50,
      zIndex: 0,
    },
  };

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
