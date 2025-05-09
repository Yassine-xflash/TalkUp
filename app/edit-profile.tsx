import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Edit2, Save, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [major, setMajor] = useState(user?.major || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!user) return;
    
    // In a real app, this would update the user data in the backend
    updateUser({
      ...user,
      name,
      bio,
      department,
      major,
      avatar,
    });
    
    Alert.alert('Success', 'Profile updated successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Edit Profile',
          }} 
        />
        <Text style={styles.errorText}>You must be logged in to view this page.</Text>
        <Button 
          title="Go to Login" 
          onPress={() => router.replace('/auth/login')} 
          style={styles.loginButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Save size={20} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{name.charAt(0)}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.editAvatarButton} onPress={pickImage}>
            <Camera size={16} color="#FFFFFF" />
            <Text style={styles.editAvatarText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Department</Text>
          <TextInput
            style={styles.input}
            value={department}
            onChangeText={setDepartment}
            placeholder="Enter your department"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Major</Text>
          <TextInput
            style={styles.input}
            value={major}
            onChangeText={setMajor}
            placeholder="Enter your major"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={[styles.inputContainer, styles.bioContainer]}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            placeholderTextColor={colors.textSecondary}
            multiline
          />
        </View>
      </Card>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Save Changes" 
          onPress={handleSave} 
          style={styles.saveButtonLarge}
          icon={<Save size={18} color="#FFFFFF" />}
        />
        <Button 
          title="Cancel"
          variant="outline"
          onPress={() => router.back()} 
          style={styles.cancelButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: -10,
  },
  editAvatarText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    marginHorizontal: 16,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bioContainer: {
    paddingBottom: 24,
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonLarge: {
    marginBottom: 12,
  },
  cancelButton: {},
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 24,
    color: colors.text,
    paddingHorizontal: 24,
  },
  loginButton: {
    marginHorizontal: 24,
  },
});