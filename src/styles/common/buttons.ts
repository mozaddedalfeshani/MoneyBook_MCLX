import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { Shadows } from '../theme/shadows';

export const ButtonStyles = StyleSheet.create({
  // Base button
  baseButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: Spacing.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    ...Shadows.button,
  },

  // Primary button
  primaryButton: {
    backgroundColor: Colors.secondary,
  },

  // Success button (Cash In)
  successButton: {
    backgroundColor: Colors.success,
  },

  // Error button (Cash Out)
  errorButton: {
    backgroundColor: Colors.error,
  },

  // Cancel button
  cancelButton: {
    backgroundColor: Colors.transparent,
  },

  // Delete button
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerBackground,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.small,
    marginLeft: Spacing.md,
  },

  // Modal button
  modalButton: {
    padding: Spacing.xl,
    borderRadius: Spacing.borderRadius.xl,
    alignItems: 'center',
    width: '100%',
  },

  // Button text styles
  buttonText: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textLight,
    textAlign: 'center',
  },

  primaryButtonText: {
    color: Colors.textLight,
  },

  cancelButtonText: {
    color: Colors.textTertiary,
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.medium,
  },

  deleteButtonText: {
    fontSize: Typography.fontSize.small,
    color: Colors.dangerText,
    marginLeft: 4,
    fontWeight: Typography.fontWeight.medium,
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
});
