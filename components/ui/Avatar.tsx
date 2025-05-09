import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import colors from '@/constants/colors';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 40,
  style,
}) => {
  const getInitials = (name?: string) => {
    if (!name) return '?';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0).toUpperCase() + 
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };
  
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };
  
  const textSize = {
    fontSize: size * 0.4,
  };
  
  return (
    <View style={[containerStyle, styles.container, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[containerStyle, styles.image]}
        />
      ) : (
        <View style={[containerStyle, styles.placeholder]}>
          <Text style={[styles.initials, textSize]}>
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Avatar;