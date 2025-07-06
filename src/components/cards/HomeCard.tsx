import { Text, View } from 'react-native';
import React from 'react';
import { HomeCardStyles } from '../../styles/components/homeCard';

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
    <View style={HomeCardStyles.container}>
      <View style={HomeCardStyles.cardbox}>
        {/* Gradient overlay */}
        <View style={HomeCardStyles.gradientOverlay} />

        {/* Balance content */}
        <View style={HomeCardStyles.contentContainer}>
          <View style={HomeCardStyles.balanceSection}>
            <Text style={HomeCardStyles.balanceLabel}>Your Balance</Text>
            <Text style={HomeCardStyles.balanceAmount}>
              {isLoading ? 'Loading...' : `${balance.toFixed(2)} Tk`}
            </Text>
            <Text style={HomeCardStyles.lastUpdated}>
              {isLoading ? 'Loading data...' : 'Last updated just now'}
            </Text>
          </View>

          {/* Bottom section with last transactions */}
          <View style={HomeCardStyles.bottomSection}>
            <View style={HomeCardStyles.statItem}>
              <Text style={HomeCardStyles.statValue}>
                {lastCashIn > 0 ? `${lastCashIn.toFixed(2)} Tk` : 'No cash in'}
              </Text>
              <Text style={HomeCardStyles.statLabel}>Last Cash In</Text>
            </View>
            <View style={HomeCardStyles.divider} />
            <View style={HomeCardStyles.statItem}>
              <Text style={HomeCardStyles.statValue}>
                {lastCashOut > 0
                  ? `${lastCashOut.toFixed(2)} Tk`
                  : 'No cash out'}
              </Text>
              <Text style={HomeCardStyles.statLabel}>Last Cash Out</Text>
            </View>
          </View>
        </View>

        {/* Decorative elements */}
        <View style={HomeCardStyles.decorativeCircle1} />
        <View style={HomeCardStyles.decorativeCircle2} />
      </View>
    </View>
  );
};

export default HomeCard;
