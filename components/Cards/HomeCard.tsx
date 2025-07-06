import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');

interface HomeCardProps {
  balance: number;
  isLoading: boolean;
  lastCashIn: number;
  lastCashOut: number;
}

const HomeCard: React.FC<HomeCardProps> = ({
  balance,
  isLoading,
  lastCashIn,
  lastCashOut,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.cardbox}>
        {/* Gradient overlay */}
        <View style={styles.gradientOverlay} />

        {/* Balance content */}
        <View style={styles.contentContainer}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Your Balance</Text>
            <Text style={styles.balanceAmount}>
              {isLoading ? 'Loading...' : `${balance.toFixed(2)} Tk`}
            </Text>
            <Text style={styles.lastUpdated}>
              {isLoading ? 'Loading data...' : 'Last updated just now'}
            </Text>
          </View>

          {/* Bottom section with last transactions */}
          <View style={styles.bottomSection}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {lastCashIn > 0 ? `${lastCashIn.toFixed(2)} Tk` : 'No cash in'}
              </Text>
              <Text style={styles.statLabel}>Last Cash In</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {lastCashOut > 0
                  ? `${lastCashOut.toFixed(2)} Tk`
                  : 'No cash out'}
              </Text>
              <Text style={styles.statLabel}>Last Cash Out</Text>
            </View>
          </View>
        </View>

        {/* Decorative elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  cardbox: {
    width: width - 30,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#667eea',
    opacity: 1,
  },
  contentContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 25,
    justifyContent: 'space-between',
  },
  balanceSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  lastUpdated: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '400',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '400',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});
