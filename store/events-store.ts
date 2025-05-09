import { create } from 'zustand';
import { Event } from '@/types';
import events from '@/mocks/events';

interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  attendEvent: (eventId: string, userId: string) => Promise<void>;
  cancelAttendance: (eventId: string, userId: string) => Promise<void>;
  createEvent: (event: Omit<Event, 'id' | 'createdAt'>) => Promise<void>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,
  
  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Sort events by start date (soonest first)
      const sortedEvents = [...events].sort((a, b) => a.startDate - b.startDate);
      
      set({ events: sortedEvents, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to fetch events", 
        isLoading: false 
      });
    }
  },
  
  attendEvent: async (eventId, userId) => {
    try {
      set(state => ({
        events: state.events.map(event => 
          event.id === eventId 
            ? { ...event, attendees: [...event.attendees, userId] }
            : event
        )
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to attend event" 
      });
    }
  },
  
  cancelAttendance: async (eventId, userId) => {
    try {
      set(state => ({
        events: state.events.map(event => 
          event.id === eventId 
            ? { ...event, attendees: event.attendees.filter(id => id !== userId) }
            : event
        )
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to cancel attendance" 
      });
    }
  },
  
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newEvent: Event = {
        ...eventData,
        id: (Math.max(...get().events.map(e => parseInt(e.id))) + 1).toString(),
        createdAt: Date.now(),
      };
      
      set(state => ({ 
        events: [...state.events, newEvent],
        isLoading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Failed to create event", 
        isLoading: false 
      });
    }
  },
}));