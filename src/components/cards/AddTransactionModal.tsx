import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../../contexts';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive utilities
const responsive = {
  wp: (percentage: number) => (SCREEN_WIDTH * percentage) / 100,
  hp: (percentage: number) => (SCREEN_HEIGHT * percentage) / 100,
  fontSize: (size: number) => (SCREEN_WIDTH / 375) * size,
  spacing: (size: number) => (SCREEN_WIDTH / 375) * size,
};

// Typography System
const Typography = {
  fontSize: {
    caption2: responsive.fontSize(11),
    caption1: responsive.fontSize(12),
    footnote: responsive.fontSize(13),
    subheadline: responsive.fontSize(15),
    callout: responsive.fontSize(16),
    body: responsive.fontSize(17),
    headline: responsive.fontSize(17),
    title3: responsive.fontSize(20),
    title2: responsive.fontSize(22),
    title1: responsive.fontSize(28),
    largeTitle: responsive.fontSize(34),
    small: responsive.fontSize(13),
    regular: responsive.fontSize(17),
    medium: responsive.fontSize(16),
    large: responsive.fontSize(20),
    xl: responsive.fontSize(22),
    xxl: responsive.fontSize(28),
    xxxl: responsive.fontSize(34),
  },
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
};

// Spacing System
const Spacing = {
  base: responsive.spacing(8),
  xs: responsive.spacing(4),
  sm: responsive.spacing(8),
  md: responsive.spacing(16),
  lg: responsive.spacing(24),
  xl: responsive.spacing(32),
  xxl: responsive.spacing(40),
  xxxl: responsive.spacing(48),
  margin: {
    xs: responsive.spacing(4),
    sm: responsive.spacing(8),
    md: responsive.spacing(16),
    lg: responsive.spacing(24),
    xl: responsive.spacing(32),
    xxl: responsive.spacing(40),
    xxxl: responsive.spacing(48),
  },
  padding: {
    xs: responsive.spacing(4),
    sm: responsive.spacing(8),
    md: responsive.spacing(16),
    lg: responsive.spacing(24),
    xl: responsive.spacing(32),
    xxl: responsive.spacing(40),
    xxxl: responsive.spacing(48),
  },
  borderRadius: {
    small: responsive.spacing(8),
    medium: responsive.spacing(12),
    large: responsive.spacing(16),
    xl: responsive.spacing(20),
    xxl: responsive.spacing(24),
    xxxl: responsive.spacing(28),
  },
  width: {
    border: 1,
  },
};

