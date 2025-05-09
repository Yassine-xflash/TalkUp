import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import colors from '@/constants/colors';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  onClear,
  onFocus,
  onBlur,
  placeholder = "Search...",
  autoFocus = false,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoid}
    >
      <View style={styles.container}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={styles.input}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          enablesReturnKeyAutomatically
        />
        
        {value.length > 0 && Platform.OS !== 'ios' && (
          <TouchableOpacity 
            onPress={() => {
              onChangeText("");
              onClear?.();
            }}
            style={styles.clearButton}
          >
            <X size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardHover,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44, // Increased height for better touch targets
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: '100%',
    padding: 0,
    ...Platform.select({
      ios: {
        paddingVertical: 12, // Better vertical padding for iOS
      },
    }),
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default SearchInput;