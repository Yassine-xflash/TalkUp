import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useEventsStore } from '@/store/events-store';
import { useAuthStore } from '@/store/auth-store';
import EventItem from '@/components/event/EventItem';
import colors from '@/constants/colors';

export default function EventsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, isLoading, fetchEvents } = useEventsStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };
  
  const navigateToEventDetails = (eventId: string) => {
    router.push(`/event/${eventId}`);
  };
  
  const navigateToCreateEvent = () => {
    router.push('/create-event');
  };
  
  if (isLoading && !refreshing && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  // Group events by upcoming and past
  const now = Date.now();
  const upcomingEvents = events.filter(event => event.startDate > now);
  const pastEvents = events.filter(event => event.startDate <= now);
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Events',
          headerRight: () => (
            user && (user.role === 'professor' || user.role === 'club' || user.role === 'admin') ? (
              <TouchableOpacity 
                style={styles.createButton} 
                onPress={navigateToCreateEvent}
              >
                <Plus size={24} color={colors.primary} />
              </TouchableOpacity>
            ) : null
          ),
        }} 
      />
      
      <FlatList
        data={[
          { title: 'Upcoming Events', data: upcomingEvents, key: 'upcoming' },
          { title: 'Past Events', data: pastEvents, key: 'past' },
        ]}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            
            {item.data.length > 0 ? (
              item.data.map(event => (
                <EventItem 
                  key={event.id}
                  event={event} 
                  onPress={() => navigateToEventDetails(event.id)}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {item.key === 'upcoming' 
                    ? "No upcoming events" 
                    : "No past events"}
                </Text>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
    </View>
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
  createButton: {
    padding: 8,
    marginRight: 8,
  },
  listContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});