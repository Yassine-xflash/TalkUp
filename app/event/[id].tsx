import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Users, Share2 } from 'lucide-react-native';
import { useEventsStore } from '@/store/events-store';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import colors from '@/constants/colors';
import { formatDate, formatTime } from '@/utils/date';
import users from '@/mocks/users';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, isLoading, fetchEvents, attendEvent, cancelAttendance } = useEventsStore();
  
  const [event, setEvent] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  useEffect(() => {
    if (events.length > 0 && id) {
      const foundEvent = events.find(e => e.id === id);
      setEvent(foundEvent);
      
      if (foundEvent) {
        const eventCreator = users.find(u => u.id === foundEvent.creatorId);
        setCreator(eventCreator);
      }
    }
  }, [events, id]);
  
  const handleAttend = () => {
    if (!user || !event) return;
    attendEvent(event.id, user.id);
  };
  
  const handleCancelAttendance = () => {
    if (!user || !event) return;
    cancelAttendance(event.id, user.id);
  };
  
  const isUserAttending = user && event ? event.attendees.includes(user.id) : false;
  const isEventPast = event ? event.startDate < Date.now() : false;
  
  if (isLoading && !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()} 
          style={styles.errorButton}
        />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Event Details',
          headerBackTitle: 'Events',
        }} 
      />
      
      {event.image ? (
        <Image 
          source={{ uri: event.image }} 
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.infoRow}>
          <Calendar size={20} color={colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {formatDate(event.startDate)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Clock size={20} color={colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {formatTime(event.startDate)} - {formatTime(event.endDate)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <MapPin size={20} color={colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {event.location}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Users size={20} color={colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            {event.attendees.length} {event.attendees.length === 1 ? 'attendee' : 'attendees'}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>About this event</Text>
        <Text style={styles.description}>{event.description}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Organized by</Text>
        {creator && (
          <View style={styles.creatorContainer}>
            <Avatar 
              source={creator.avatar} 
              name={creator.name} 
              size={50} 
            />
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorName}>{creator.name}</Text>
              <Text style={styles.creatorRole}>
                {creator.role.charAt(0).toUpperCase() + creator.role.slice(1)}
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.actions}>
          {!isEventPast && user && (
            isUserAttending ? (
              <Button
                title="Cancel Attendance"
                onPress={handleCancelAttendance}
                variant="outline"
                style={styles.actionButton}
              />
            ) : (
              <Button
                title="Attend Event"
                onPress={handleAttend}
                style={styles.actionButton}
              />
            )
          )}
          
          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorButton: {
    minWidth: 120,
  },
  image: {
    width: '100%',
    height: 200,
  },
  imagePlaceholder: {
    backgroundColor: colors.border,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorInfo: {
    marginLeft: 12,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  creatorRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  shareButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});