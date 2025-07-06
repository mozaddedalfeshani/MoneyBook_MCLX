import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

export const InputStyles = StyleSheet.create({
  // Base input
  baseInput: {
    height: Spacing.height.input,
    borderWidth: Spacing.width.border,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.medium,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.medium,
    backgroundColor: Colors.veryLightGray,
  },

  // Input container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gap.medium,
  },

  // Full width input
  fullWidthInput: {
    flex: 1,
    height: Spacing.height.input,
    borderWidth: Spacing.width.border,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.medium,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.medium,
    backgroundColor: Colors.veryLightGray,
  },

  // Multiline input
  multilineInput: {
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

  // Input with focus
  focusedInput: {
    borderColor: Colors.primary,
  },

  // Input with error
  errorInput: {
    borderColor: Colors.error,
  },

  // Input placeholder color
  placeholder: {
    color: Colors.lightGray,
  },

  // Input label
  inputLabel: {
    fontSize: Typography.fontSize.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  // Form group
  formGroup: {
    width: '100%',
    marginBottom: Spacing.xl,
  },

  // Search input
  searchInput: {
    height: Spacing.height.input,
    borderWidth: Spacing.width.border,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.large,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.medium,
    backgroundColor: Colors.white,
  },
});
