import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { ThemeStore, ThemeType } from '../store/slices/themeStore';
import { getColors } from '../styles/theme/colors';

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
