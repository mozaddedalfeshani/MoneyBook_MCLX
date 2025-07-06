import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ThemeStore, ThemeType } from '../store/slices/themeStore';

// Colors styles moved from centralized styles

const LightColors = {
  // iOS Primary colors
  primary: '#007AFF',
  primaryLight: '#5AC8FA',
  primaryDark: '#0051D5',

  // iOS Secondary colors
  secondary: '#5856D6',
  secondaryLight: '#AF52DE',
  secondaryDark: '#1D1D1F',

  // iOS Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',

  // iOS Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#C7C7CC',
  veryLightGray: '#F2F2F7',
  background: '#F2F2F7',
  border: '#C6C6C8',
  borderLight: '#F2F2F7',

  // iOS Text colors
  textPrimary: '#000000',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  textLight: '#FFFFFF',

  // iOS Shadow colors
  shadowPrimary: '#000000',
  shadowSecondary: '#007AFF',

  // iOS Overlay colors
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(255, 255, 255, 0.8)',
  overlayDark: 'rgba(0, 0, 0, 0.04)',

  // iOS Transparent colors
  transparent: 'transparent',
  whiteTransparent: 'rgba(255, 255, 255, 0.85)',
  whiteOpaque: 'rgba(255, 255, 255, 0.95)',

  // iOS Delete/danger colors
  dangerBackground: '#FFE7E5',
  dangerText: '#FF3B30',

  // iOS Success colors
  successBackground: '#E5F7E8',
};

const DarkColors = {
  // iOS Dark Primary colors
  primary: '#0A84FF',
  primaryLight: '#64D2FF',
  primaryDark: '#0040DD',

  // iOS Dark Secondary colors
  secondary: '#5E5CE6',
  secondaryLight: '#BF5AF2',
  secondaryDark: '#8E8E93',

  // iOS Dark Status colors
  success: '#30D158',
  error: '#FF453A',
  warning: '#FF9F0A',
  info: '#0A84FF',

  // iOS Dark Neutral colors
  white: '#1C1C1E', // iOS dark surface color
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#48484A',
  veryLightGray: '#2C2C2E',
  background: '#000000',
  border: '#38383A',
  borderLight: '#2C2C2E',

  // iOS Dark Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textTertiary: '#8E8E93',
  textLight: '#FFFFFF',

  // iOS Dark Shadow colors
  shadowPrimary: '#000000',
  shadowSecondary: '#0A84FF',

  // iOS Dark Overlay colors
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(255, 255, 255, 0.16)',
  overlayDark: 'rgba(0, 0, 0, 0.32)',

  // iOS Dark Transparent colors
  transparent: 'transparent',
  whiteTransparent: 'rgba(255, 255, 255, 0.16)',
  whiteOpaque: 'rgba(255, 255, 255, 0.85)',

  // iOS Dark Delete/danger colors
  dangerBackground: '#2D1B1B',
  dangerText: '#FF453A',

  // iOS Dark Success colors
  successBackground: '#1B2D1B',
};

export const getColors = (theme: ThemeType) => {
  return theme === 'light' ? LightColors : DarkColors;
};

// Default to light theme colors for backward compatibility
export const Colors = LightColors;

interface ThemeContextType {
  currentTheme: ThemeType;
  colors: ReturnType<typeof getColors>;
  toggleTheme: () => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  // Get current theme colors
  const colors = getColors(currentTheme);

  // Load theme on component mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const theme = await ThemeStore.loadTheme();
      setCurrentTheme(theme);
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = await ThemeStore.toggleTheme(currentTheme);
      setCurrentTheme(newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
      throw error;
    }
  };

  const contextValue: ThemeContextType = {
    currentTheme,
    colors,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
