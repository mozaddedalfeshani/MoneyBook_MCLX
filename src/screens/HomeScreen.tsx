import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Store, { AppData } from '../store/store';
import { Transaction } from '../database/models/Transaction';
import { useTheme } from '../contexts';
import { HomeCard as HomeCardComponent } from '../components';

// iOS Typography System
const Typography = {
  // iOS Font Sizes (following iOS Human Interface Guidelines)
  fontSize: {
    // iOS naming
    caption2: 11, // Caption 2
    caption1: 12, // Caption 1
    footnote: 13, // Footnote
    subheadline: 15, // Subheadline
    callout: 16, // Callout
    body: 17, // Body
    headline: 17, // Headline
    title3: 20, // Title 3
    title2: 22, // Title 2
    title1: 28, // Title 1
    largeTitle: 34, // Large Title

    // Backward compatibility
    tiny: 11, // Maps to caption2
    small: 13, // Maps to footnote
    regular: 17, // Maps to body
    medium: 16, // Maps to callout
    large: 20, // Maps to title3
    xl: 22, // Maps to title2
    xxl: 28, // Maps to title1
    xxxl: 34, // Maps to largeTitle
  },

  // iOS Font Weights
  fontWeight: {
    ultraLight: '100' as const,
    thin: '200' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },

  // iOS Line Heights
  lineHeight: {
    tight: 1.15,
    normal: 1.25,
    relaxed: 1.4,
  },

  // iOS Letter Spacing
  letterSpacing: {
    tight: -0.41,
    normal: 0,
    wide: 0.38,
  },
};

// iOS Spacing System
const Spacing = {
  // Base spacing unit
  base: 8,

  // Margin/Padding sizes
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Specific spacing values
  margin: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  padding: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Border radius
  borderRadius: {
    small: 8,
    medium: 10,
    large: 12,
    xl: 15,
    xxl: 20,
  },

  // Heights
  height: {
    input: 50,
    button: 50,
    card: 200,
    icon: 40,
  },

  // Widths
  width: {
    divider: 1,
    border: 1,
  },

  // Gaps
  gap: {
    small: 8,
    medium: 10,
    large: 12,
    xl: 15,
  },
};

// Shadows styles moved from centralized styles
const getShadows = (colors: any) => ({
  // Small shadow
  small: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Medium shadow
  medium: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Large shadow
  large: {
    shadowColor: colors.shadowSecondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },

  // Card shadow
  card: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Button shadow
  button: {
    shadowColor: colors.shadowPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default function HomeScreen({ navigation }: any) {
  const { colors } = useTheme();
  const shadows = getShadows(colors);
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Navigation cards data
  const navigationCards = [
    {
      id: 1,
      title: 'Accounts',
      description: 'Manage your accounts',
      icon: 'account-balance-wallet',
      iconType: 'material',
      color: colors.primary,
      screen: 'Accounts',
    },
    {
      id: 2,
      title: 'History',
      description: 'View transactions',
      icon: 'history',
      iconType: 'fontawesome',
      color: colors.success,
      screen: 'Settings',
      nested: 'History',
    },
    {
      id: 3,
      title: 'Settings',
      description: 'App preferences',
      icon: 'settings',
      iconType: 'material',
      color: colors.secondary,
      screen: 'Settings',
    },
  ];

  // Get last transaction amounts for HomeCard
  const [lastTransactionAmounts, setLastTransactionAmounts] = useState({
    lastCashIn: 0,
    lastCashOut: 0,
  });

  // Load data from store
  const loadData = async () => {
    try {
      setIsLoading(true);
      await Store.initialize();
      const data: AppData = await Store.loadData();
      setBalance(data.balance);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load transaction data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getLastAmounts = async () => {
      try {
        const amounts = await Store.getLastTransactionAmounts(transactions);
        setLastTransactionAmounts(amounts);
      } catch (error) {
        console.error('Error getting last transaction amounts:', error);
      }
    };

    if (transactions.length > 0) {
      getLastAmounts();
    }
  }, [transactions]);

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleCardPress = (card: any) => {
    if (card.nested) {
      navigation.navigate(card.screen, { screen: card.nested });
    } else {
      navigation.navigate(card.screen);
    }
  };

  const renderNavigationCard = (card: any) => (
    <TouchableOpacity
      key={card.id}
      style={[styles.navigationCard, { borderLeftColor: card.color }]}
      onPress={() => handleCardPress(card)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.cardIcon, { backgroundColor: card.color + '20' }]}>
          {card.iconType === 'material' ? (
            <MaterialIcons name={card.icon} size={28} color={card.color} />
          ) : (
            <FontAwesome5 name={card.icon} size={28} color={card.color} />
          )}
        </View>
        <View style={styles.cardTextContent}>
          <Text style={styles.cardTitle}>{card.title}</Text>
          <Text style={styles.cardDescription}>{card.description}</Text>
        </View>
        <FontAwesome5
          name="chevron-right"
          size={20}
          color={colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      flexGrow: 1,
      paddingTop: Spacing.xl,
      paddingBottom: insets.bottom + 80, // Safe area bottom + tab bar space
    },
    navigationSection: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xxl,
    },
    sectionTitle: {
      fontSize: Typography.fontSize.title3,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
    },
    navigationCard: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.large,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      borderLeftWidth: 4,
      ...shadows.card,
    },
    cardContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    cardIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: Spacing.lg,
    },
    cardTextContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: Typography.fontSize.title3,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    cardDescription: {
      fontSize: Typography.fontSize.subheadline,
      color: colors.textSecondary,
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Balance Card */}
      <HomeCardComponent
        balance={balance}
        isLoading={isLoading}
        lastCashIn={lastTransactionAmounts.lastCashIn}
        lastCashOut={lastTransactionAmounts.lastCashOut}
      />

      {/* Navigation Cards */}
      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        {navigationCards.map(renderNavigationCard)}
      </View>
    </ScrollView>
  );
}
