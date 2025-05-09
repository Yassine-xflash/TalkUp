import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MessageCircle, Heart } from 'lucide-react-native';
import colors from '@/constants/colors';
import { formatTimeAgo } from '@/utils/date';
import Avatar from '@/components/ui/Avatar';

interface NewsItemProps {
  news: any;
  onPress: () => void;
}

const NewsItem: React.FC<NewsItemProps> = ({ news, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar source={news.source?.avatar} size={40} name={news.source?.name} />
          <View style={styles.headerInfo}>
            <Text style={styles.sourceName}>{news.source?.name}</Text>
            <Text style={styles.timestamp}>{formatTimeAgo(news.createdAt)}</Text>
          </View>
        </View>
        {news.category && (
          <View style={[
            styles.categoryBadge,
            { backgroundColor: news.category === 'Government' ? colors.warning : colors.primary }
          ]}>
            <Text style={styles.categoryText}>{news.category}</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{news.title}</Text>
      
      {news.image && (
        <Image 
          source={{ uri: news.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.footer}>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Heart size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{news.likes}</Text>
          </View>
          <View style={styles.statItem}>
            <MessageCircle size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{news.comments}</Text>
          </View>
        </View>
        <Text style={styles.readTime}>{news.readTime} min read</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: 12,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  readTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default NewsItem;