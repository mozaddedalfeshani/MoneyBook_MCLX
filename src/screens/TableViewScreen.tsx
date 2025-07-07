import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import {
  AccountService,
  AccountWithStats,
} from '../database/services/AccountService';
import { useTheme } from '../contexts';
import Store from '../store/store';

// Typography styles moved from centralized styles
const Typography = {
  // Font Sizes
  fontSize: {
    tiny: 10,
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xl: 20,
    xxl: 24,
    xxxl: 36,
  },

  // Font Weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },

  // Font Families (if needed for custom fonts)
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
};

// Spacing styles moved from centralized styles
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

  // Header shadow
  header: {
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

export default function TableViewScreen({ navigation }: any) {
  const { colors, currentTheme } = useTheme();
  const shadows = getShadows(colors);
  const [accounts, setAccounts] = useState<AccountWithStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newAccountName, setNewAccountName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  // Theme-compatible gradient colors
  const gradientColors =
    currentTheme === 'light'
      ? ['#f0faff', '#e6f7ff', '#f8fbff'] // Very light blue gradient
      : ['#2a2a2a', '#252525', '#1f1f1f']; // Subtle dark gradient

  const loadAccounts = async () => {
    try {
      setIsLoading(true);

      // Ensure Store is initialized (this will run migration if needed)
      await Store.initialize();

      // Load all accounts with their stats
      const accountsData = await AccountService.getAllAccountsWithStats();
      setAccounts(accountsData);

      // If no accounts exist, create the default "Main Account"
      if (accountsData.length === 0) {
        await AccountService.createAccount('Main Account');
        // Reload accounts after creating the default one
        const updatedAccountsData =
          await AccountService.getAllAccountsWithStats();
        setAccounts(updatedAccountsData);
      }
    } catch (error) {
      console.error('Error loading accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!newAccountName.trim()) {
      Alert.alert('Invalid Name', 'Please enter a valid account name');
      return;
    }

    try {
      setIsCreating(true);
      await AccountService.createAccount(newAccountName.trim());
      setModalVisible(false);
      setNewAccountName('');
      await loadAccounts();
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create account',
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAccount = (account: AccountWithStats) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${
        account.account.name
      }"?\n\nThis will permanently delete:\n• ${
        account.transactionCount
      } transactions\n• Balance: ${account.balance.toFixed(
        2,
      )} Tk\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteAccount(account),
        },
      ],
    );
  };

  const confirmDeleteAccount = (account: AccountWithStats) => {
    Alert.alert(
      'Final Confirmation',
      `Type "${account.account.name}" to confirm deletion:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'I understand, delete everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await AccountService.deleteAccount(account.account);
              await loadAccounts();
              Alert.alert(
                'Deleted',
                'Account and all its data have been deleted',
              );
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ],
    );
  };

  const handleAccountPress = (account: AccountWithStats) => {
    navigation.navigate('AccountDetail', {
      accountId: account.account.id,
      accountName: account.account.name,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAccounts().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, []),
  );

  useEffect(() => {
    loadAccounts();
  }, []);

  const renderAccountCard = ({ item }: { item: AccountWithStats }) => (
    <TouchableOpacity
      style={styles.accountCard}
      onPress={() => handleAccountPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.accountHeader}>
        <View style={styles.accountIcon}>
          <FontAwesome5 name="user-circle" size={24} color={colors.primary} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.account.name}</Text>
          <Text style={styles.accountStats}>
            {item.transactionCount} transactions
            {item.lastTransactionDate && ` • Last: ${item.lastTransactionDate}`}
          </Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text
            style={[
              styles.balanceAmount,
              { color: item.balance >= 0 ? colors.success : colors.error },
            ]}
          >
            {item.balance.toFixed(2)} Tk
          </Text>
        </View>
      </View>

      <View style={styles.accountActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAccountPress(item)}
        >
          <FontAwesome5 name="eye" size={16} color={colors.primary} />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAccount(item)}
        >
          <FontAwesome5 name="trash" size={16} color={colors.error} />
          <Text style={[styles.actionButtonText, { color: colors.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FontAwesome5 name="users" size={64} color={colors.textTertiary} />
      <Text style={styles.emptyStateText}>No accounts yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Create your first account to start managing transactions
      </Text>
      <TouchableOpacity
        style={styles.createFirstButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createFirstButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );

  // Dynamic styles
  const styles = StyleSheet.create({
    gradientContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    header: {
      backgroundColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(45, 45, 45, 0.95)',
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xl,
      paddingTop: 60,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      ...shadows.header,
    },
    headerTitle: {
      fontSize: Typography.fontSize.xxl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
      textShadowColor:
        currentTheme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    headerSubtitle: {
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
      marginBottom: Spacing.lg,
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: Spacing.borderRadius.large,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      gap: Spacing.sm,
      ...shadows.button,
    },
    addButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
    },
    listContainer: {
      padding: Spacing.lg,
      paddingBottom: 100,
    },
    accountCard: {
      backgroundColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.9)'
          : 'rgba(45, 45, 45, 0.9)',
      borderRadius: Spacing.borderRadius.large,
      padding: Spacing.lg,
      marginBottom: Spacing.md,
      ...shadows.card,
      borderWidth: 1,
      borderColor:
        currentTheme === 'light'
          ? 'rgba(255, 255, 255, 0.5)'
          : 'rgba(255, 255, 255, 0.1)',
    },
    accountHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      marginBottom: Spacing.md,
    },
    accountIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.veryLightGray,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: Spacing.md,
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: 4,
    },
    accountStats: {
      fontSize: Typography.fontSize.small,
      color: colors.textSecondary,
    },
    balanceContainer: {
      alignItems: 'flex-end' as const,
    },
    balanceAmount: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
    },
    accountActions: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      gap: Spacing.md,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: Spacing.borderRadius.medium,
      backgroundColor: colors.veryLightGray,
      gap: Spacing.sm,
    },
    deleteButton: {
      backgroundColor: colors.dangerBackground,
    },
    actionButtonText: {
      fontSize: Typography.fontSize.small,
      fontWeight: Typography.fontWeight.medium,
      color: colors.primary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: Spacing.xxl,
      paddingHorizontal: Spacing.xl,
    },
    emptyStateText: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textSecondary,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
      textAlign: 'center' as const,
    },
    emptyStateSubtext: {
      fontSize: Typography.fontSize.medium,
      color: colors.textTertiary,
      textAlign: 'center' as const,
      marginBottom: Spacing.xl,
    },
    createFirstButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.xxl,
      paddingVertical: Spacing.lg,
      borderRadius: Spacing.borderRadius.large,
      ...shadows.button,
    },
    createFirstButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    loadingText: {
      marginTop: Spacing.lg,
      fontSize: Typography.fontSize.medium,
      color: colors.textSecondary,
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
      maxWidth: 350,
      alignItems: 'center' as const,
    },
    modalTitle: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
      textAlign: 'center' as const,
    },
    inputContainer: {
      width: '100%' as const,
      marginBottom: Spacing.xl,
    },
    inputLabel: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: Spacing.borderRadius.medium,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: Typography.fontSize.medium,
      backgroundColor: colors.veryLightGray,
      color: colors.textPrimary,
    },
    modalButtons: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      width: '100%' as const,
      gap: Spacing.md,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderRadius: Spacing.borderRadius.medium,
      alignItems: 'center' as const,
    },
    createButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.lightGray,
    },
    modalButtonText: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
    },
    createButtonText: {
      color: colors.textLight,
    },
    cancelButtonText: {
      color: colors.textSecondary,
    },
  });

  if (isLoading) {
    return (
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading accounts...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Account Manager</Text>
          <Text style={styles.headerSubtitle}>
            Manage multiple accounts and track transactions
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="plus" size={16} color={colors.textLight} />
            <Text style={styles.addButtonText}>Add Account</Text>
          </TouchableOpacity>
        </View>

        {/* Accounts List */}
        <FlatList
          data={accounts}
          renderItem={renderAccountCard}
          keyExtractor={item => item.account.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Account Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Account</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Account Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Murad, Personal, Business"
                  placeholderTextColor={colors.textSecondary}
                  value={newAccountName}
                  onChangeText={setNewAccountName}
                  maxLength={50}
                  autoFocus={true}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setNewAccountName('');
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[styles.modalButtonText, styles.cancelButtonText]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.createButton]}
                  onPress={handleCreateAccount}
                  disabled={isCreating}
                  activeOpacity={0.7}
                >
                  {isCreating ? (
                    <ActivityIndicator size="small" color={colors.textLight} />
                  ) : (
                    <Text
                      style={[styles.modalButtonText, styles.createButtonText]}
                    >
                      Create
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}
