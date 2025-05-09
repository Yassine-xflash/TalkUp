import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';

const slides = [
  {
    id: '1',
    title: 'TALKUP',
    description: 'Connect with your ENSA Fès community',
    image: 'https://cdn.dribbble.com/userupload/13732347/file/original-c1c07d2c4c4c8c0c0e8e5a4f6c8c6c6c.png?resize=1024x768',
  },
  {
    id: '2',
    title: 'Find Friends & Get Inspiration',
    description: 'Connect with fellow students, professors and alumni to expand your academic network.',
    image: 'https://cdn.dribbble.com/userupload/13732348/file/original-8c0c0e8e5a4f6c8c6c6c.png?resize=1024x768',
  },
  {
    id: '3',
    title: 'Meet Awesome People & Enjoy yourself',
    description: 'Join groups, attend events, and participate in discussions about topics that matter to you.',
    image: 'https://cdn.dribbble.com/userupload/13732349/file/original-4f6c8c6c6c.png?resize=1024x768',
  },
  {
    id: '4',
    title: 'Hangout with Friends',
    description: 'Chat with your friends, share resources, and stay connected with your academic community.',
    image: 'https://cdn.dribbble.com/userupload/13732350/file/original-6c8c6c6c.png?resize=1024x768',
  },
];

const OnboardingScreen = () => {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  // If user is already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({
      index: slides.length - 1,
      animated: true,
    });
  };

  const handleJoinNow = () => {
    router.push('/auth/register');
  };

  const handleSignIn = () => {
    router.push('/auth/login');
  };

  const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === slides.length - 1;

    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={[
              styles.image,
              isFirst && styles.logoSlide,
            ]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[
            styles.title,
            isFirst && styles.logoTitle,
          ]}>
            {item.title}
          </Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoinNow}
          >
            <Text style={styles.joinButtonText}>Join Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSignIn}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      <Pagination />

      {currentIndex === 0 && (
        <View style={styles.firstSlideButtons}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  logoSlide: {
    width: '80%',
    height: '80%',
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  logoTitle: {
    fontSize: 32,
    color: '#0066FF',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#0066FF',
    width: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  joinButton: {
    backgroundColor: '#FF6B3D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#0066FF',
    fontSize: 16,
  },
  firstSlideButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#FF6B3D',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;