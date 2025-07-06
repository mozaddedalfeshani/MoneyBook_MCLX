import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';

export const HomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  contentContainer: {
    flexGrow: 1,
    paddingTop: Spacing.xl,
    paddingBottom: 40,
  },

  managementBox: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    borderRadius: Spacing.borderRadius.xl,
    padding: Spacing.xl,
    ...Shadows.medium,
  },

  boxTitle: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gap.medium,
  },

  input: {
    flex: 1,
    height: Spacing.height.input,
    borderWidth: Spacing.width.border,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.medium,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.medium,
    backgroundColor: Colors.veryLightGray,
  },

  updateButton: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: Spacing.borderRadius.medium,
    minWidth: 80,
  },

  updateButtonText: {
    color: Colors.textLight,
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },

  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.xxl,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.gap.medium,
  },

  modalAmount: {
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.secondary,
    marginBottom: Spacing.xl,
  },

  reasonContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },

  reasonLabel: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  reasonInput: {
    width: '100%',
    minHeight: Spacing.height.input,
    maxHeight: 80,
    borderWidth: Spacing.width.border,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.medium,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.medium,
    backgroundColor: Colors.veryLightGray,
    textAlignVertical: 'top',
  },

  modalButtons: {
    width: '100%',
    gap: Spacing.lg,
  },

  modalButton: {
    padding: Spacing.xl,
    borderRadius: Spacing.borderRadius.xl,
    alignItems: 'center',
    width: '100%',
  },

  cashInButton: {
    backgroundColor: Colors.success,
  },

  cashOutButton: {
    backgroundColor: Colors.error,
  },

  modalButtonText: {
    color: Colors.textLight,
    fontSize: Typography.fontSize.large,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: 5,
  },

  modalButtonSubtext: {
    color: Colors.textLight,
    fontSize: Typography.fontSize.regular,
    opacity: 0.9,
  },

  cancelButton: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    width: '100%',
    alignItems: 'center',
  },

  cancelButtonText: {
    color: Colors.textTertiary,
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.medium,
  },
});
