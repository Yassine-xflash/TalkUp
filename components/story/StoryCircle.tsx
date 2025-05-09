import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';

interface StoryCircleProps {
  id: string;
  name: string;
  avatar?: string | null;
  isAdd?: boolean;
}

export default function StoryCircle({
  id,
  name,
  avatar,
  isAdd,
}: StoryCircleProps) {
  const router = useRouter();

  const handlePress = () => {
    if (isAdd) {
      router.push('/create-story');
    } else {
      router.push(`/story/${id}`);
    }
  };

  const getGradientColors = () => {
    if (isAdd) return colors.storyGradients.blue;
    
    const gradients = Object.values(colors.storyGradients);
    const index = Math.abs(name.charCodeAt(0)) % gradients.length;
    return gradients[index];
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.image} />
        ) : null}
        
        <View style={styles.footer}>
          {isAdd ? (
            <>
              <View style={styles.plusContainer}>
                <Plus size={20} color="#3b82f6" style={styles.plusIcon} />
              </View>
              <Text style={styles.name}>Add Story</Text>
            </>
          ) : (
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 96,
    height: 144,
    marginRight: 12,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  plusContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  plusIcon: {
    ...Platform.select({
      web: {
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        left: '50%',
        top: '50%',
      },
    }),
  },
  name: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});