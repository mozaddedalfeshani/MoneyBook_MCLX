export type ThemeType = 'light' | 'dark';

const LightColors = {
  // Primary colors
  primary: '#007bff',
  primaryLight: '#4A90E2',
  primaryDark: '#0056b3',

  // Secondary colors
  secondary: '#667eea',
  secondaryLight: '#8b9aec',
  secondaryDark: '#4a5ab8',

  // Status colors
  success: '#4CAF50',
  error: '#FF6B6B',
  warning: '#FFA726',
  info: '#29B6F6',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#666666',
  lightGray: '#999999',
  veryLightGray: '#f0f0f0',
  background: '#f8f9fa',
  border: '#ddd',
  borderLight: '#eee',

  // Text colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textLight: '#FFFFFF',

  // Shadow colors
  shadowPrimary: '#000000',
  shadowSecondary: '#4A90E2',

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(255, 255, 255, 0.1)',
  overlayDark: 'rgba(255, 255, 255, 0.08)',

  // Transparent colors
  transparent: 'transparent',
  whiteTransparent: 'rgba(255, 255, 255, 0.2)',
  whiteOpaque: 'rgba(255, 255, 255, 0.3)',

  // Delete/danger colors
  dangerBackground: '#ffe6e6',
  dangerText: '#FF6B6B',
};

const DarkColors = {
  // Primary colors
  primary: '#4A90E2',
  primaryLight: '#6BA3F0',
  primaryDark: '#2C5AA0',

  // Secondary colors
  secondary: '#667eea',
  secondaryLight: '#8b9aec',
  secondaryDark: '#4a5ab8',

  // Status colors
  success: '#4CAF50',
  error: '#FF6B6B',
  warning: '#FFA726',
  info: '#29B6F6',

  // Neutral colors (Fixed for dark theme)
  white: '#2D2D2D', // Dark surface color instead of white
  black: '#000000',
  gray: '#CCCCCC',
  lightGray: '#AAAAAA',
  veryLightGray: '#3A3A3A', // Darker input background
  background: '#1A1A1A',
  border: '#444444',
  borderLight: '#333333',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textTertiary: '#AAAAAA',
  textLight: '#FFFFFF',

  // Shadow colors
  shadowPrimary: '#000000',
  shadowSecondary: '#4A90E2',

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(255, 255, 255, 0.1)',
  overlayDark: 'rgba(255, 255, 255, 0.08)',

  // Transparent colors
  transparent: 'transparent',
  whiteTransparent: 'rgba(255, 255, 255, 0.2)',
  whiteOpaque: 'rgba(255, 255, 255, 0.3)',

  // Delete/danger colors
  dangerBackground: '#4D1F1F',
  dangerText: '#FF6B6B',
};

export const getColors = (theme: ThemeType) => {
  return theme === 'light' ? LightColors : DarkColors;
};

// Default to light theme colors for backward compatibility
export const Colors = LightColors;
