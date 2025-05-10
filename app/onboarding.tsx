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
    image: 'https://media-hosting.imagekit.io/bdce9eed61dd4e06/d10077a3-a197-4a19-88fe-e88fa9437e8e-removebg-preview.png?Expires=1841440791&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=L8BwPMyy3B4M9CXXCG6dx6U3-o3ankbUem6BhM82ceaO3zpxNXzvWrr0Q-aATG7fvc65n3~P-i2YZ~7nfIEGt05sSL9iJfbOE9f0fYZOHnNkwTVGjVtnvuPcZRSl4sBvscVSyAYvC6FVV17~6olljaPu4sl63DqKKW~sCSXbQvZQc~kdp0Nh0oCkypUj-p57I~M5Q2B2aT8epO54qGuBJrqFubUQTIqqCFCTltdWly-FOwuYcPkryEuxiTd9k2zbx0qfU2hppY~FhYsBMLDkOx8omljqMP1TGeqwRLbQSreNc5EWICyvFk9NWtnvm9qzhO6ijVpGb8W0nzsce4qD8w__',
  },
  {
    id: '2',
    title: 'Find Friends & Get Inspiration',
    description: 'Connect with fellow students, professors and alumni to expand your academic network.',
    image: 'https://media-hosting.imagekit.io/e17cc11a476e4bc5/image-removebg-preview%20(2).png?Expires=1841440791&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=Vd~Kwx~~0YHf~IeJNU-3luLK~gxnBUKm~a6mNQs5o1aF8FnWV6Nc6qXbU2pmHk-Hqu0BDWWUfahhZmwTP7cfhziJLC42oPAX5OuNCtyNkznb0-hdE2k4OpLYCPPvQHMdQX-X6j8yRNF-y1L56EGE65L2WbfIEEX-woAv~krJzL54JdU~h2~p8M-xY1IQRwcrZ~22K94er3RTssn0u9n7CNIWcLhI4cRyygGvxodmpBGOmT0h4lhm~Ga2YDBHa8T6NT27lLeHSiUQ7TyQS2K49UJkUhP5K~Av5hf7g4OD1aQViGuvVIstKfo6PS7pXvLLWXXYHvlCWbhLEzb4ZppbPA__',
  },
  {
    id: '3',
    title: 'Meet Awesome People & Enjoy yourself',
    description: 'Join groups, attend events, and participate in discussions about topics that matter to you.',
    image: 'https://media-hosting.imagekit.io/7be937240cdc4156/image-removebg-preview%20(1).png?Expires=1841440791&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=z8Bkgef91oXC6ok2ustYTIsu-lxFKH7Gy4w3PrlHzXIxzdUPQyLoyGG-iDqbVVHun-p8ePGLJUqnkIDPppRlmfrsB-UGbmDsPLJpUKbxZtmKeCYavdvpmmqao0wDTfjDFRc7~UdTumA~-ELHD4WKfpIKVs1ti~JekHlz4f3oTkqwofwTnVCUhgFEnBYM-EDo~A19uGdveEAW35m80bEDU-~KcHo~aOsKAgHAhegNMM7jCK6Q9xdCiqEwR0XUbHlxvYw3be5dRYLtI5Jpcahc5XKxhP2wiRZCDZSXofy1vB6alwXcEHboRUpdzyADXkQHntS2OmRAml6Xn2aEper0bA__',
  },
  {
    id: '4',
    title: 'Hangout with Friends',
    description: 'Chat with your friends, share resources, and stay connected with your academic community.',
    image: 'https://media-hosting.imagekit.io/e35d208c42544733/image-removebg-preview.png?Expires=1841440791&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=rHmOyDfBbxQYNiKfNCCD0zlpXtMgOHjF1m4zma6zgI833Clgna9JFchduFyG3Khwig4G9-m7agmeMmpB9huE3lQmp10fRhazvGwUHgAcqKJMtLadDtjupxBlEVEZkxQfA~RKQPAnG2zQBdw6oX3EYzEEn9PnlNqHSpxxeTKusj7iogMhoqSiW0j1rBvwZoYoKwZyOtbryxwUZ18WpD11fMzoG9Yr4wZzcc~qaVqPliLgYCaNeQh8hKGVRF3Mzc09hYJIgSsWikigvaHBYeN4T72rxj82sgWqB9hWrMKwJaeB-42q8fzz8pU0yobp5pzOkR2Ysgns3HSvFb0QTrSUnQ__',
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
    width: '160%', // Doubled from 80%
    height: '160%', // Doubled from 80%
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
    color: colors.primary,
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
    backgroundColor: colors.primary,
    width: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  joinButton: {
    backgroundColor: colors.secondary,
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
    color: colors.primary,
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
    backgroundColor: colors.secondary,
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