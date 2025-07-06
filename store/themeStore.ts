import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app_theme';

export class ThemeStore {
  // Load theme from storage
  static async loadTheme(): Promise<ThemeType> {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return (savedTheme as ThemeType) || 'light';
    } catch (error) {
      console.error('Error loading theme:', error);
      return 'light';
    }
  }

  // Save theme to storage
  static async saveTheme(theme: ThemeType): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  }

  // Toggle theme
  static async toggleTheme(currentTheme: ThemeType): Promise<ThemeType> {
    const newTheme: ThemeType = currentTheme === 'light' ? 'dark' : 'light';
    await this.saveTheme(newTheme);
    return newTheme;
  }
}
