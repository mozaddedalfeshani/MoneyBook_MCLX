import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

export default function CalculatorScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string,
  ) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleOperation = (nextOperation: string) => {
    if (nextOperation === '=') {
      performOperation(nextOperation);
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    } else {
      performOperation(nextOperation);
    }
  };

  const formatDisplay = (value: string) => {
    if (value.length > 9) {
      return parseFloat(value).toExponential(3);
    }
    return value;
  };

  // iPhone calculator colors
  const calculatorColors = {
    background: '#000000',
    displayText: '#FFFFFF',
    numberButton: '#333333',
    numberButtonText: '#FFFFFF',
    operatorButton: '#FF9500',
    operatorButtonText: '#FFFFFF',
    functionButton: '#A6A6A6',
    functionButtonText: '#000000',
    operatorActive: '#FFB143',
  };

  const buttonSize = (width - 80) / 4; // Account for padding and margins

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: calculatorColors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: insets.top + 10,
      paddingBottom: 20,
      backgroundColor: calculatorColors.background,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: calculatorColors.functionButton,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: calculatorColors.displayText,
      marginLeft: 16,
    },
    displayContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: calculatorColors.background,
    },
    display: {
      fontSize: Math.min(80, width / 6),
      fontWeight: '200',
      color: calculatorColors.displayText,
      textAlign: 'right',
      minHeight: 90,
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingBottom: insets.bottom + 100, // Extra space for floating tab bar
      backgroundColor: calculatorColors.background,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    button: {
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    wideButton: {
      width: buttonSize * 2 + 20, // Double width plus margin
      height: buttonSize,
      borderRadius: buttonSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },

    numberButton: {
      backgroundColor: calculatorColors.numberButton,
    },
    operatorButton: {
      backgroundColor: calculatorColors.operatorButton,
    },
    operatorButtonActive: {
      backgroundColor: calculatorColors.operatorActive,
    },
    functionButton: {
      backgroundColor: calculatorColors.functionButton,
    },
    buttonText: {
      fontSize: 36,
      fontWeight: '400',
    },
    numberButtonText: {
      color: calculatorColors.numberButtonText,
    },
    operatorButtonText: {
      color: calculatorColors.operatorButtonText,
    },
    functionButtonText: {
      color: calculatorColors.functionButtonText,
    },
  });

  const renderButton = (
    title: string,
    onPress: () => void,
    buttonStyle: any,
    textStyle: any,
    isWide?: boolean,
  ) => (
    <TouchableOpacity
      style={[styles.button, buttonStyle, isWide && styles.wideButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={calculatorColors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesome5
            name="arrow-left"
            size={18}
            color={calculatorColors.functionButtonText}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calculator</Text>
      </View>

      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.display}>{formatDisplay(display)}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* First Row */}
        <View style={styles.buttonRow}>
          {renderButton(
            'AC',
            clear,
            styles.functionButton,
            styles.functionButtonText,
          )}
          {renderButton(
            '±',
            () => {
              if (display !== '0') {
                setDisplay(
                  display.charAt(0) === '-' ? display.slice(1) : '-' + display,
                );
              }
            },
            styles.functionButton,
            styles.functionButtonText,
          )}
          {renderButton(
            '%',
            () => {
              setDisplay(String(parseFloat(display) / 100));
            },
            styles.functionButton,
            styles.functionButtonText,
          )}
          {renderButton(
            '÷',
            () => handleOperation('÷'),
            operation === '÷'
              ? styles.operatorButtonActive
              : styles.operatorButton,
            styles.operatorButtonText,
          )}
        </View>

        {/* Second Row */}
        <View style={styles.buttonRow}>
          {renderButton(
            '7',
            () => inputNumber('7'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '8',
            () => inputNumber('8'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '9',
            () => inputNumber('9'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '×',
            () => handleOperation('×'),
            operation === '×'
              ? styles.operatorButtonActive
              : styles.operatorButton,
            styles.operatorButtonText,
          )}
        </View>

        {/* Third Row */}
        <View style={styles.buttonRow}>
          {renderButton(
            '4',
            () => inputNumber('4'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '5',
            () => inputNumber('5'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '6',
            () => inputNumber('6'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '-',
            () => handleOperation('-'),
            operation === '-'
              ? styles.operatorButtonActive
              : styles.operatorButton,
            styles.operatorButtonText,
          )}
        </View>

        {/* Fourth Row */}
        <View style={styles.buttonRow}>
          {renderButton(
            '1',
            () => inputNumber('1'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '2',
            () => inputNumber('2'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '3',
            () => inputNumber('3'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '+',
            () => handleOperation('+'),
            operation === '+'
              ? styles.operatorButtonActive
              : styles.operatorButton,
            styles.operatorButtonText,
          )}
        </View>

        {/* Fifth Row */}
        <View style={styles.buttonRow}>
          {renderButton(
            '0',
            () => inputNumber('0'),
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '.',
            inputDecimal,
            styles.numberButton,
            styles.numberButtonText,
          )}
          {renderButton(
            '=',
            () => handleOperation('='),
            styles.operatorButton,
            styles.operatorButtonText,
            true,
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
