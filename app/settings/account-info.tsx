import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { User, Edit2 } from 'lucide-react-native';
import colors from '@/constants/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';

export default function AccountInfoScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [major, setMajor] = useState(user?.major || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSave = () => {
    // In a real app, this would update the user data in the backend
    Alert.alert('Success', 'Account information updated successfully', [
      { text: 'OK', onPress: () => setIsEditing(false) }
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Account Information',
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
          title: 'Account Information',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(!isEditing)}
            >
              <Edit2 size={20} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
      
      <Card style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.infoText}>{name || 'Not provided'}</Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              editable={false}
            />
          ) : (
            <Text style={styles.infoText}>{email}</Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Department</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={department}
              onChangeText={setDepartment}
              placeholder="Enter your department"
            />
          ) : (
            <Text style={styles.infoText}>{department || 'Not provided'}</Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Major</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={major}
              onChangeText={setMajor}
              placeholder="Enter your major"
            />
          ) : (
            <Text style={styles.infoText}>{major || 'Not provided'}</Text>
          )}
        </View>
        
        <View style={[styles.inputContainer, styles.bioContainer]}>
          <Text style={styles.label}>Bio</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
            />
          ) : (
            <Text style={styles.infoText}>{bio || 'No bio provided yet.'}</Text>
          )}
        </View>
      </Card>
      
      {isEditing && (
        <View style={styles.buttonContainer}>
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            style={styles.saveButton}
          />
          <Button 
            title="Cancel" 
            variant="outline"
            onPress={() => {
              setIsEditing(false);
              // Reset fields to original values
              setName(user.name);
              setEmail(user.email);
              setDepartment(user.department || '');
              setMajor(user.major || '');
              setBio(user.bio || '');
            }} 
            style={styles.cancelButton}
          />
        </View>
      )}
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  infoCard: {
    marginHorizontal: 16,
    padding: 0,
    overflow: 'hidden',
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
  disabledInput: {
    opacity: 0.6,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 0,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {},
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text,
  },
  loginButton: {
    width: '100%',
  },
});