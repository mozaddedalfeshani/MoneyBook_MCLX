import { StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';

export const SettingsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },

  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xl,
    color: Colors.textPrimary,
  },

  subtitle: {
    fontSize: Typography.fontSize.medium,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
    color: Colors.textSecondary,
  },
});
