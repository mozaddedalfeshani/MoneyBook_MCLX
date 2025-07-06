import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';

export const ProfileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },

  loadingText: {
    marginTop: Spacing.lg,
    fontSize: Typography.fontSize.medium,
    color: Colors.textSecondary,
  },

  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: Spacing.width.border,
    borderBottomColor: Colors.borderLight,
    ...Shadows.header,
  },

  headerTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.gap.medium,
  },

  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: Typography.fontSize.medium,
    color: Colors.textSecondary,
  },

  balanceAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },

  listContainer: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },

  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.large,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },

  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  transactionIcon: {
    width: Spacing.height.icon,
    height: Spacing.height.icon,
    borderRadius: Spacing.xl,
    backgroundColor: Colors.veryLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },

  transactionDetails: {
    flex: 1,
  },

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
    alignItems: 'flex-end',
  },

  amountText: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.bold,
  },

  transactionBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  reasonText: {
    flex: 1,
    fontSize: Typography.fontSize.regular,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.small,
    marginLeft: Spacing.md,
  },

  deleteButtonText: {
    fontSize: Typography.fontSize.small,
    color: Colors.dangerText,
    marginLeft: 4,
    fontWeight: Typography.fontWeight.medium,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },

  emptyStateText: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },

  emptyStateSubtext: {
    fontSize: Typography.fontSize.regular,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
