import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
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

export default function HomeScreen() {
  const { colors } = useTheme();
  const shadows = getShadows(colors);
  const insets = useSafeAreaInsets();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  // App features data
  const appFeatures = [
    {
      id: 1,
      title: 'Multi-Account Management',
      description: 'Create and manage multiple accounts for different purposes',
      icon: 'account-balance-wallet',
      color: colors.primary,
      details:
        'Organize your finances with separate accounts for personal, business, savings, and more. Each account maintains its own balance and transaction history.',
    },
    {
      id: 2,
      title: 'Transaction Tracking',
      description: 'Record all your income and expenses with detailed reasons',
      icon: 'trending-up',
      color: colors.success,
      details:
        'Track every cash in and cash out transaction with custom reasons. View detailed transaction history and monitor your spending patterns.',
    },
    {
      id: 3,
      title: 'Smart Analytics',
      description: 'View comprehensive reports and balance insights',
      icon: 'analytics',
      color: colors.secondary,
      details:
        'Get insights into your financial habits with detailed analytics, balance trends, and spending categorization across all your accounts.',
    },
    {
      id: 4,
      title: 'Secure & Private',
      description: 'All your data is stored locally on your device',
      icon: 'security',
      color: colors.error,
      details:
        'Your financial data never leaves your device. Everything is stored locally with robust encryption for maximum privacy and security.',
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
      // Initialize store and run migration if needed
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

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when navigating back from other screens
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleFeaturePress = (feature: any) => {
    setSelectedFeature(feature);
    setInfoModalVisible(true);
  };

  const renderFeatureCard = (feature: any) => (
    <TouchableOpacity
      key={feature.id}
      style={[styles.featureCard, { borderLeftColor: feature.color }]}
      onPress={() => handleFeaturePress(feature)}
      activeOpacity={0.7}
    >
      <View style={styles.featureHeader}>
        <View
          style={[
            styles.featureIcon,
            { backgroundColor: feature.color + '20' },
          ]}
        >
          <MaterialIcons name={feature.icon} size={24} color={feature.color} />
        </View>
        <View style={styles.featureContent}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
        </View>
        <FontAwesome5
          name="chevron-right"
          size={16}
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
    welcomeSection: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    welcomeTitle: {
      fontSize: Typography.fontSize.title1,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: Spacing.sm,
    },
    welcomeSubtitle: {
      fontSize: Typography.fontSize.body,
      color: colors.textSecondary,
      lineHeight: Typography.lineHeight.normal * Typography.fontSize.body,
    },
    featuresSection: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
    },
    sectionTitle: {
      fontSize: Typography.fontSize.title3,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
    },
    featureCard: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.large,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      borderLeftWidth: 4,
      ...shadows.card,
    },
    featureHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    featureIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: Spacing.md,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: Typography.fontSize.headline,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    featureDescription: {
      fontSize: Typography.fontSize.subheadline,
      color: colors.textSecondary,
      lineHeight:
        Typography.lineHeight.normal * Typography.fontSize.subheadline,
    },
    quickActionsSection: {
      marginHorizontal: Spacing.lg,
      marginTop: Spacing.xl,
    },
    actionButton: {
      backgroundColor: colors.primary,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xl,
      borderRadius: Spacing.borderRadius.large,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: Spacing.md,
      ...shadows.button,
    },
    actionButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.callout,
      fontWeight: Typography.fontWeight.semibold,
      marginLeft: Spacing.sm,
    },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      padding: Spacing.xl,
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.xxl,
      padding: Spacing.xxl,
      width: '100%' as const,
      maxWidth: 400,
      alignItems: 'center' as const,
    },
    modalHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: Spacing.xl,
    },
    modalIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: Spacing.lg,
    },
    modalTitle: {
      fontSize: Typography.fontSize.title3,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
    },
    modalDescription: {
      fontSize: Typography.fontSize.body,
      color: colors.textSecondary,
      lineHeight: Typography.lineHeight.normal * Typography.fontSize.body,
      textAlign: 'center' as const,
      marginBottom: Spacing.xl,
    },
    closeButton: {
      backgroundColor: colors.lightGray,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: Spacing.borderRadius.large,
    },
    closeButtonText: {
      color: colors.textPrimary,
      fontSize: Typography.fontSize.callout,
      fontWeight: Typography.fontWeight.semibold,
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

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to MoneyBook</Text>
        <Text style={styles.welcomeSubtitle}>
          Your personal finance companion for tracking multiple accounts,
          managing transactions, and gaining insights into your spending habits.
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>What You Can Do</Text>
        {appFeatures.map(renderFeatureCard)}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <FontAwesome5 name="plus-circle" size={20} color={colors.textLight} />
          <Text style={styles.actionButtonText}>
            Go to Accounts to Add Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
          <FontAwesome5 name="chart-line" size={20} color={colors.textLight} />
          <Text style={styles.actionButtonText}>View Transaction History</Text>
        </TouchableOpacity>
      </View>

      {/* Feature Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFeature && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalIcon,
                      { backgroundColor: selectedFeature.color + '20' },
                    ]}
                  >
                    <MaterialIcons
                      name={selectedFeature.icon}
                      size={32}
                      color={selectedFeature.color}
                    />
                  </View>
                  <Text style={styles.modalTitle}>{selectedFeature.title}</Text>
                </View>
                <Text style={styles.modalDescription}>
                  {selectedFeature.details}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setInfoModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeButtonText}>Got it!</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
