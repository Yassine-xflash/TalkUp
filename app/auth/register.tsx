import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Pressable
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check, ChevronDown } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import colors from '@/constants/colors';

const userTypes = ['Student', 'Professor', 'Graduate', 'Club'];
const schools = ['ENSA Fès'];

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [userType, setUserType] = useState('Student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('ENSA Fès');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  
  const [nameValid, setNameValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  
  const validateName = (text: string) => {
    setName(text);
    setNameValid(text.length >= 3);
  };
  
  const validateEmail = (text: string) => {
    setEmail(text);
    setEmailValid(text.endsWith('@usmba.ac.ma'));
  };
  
  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordValid(text.length >= 6);
  };
  
  const handleRegister = async () => {
    if (!nameValid || !emailValid || !passwordValid || !acceptedTerms) {
      return;
    }
    
    clearError();
    await register(email, password, name, userType.toLowerCase());
    
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
          <Text style={styles.title}>Let's Get Started</Text>
          <Text style={styles.subtitle}>
            Sign up or login to hop in this University social app
          </Text>
        </View>
        
        <View style={styles.form}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>User Type</Text>
            <Pressable 
              style={styles.dropdown}
              onPress={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
            >
              <Text style={styles.dropdownText}>{userType}</Text>
              <ChevronDown size={20} color={colors.textSecondary} />
            </Pressable>
            
            {showUserTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {userTypes.map((type) => (
                  <Pressable
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUserType(type);
                      setShowUserTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.inputRow}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={validateName}
              containerStyle={styles.input}
            />
            {nameValid && (
              <View style={styles.checkmark}>
                <Check size={16} color={colors.success} />
              </View>
            )}
          </View>
          
          <View style={styles.inputRow}>
            <Input
              label="Academic Email address"
              placeholder="your.name@usmba.ac.ma"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={validateEmail}
              containerStyle={styles.input}
            />
            {emailValid && (
              <View style={styles.checkmark}>
                <Check size={16} color={colors.success} />
              </View>
            )}
          </View>
          
          <View style={styles.inputRow}>
            <Input
              label="Password"
              placeholder="Enter your password"
              isPassword
              value={password}
              onChangeText={validatePassword}
              containerStyle={styles.input}
            />
            {passwordValid && (
              <View style={styles.checkmark}>
                <Check size={16} color={colors.success} />
              </View>
            )}
          </View>
          
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>School</Text>
            <Pressable 
              style={styles.dropdown}
              onPress={() => setShowSchoolDropdown(!showSchoolDropdown)}
            >
              <Text style={styles.dropdownText}>{school}</Text>
              <ChevronDown size={20} color={colors.textSecondary} />
            </Pressable>
            
            {showSchoolDropdown && (
              <View style={styles.dropdownMenu}>
                {schools.map((s) => (
                  <Pressable
                    key={s}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSchool(s);
                      setShowSchoolDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.termsContainer}>
            <Pressable
              style={styles.checkbox}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              {acceptedTerms && <Check size={16} color={colors.primary} />}
            </Pressable>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms and Conditions</Text>
            </Text>
          </View>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <TouchableOpacity
            style={[
              styles.registerButton,
              (!nameValid || !emailValid || !passwordValid || !acceptedTerms) && 
              styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={!nameValid || !emailValid || !passwordValid || !acceptedTerms || isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating account...' : 'Get Started'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.footerLink}>Sign in</Text>
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
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginTop: 4,
    padding: 4,
    zIndex: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderRadius: 4,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  checkmark: {
    marginLeft: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${colors.success}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  termsLink: {
    color: colors.primary,
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#FF6B3D',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
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