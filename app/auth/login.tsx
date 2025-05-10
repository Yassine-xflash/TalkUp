import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import colors from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!email.endsWith('@usmba.ac.ma')) {
      setEmailError('Please use your academic email (@usmba.ac.ma)');
      return false;
    }
    
    setEmailError('');
    return true;
  };
  
  const handleLogin = async () => {
    clearError();
    
    if (!validateEmail(email)) {
      return;
    }
    
    if (!password) {
      return;
    }
    
    await login(email, password);
    
    if (!error) {
      router.replace('/(tabs)');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen 
        options={{
          headerShown: false
        }} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Hello there, login to see stories from around the world
          </Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Username or email"
            placeholder="Enter your username or email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) validateEmail(text);
            }}
            error={emailError}
            containerStyle={styles.input}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            isPassword
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.input}
          />
          
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => router.push('/auth/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <TouchableOpacity
            style={[
              styles.signInButton,
              isLoading && styles.signInButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account? {' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text style={styles.footerLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066FF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#0066FF',
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: '#FF6B3D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: '#0066FF',
    fontSize: 14,
    fontWeight: '500',
  },
});