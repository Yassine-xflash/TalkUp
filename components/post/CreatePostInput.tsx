import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image as ImageIcon, Video, FileText, BarChart2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import colors from '@/constants/colors';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import { User } from '@/types';

interface CreatePostInputProps {
  user: User;
  onSubmit: (content: string, media?: string[]) => void;
}

const CreatePostInput: React.FC<CreatePostInputProps> = ({
  user,
  onSubmit,
}) => {
  const [content, setContent] = useState('');
  
  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.inputContainer}>
        <Avatar source={user.avatar} name={user.name} size={40} />
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor={colors.textSecondary}
          multiline
          value={content}
          onChangeText={setContent}
        />
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <ImageIcon size={20} color={colors.primary} />
          <Text style={styles.actionText}>Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Video size={20} color={colors.success} />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <FileText size={20} color={colors.share} />
          <Text style={styles.actionText}>PDF</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <BarChart2 size={20} color={colors.warning} />
          <Text style={styles.actionText}>Poll</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
    padding: 8,
    minHeight: 40,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default CreatePostInput;