import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Plus, Calendar } from 'lucide-react-native';
import { useEventsStore } from '@/store/events-store';
import { useAuthStore } from '@/store/auth-store';
import EventItem from '@/components/event/EventItem';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function EventsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, isLoading, fetchEvents } = useEventsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  
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
  
  const currentEvents = selectedTab === 'upcoming' ? upcomingEvents : pastEvents;
  
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
      
      <LinearGradient
        colors={[colors.primary + '20', colors.background]}
        style={styles.headerGradient}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Calendar size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Calendar size={24} color={colors.textSecondary} />
            <Text style={styles.statNumber}>{pastEvents.length}</Text>
            <Text style={styles.statLabel}>Past</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'upcoming' && styles.selectedTab]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.selectedTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'past' && styles.selectedTab]}
          onPress={() => setSelectedTab('past')}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.selectedTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={currentEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventItem 
            event={item}
            onPress={() => navigateToEventDetails(item.id)}
          />
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
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Calendar size={48} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>
              No {selectedTab} events
            </Text>
            <Text style={styles.emptyText}>
              {selectedTab === 'upcoming' 
                ? "Check back later for new events"
                : "Previous events will appear here"}
            </Text>
          </View>
        )}
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
  headerGradient: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.card,
    marginHorizontal: 4,
  },
  selectedTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  selectedTabText: {
    color: colors.white,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginTop: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});