interface ModalConfig {
  title: string;
  showCredit: boolean;
  showDebit: boolean;
  autoDetected: boolean;
}

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  amount: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  selectedDate: Date;
  showDatePicker: boolean;
  useCustomDate: boolean;
  modalConfig: ModalConfig;
  onSetShowDatePicker: (show: boolean) => void;
  onSetUseCustomDate: (use: boolean) => void;
  onSetSelectedDate: (date: Date) => void;
  onCredit: () => void;
  onDebit: () => void;
  formatDate: (date: Date) => string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  amount,
  reason,
  onReasonChange,
  selectedDate,
  showDatePicker,
  useCustomDate,
  modalConfig,
  onSetShowDatePicker,
  onSetUseCustomDate,
  onSetSelectedDate,
  onCredit,
  onDebit,
  formatDate,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor:
        Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: Spacing.xl,
      paddingBottom: Platform.OS === 'ios' ? responsive.hp(10) : Spacing.xl,
    },
    modalContent: {
      backgroundColor: colors.white,
      borderRadius: Spacing.borderRadius.xxl,
      padding: Spacing.xxl,
      width: responsive.wp(90),
      maxWidth: responsive.wp(95),
      alignItems: 'center',
      shadowColor: colors.shadowPrimary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 15,
    },
    modalTitle: {
      fontSize: Typography.fontSize.xl,
      fontWeight: Typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: Spacing.lg,
      textAlign: 'center',
    },
    modalAmount: {
      fontSize: Typography.fontSize.large,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.primary,
      marginBottom: Spacing.xl,
    },
    autoDetectedText: {
      fontSize: Typography.fontSize.footnote,
      color: colors.warning,
      textAlign: 'center',
      marginBottom: Spacing.md,
      fontStyle: 'italic',
    },
    reasonContainer: {
      width: '100%',
      marginBottom: Spacing.xl,
    },
    reasonLabel: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
    },
    reasonInput: {
      borderWidth: Spacing.width.border,
      borderColor: colors.border,
      borderRadius: Spacing.borderRadius.medium,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      fontSize: Typography.fontSize.medium,
      backgroundColor: colors.veryLightGray,
      color: colors.textPrimary,
      minHeight: 60,
      textAlignVertical: 'top',
    },
    datePickerContainer: {
      width: '100%',
      marginBottom: Spacing.xl,
    },
    datePickerLabel: {
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: Spacing.md,
    },
    dateToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    dateToggleText: {
      fontSize: Typography.fontSize.medium,
      color: colors.textPrimary,
      marginRight: Spacing.sm,
    },
    dateDisplayContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: Spacing.width.border,
      borderColor: colors.border,
      borderRadius: Spacing.borderRadius.medium,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: colors.veryLightGray,
    },
    dateDisplayText: {
      flex: 1,
      fontSize: Typography.fontSize.medium,
      color: colors.textPrimary,
      paddingVertical: Spacing.sm,
    },
    datePickerButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: Spacing.borderRadius.small,
      marginLeft: Spacing.sm,
    },
    datePickerButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.small,
      fontWeight: Typography.fontWeight.medium,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    modalButton: {
      flex: 1,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.lg,
      borderRadius: Spacing.borderRadius.large,
      alignItems: 'center',
    },
    creditButton: {
      backgroundColor: colors.success,
    },
    debitButton: {
      backgroundColor: colors.error,
    },
    modalButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.semibold,
    },
    cancelButton: {
      backgroundColor: colors.gray,
      paddingVertical: Spacing.md,
      borderRadius: Spacing.borderRadius.medium,
      alignItems: 'center',
      width: '100%',
    },
    cancelButtonText: {
      color: colors.textLight,
      fontSize: Typography.fontSize.medium,
      fontWeight: Typography.fontWeight.medium,
    },
    modalKeyboardAvoid: {
      width: '100%',
      alignItems: 'center',
    },
  });

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        presentationStyle="pageSheet"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalKeyboardAvoid}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{modalConfig.title}</Text>
                <Text style={styles.modalAmount}>
                  Amount: {Math.abs(parseFloat(amount) || 0).toFixed(2)} Tk
                </Text>
                {modalConfig.autoDetected && (
                  <Text style={styles.autoDetectedText}>
                    ⚡ Auto-detected as debit transaction
                  </Text>
                )}

                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonLabel}>Reason (Optional)</Text>
                  <TextInput
                    style={styles.reasonInput}
                    placeholder="e.g., Groceries, Salary, Gift..."
                    placeholderTextColor={colors.textSecondary}
                    value={reason}
                    onChangeText={onReasonChange}
                    multiline={true}
                    maxLength={100}
                  />
                </View>

                {/* Date Picker Section */}
                <View style={styles.datePickerContainer}>
                  <Text style={styles.datePickerLabel}>Transaction Date</Text>

                  <View style={styles.dateToggleContainer}>
                    <Text style={styles.dateToggleText}>Use custom date:</Text>
                    <TouchableOpacity
                      style={[
                        styles.datePickerButton,
                        !useCustomDate && {
                          backgroundColor: colors.gray,
                        },
                      ]}
                      onPress={() => onSetUseCustomDate(!useCustomDate)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {useCustomDate ? 'ON' : 'OFF'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {useCustomDate && (
                    <View style={styles.dateDisplayContainer}>
                      <Text style={styles.dateDisplayText}>
                        {formatDate(selectedDate)}
                      </Text>
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => onSetShowDatePicker(true)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.datePickerButtonText}>
                          <FontAwesome5
                            name="calendar-alt"
                            size={12}
                            color={colors.textLight}
                          />
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View
                  style={[
                    styles.modalButtons,
                    (!modalConfig.showCredit || !modalConfig.showDebit) && {
                      justifyContent: 'center',
                    },
                  ]}
                >
                  {modalConfig.showCredit && (
                    <TouchableOpacity
                      style={[styles.modalButton, styles.creditButton]}
                      onPress={onCredit}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalButtonText}>💰 Credit</Text>
                    </TouchableOpacity>
                  )}

                  {modalConfig.showDebit && (
                    <TouchableOpacity
                      style={[styles.modalButton, styles.debitButton]}
                      onPress={onDebit}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.modalButtonText}>💸 Debit</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date Picker Modal */}
      <DatePicker
        modal
        open={showDatePicker}
        date={selectedDate}
        mode="date"
        maximumDate={new Date()}
        onConfirm={date => {
          onSetShowDatePicker(false);
          onSetSelectedDate(date);
        }}
        onCancel={() => {
          onSetShowDatePicker(false);
        }}
      />
    </>
  );
};

export default AddTransactionModal;
