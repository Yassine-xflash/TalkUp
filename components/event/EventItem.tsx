import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, MapPin, Clock, Users } from 'lucide-react-native';
import { Event } from '@/types';
import Card from '@/components/ui/Card';
import colors from '@/constants/colors';
import { formatDate } from '@/utils/date';

interface EventItemProps {
  event: Event;
  onPress: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onPress }) => {
  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {event.coverImage && (
          <Image 
            source={{ uri: event.coverImage }} 
            style={styles.coverImage}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.infoRow}>
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              {formatDate(event.startDate)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
          
          <View style={styles.footer}>
            <View style={styles.infoRow}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.footerText}>
                {event.duration} {event.duration === 1 ? 'hour' : 'hours'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={styles.footerText}>
                {event.attendees.length} attending
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});

export default EventItem;