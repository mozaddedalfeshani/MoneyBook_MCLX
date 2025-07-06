export { Colors, getColors } from './colors';
export { Typography } from './typography';
export { Spacing } from './spacing';
export { Shadows, getShadows } from './shadows';

// Combined theme object factory
export const getTheme = (colors: ReturnType<typeof getColors>) => ({
  colors,
  typography: Typography,
  spacing: Spacing,
  shadows: getShadows(colors),
});

// Default theme for backward compatibility
export const Theme = getTheme(getColors('light'));
