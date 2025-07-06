import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeCard from '../components/Cards/HomeCard';

interface TransactionData {
  balance: number;
  lastCashIn: number;
  lastCashOut: number;
}

export default function HomeScreen() {
  const [balance, setBalance] = useState<number>(0);
  const [lastCashIn, setLastCashIn] = useState<number>(0);
  const [lastCashOut, setLastCashOut] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from storage when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const savedData = await AsyncStorage.getItem('transactionData');
      if (savedData !== null) {
        const data: TransactionData = JSON.parse(savedData);
        setBalance(data.balance || 0);
        setLastCashIn(data.lastCashIn || 0);
        setLastCashOut(data.lastCashOut || 0);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load transaction data');
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (
    newBalance: number,
    newLastCashIn: number,
    newLastCashOut: number,
  ) => {
    try {
      const transactionData: TransactionData = {
        balance: newBalance,
        lastCashIn: newLastCashIn,
        lastCashOut: newLastCashOut,
      };
      await AsyncStorage.setItem(
        'transactionData',
        JSON.stringify(transactionData),
      );
      setBalance(newBalance);
      setLastCashIn(newLastCashIn);
      setLastCashOut(newLastCashOut);
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save transaction data');
    }
  };

  const handleUpdatePress = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount greater than 0',
      );
      return;
    }
    setModalVisible(true);
  };

  const handleCashIn = async () => {
    const cashInAmount = parseFloat(amount);
    const newBalance = balance + cashInAmount;
    await saveData(newBalance, cashInAmount, lastCashOut);
    setModalVisible(false);
    setAmount('');
    setReason('');

    const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
    Alert.alert(
      'Success',
      `Cash In successful! New balance: ${newBalance.toFixed(
        2,
      )} Tk${reasonText}`,
    );
  };

  const handleCashOut = async () => {
    const cashOutAmount = parseFloat(amount);
    if (cashOutAmount > balance) {
      Alert.alert(
        'Insufficient Balance',
        "You don't have enough money for this transaction",
      );
      return;
    }
    const newBalance = balance - cashOutAmount;
    await saveData(newBalance, lastCashIn, cashOutAmount);
    setModalVisible(false);
    setAmount('');
    setReason('');

    const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
    Alert.alert(
      'Success',
      `Cash Out successful! New balance: ${newBalance.toFixed(
        2,
      )} Tk${reasonText}`,
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setReason(''); // Clear reason when closing
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <HomeCard
        balance={balance}
        isLoading={isLoading}
        lastCashIn={lastCashIn}
        lastCashOut={lastCashOut}
      />

      {/* Money Management Box */}
      <View style={styles.managementBox}>
        <Text style={styles.boxTitle}>Manage Your Money</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount (Tk)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdatePress}
            activeOpacity={0.7}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Cash In/Out Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Transaction Type</Text>
            <Text style={styles.modalAmount}>Amount: {amount} Tk</Text>

            {/* Reason Input Field */}
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonLabel}>Reason (Optional)</Text>
              <TextInput
                style={styles.reasonInput}
                placeholder="e.g., Groceries, Salary, Gift..."
                value={reason}
                onChangeText={setReason}
                placeholderTextColor="#999"
                multiline={true}
                maxLength={100}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cashInButton]}
                onPress={handleCashIn}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>💰 Cash In</Text>
                <Text style={styles.modalButtonSubtext}>
                  Add money to balance
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cashOutButton]}
                onPress={handleCashOut}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>💸 Cash Out</Text>
                <Text style={styles.modalButtonSubtext}>
                  Use money from balance
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },
  managementBox: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  updateButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    minWidth: 80,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  modalAmount: {
    fontSize: 18,
    fontWeight: '500',
    color: '#667eea',
    marginBottom: 20,
  },
  reasonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  reasonLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  reasonInput: {
    width: '100%',
    minHeight: 50,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    textAlignVertical: 'top',
  },
  modalButtons: {
    width: '100%',
    gap: 15,
  },
  modalButton: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  cashInButton: {
    backgroundColor: '#4CAF50',
  },
  cashOutButton: {
    backgroundColor: '#FF6B6B',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  modalButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
});
