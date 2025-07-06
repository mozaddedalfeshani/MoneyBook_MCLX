import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

export const TextStyles = StyleSheet.create({
  // Headings
  heading1: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },

  heading2: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },

  heading3: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },

  heading4: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },

  // Body text
  bodyLarge: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textPrimary,
  },

  bodyMedium: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textPrimary,
  },

  bodySmall: {
    fontSize: Typography.fontSize.regular,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textPrimary,
  },

  // Secondary text
  secondary: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textSecondary,
  },

  // Tertiary text
  tertiary: {
    fontSize: Typography.fontSize.regular,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textTertiary,
  },

  // Light text (on dark backgrounds)
  light: {
    color: Colors.textLight,
  },

  // Special text styles
  subtitle: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textSecondary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },

  caption: {
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textTertiary,
  },

  label: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },

  // Balance text
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

  // Stat text
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

  // Transaction text
  transactionType: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },

  transactionDate: {
    fontSize: Typography.fontSize.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  transactionAmount: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.bold,
  },

  transactionReason: {
    fontSize: Typography.fontSize.regular,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  // Error text
  errorText: {
    color: Colors.error,
    fontSize: Typography.fontSize.regular,
  },

  // Success text
  successText: {
    color: Colors.success,
    fontSize: Typography.fontSize.regular,
  },

  // Center align
  center: {
    textAlign: 'center',
  },
});
