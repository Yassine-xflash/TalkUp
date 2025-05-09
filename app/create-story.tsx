import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X, Camera, Image as ImageIcon, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType } from 'expo-camera';
import { useAuthStore } from '@/store/auth-store';
import { useStoriesStore } from '@/store/stories-store';
import colors from '@/constants/colors';

export default function CreateStoryScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addStory, isLoading } = useStoriesStore();

  const [media, setMedia] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMedia(result.assets[0].uri);
      setShowCamera(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const handlePost = async () => {
    if (!user || !media) return;

    await addStory(user.id, media, caption);
    router.back();
  };

  const handleCameraPress = async () => {
    if (!permission?.granted) {
      const status = await requestPermission();
      if (!status.granted) return;
    }
    setShowCamera(true);
  };

  const handleCameraCapture = async (camera: any) => {
    const photo = await camera.takePictureAsync();
    setMedia(photo.uri);
    setShowCamera(false);
  };

  if (!user) {
    router.replace('/auth/login');
    return null;
  }

  if (showCamera) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <CameraView
          style={styles.camera}
          facing={cameraType}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => setCameraType(current => 
                current === 'back' ? 'front' : 'back'
              )}
            >
              <Camera size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCameraCapture}
            />
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {!media ? (
        <View style={styles.pickContainer}>
          <TouchableOpacity
            style={styles.pickButton}
            onPress={pickImage}
          >
            <ImageIcon size={32} color={colors.primary} />
            <Text style={styles.pickText}>Choose from gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickButton}
            onPress={handleCameraPress}
          >
            <Camera size={32} color={colors.primary} />
            <Text style={styles.pickText}>Take a photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: media }}
            style={styles.preview}
            resizeMode="cover"
          />

          <View style={styles.captionContainer}>
            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={200}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.postButton,
              isLoading && styles.postButtonDisabled
            ]}
            onPress={handlePost}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Send size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  pickContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  pickButton: {
    alignItems: 'center',
    padding: 24,
  },
  pickText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  captionContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    padding: 16,
  },
  captionInput: {
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  postButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  closeButton: {
    padding: 8,
  },
  flipButton: {
    padding: 8,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});