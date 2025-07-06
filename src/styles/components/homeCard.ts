import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';

const { width } = Dimensions.get('window');

export const HomeCardStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },

  cardbox: {
    width: width - 30,
    height: Spacing.height.card,
    borderRadius: Spacing.borderRadius.xxl,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.large,
  },

  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.secondary,
    opacity: 1,
  },

  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: Spacing.xxl,
    justifyContent: 'space-between',
  },

  balanceSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textLight,
    opacity: 0.9,
    marginBottom: Spacing.sm,
    letterSpacing: Typography.letterSpacing.wide,
  },

  balanceAmount: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
    letterSpacing: Typography.letterSpacing.tight,
  },

  lastUpdated: {
    fontSize: Typography.fontSize.small,
    color: Colors.textLight,
    opacity: 0.8,
    fontWeight: Typography.fontWeight.regular,
  },

  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    borderTopWidth: Spacing.width.border,
    borderTopColor: Colors.whiteTransparent,
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statValue: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textLight,
    marginBottom: 2,
  },

  statLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.textLight,
    opacity: 0.8,
    fontWeight: Typography.fontWeight.regular,
  },

  divider: {
    width: Spacing.width.divider,
    height: 30,
    backgroundColor: Colors.whiteOpaque,
  },

  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.overlayLight,
  },

  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.overlayDark,
  },
});
