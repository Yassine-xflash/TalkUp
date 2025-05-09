import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '@/constants/colors';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: boolean;
  gradient?: boolean;
  gradientColors?: string[];
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padded = true,
  elevated = true,
  gradient = false,
  gradientColors,
}) => {
  return (
    <Animated.View
      style={[
        styles.card,
        padded && styles.padded,
        elevated && Platform.select({
          ios: styles.shadowIOS,
          android: styles.shadowAndroid,
          web: styles.shadowWeb,
        }),
        style,
      ]}
    >
      {gradient ? (
        <LinearGradient
          colors={gradientColors || colors.primaryGradient}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  padded: {
    padding: 16,
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  shadowAndroid: {
    elevation: 4,
  },
  shadowWeb: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  gradient: {
    flex: 1,
  },
});

export default Card;