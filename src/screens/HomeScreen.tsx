import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Store from '../store/store';
import { Transaction, AppData } from '../store/types/types';
import { HomeScreenStyles } from '../styles/components/homeScreen';
import HomeCard from '../components/cards/HomeCard';

export default function HomeScreen() {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load data from store
  const loadData = async () => {
    try {
      setIsLoading(true);
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

  // Update local state with new data
  const updateLocalState = (newData: AppData) => {
    setBalance(newData.balance);
    setTransactions(newData.transactions);
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
    try {
      const cashInAmount = parseFloat(amount);
      const newData = await Store.addCashIn(
        balance,
        transactions,
        cashInAmount,
        reason,
      );
      updateLocalState(newData);
      setModalVisible(false);
      setAmount('');
      setReason('');

      const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
      Alert.alert(
        'Success',
        `Cash In successful! New balance: ${newData.balance.toFixed(
          2,
        )} Tk${reasonText}`,
      );
    } catch (error) {
      console.error('Error in cash in:', error);
      Alert.alert('Error', 'Failed to add cash in transaction');
    }
  };

  const handleCashOut = async () => {
    try {
      const cashOutAmount = parseFloat(amount);
      const newData = await Store.addCashOut(
        balance,
        transactions,
        cashOutAmount,
        reason,
      );
      updateLocalState(newData);
      setModalVisible(false);
      setAmount('');
      setReason('');

      const reasonText = reason.trim() ? ` (${reason.trim()})` : '';
      Alert.alert(
        'Success',
        `Cash Out successful! New balance: ${newData.balance.toFixed(
          2,
        )} Tk${reasonText}`,
      );
    } catch (error) {
      console.error('Error in cash out:', error);
      if (error instanceof Error && error.message === 'Insufficient balance') {
        Alert.alert(
          'Insufficient Balance',
          "You don't have enough money for this transaction",
        );
      } else {
        Alert.alert('Error', 'Failed to add cash out transaction');
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setReason('');
  };

  // Get last transaction amounts for HomeCard
  const { lastCashIn, lastCashOut } =
    Store.getLastTransactionAmounts(transactions);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when navigating back from History screen
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <ScrollView
      style={HomeScreenStyles.container}
      contentContainerStyle={HomeScreenStyles.contentContainer}
    >
      <HomeCard
        balance={balance}
        isLoading={isLoading}
        lastCashIn={lastCashIn}
        lastCashOut={lastCashOut}
      />

      {/* Money Management Box */}
      <View style={HomeScreenStyles.managementBox}>
        <Text style={HomeScreenStyles.boxTitle}>Manage Your Money</Text>

        <View style={HomeScreenStyles.inputContainer}>
          <TextInput
            style={HomeScreenStyles.input}
            placeholder="Enter amount (Tk)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={HomeScreenStyles.updateButton}
            onPress={handleUpdatePress}
            activeOpacity={0.7}
          >
            <Text style={HomeScreenStyles.updateButtonText}>Update</Text>
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
        <View style={HomeScreenStyles.modalOverlay}>
          <View style={HomeScreenStyles.modalContent}>
            <Text style={HomeScreenStyles.modalTitle}>
              Choose Transaction Type
            </Text>
            <Text style={HomeScreenStyles.modalAmount}>
              Amount: {amount} Tk
            </Text>

            {/* Reason Input Field */}
            <View style={HomeScreenStyles.reasonContainer}>
              <Text style={HomeScreenStyles.reasonLabel}>
                Reason (Optional)
              </Text>
              <TextInput
                style={HomeScreenStyles.reasonInput}
                placeholder="e.g., Groceries, Salary, Gift..."
                value={reason}
                onChangeText={setReason}
                placeholderTextColor="#999"
                multiline={true}
                maxLength={100}
              />
            </View>

            <View style={HomeScreenStyles.modalButtons}>
              <TouchableOpacity
                style={[
                  HomeScreenStyles.modalButton,
                  HomeScreenStyles.cashInButton,
                ]}
                onPress={handleCashIn}
                activeOpacity={0.7}
              >
                <Text style={HomeScreenStyles.modalButtonText}>💰 Cash In</Text>
                <Text style={HomeScreenStyles.modalButtonSubtext}>
                  Add money to balance
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  HomeScreenStyles.modalButton,
                  HomeScreenStyles.cashOutButton,
                ]}
                onPress={handleCashOut}
                activeOpacity={0.7}
              >
                <Text style={HomeScreenStyles.modalButtonText}>
                  💸 Cash Out
                </Text>
                <Text style={HomeScreenStyles.modalButtonSubtext}>
                  Use money from balance
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={HomeScreenStyles.cancelButton}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Text style={HomeScreenStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
