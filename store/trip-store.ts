import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { atom } from 'recoil';
import { Trip, TripDay, TripActivity, TravelerType, AccommodationType, TransportationType, ActivityType, TripStartPoint, TripEndPoint, TripPreferences } from '@/types/travel';

// Recoil states for trip planning
export const tripEndPointState = atom<TripEndPoint | null>({
  key: 'tripEndPointState',
  default: null,
});

interface TripPlan {
  name: string;
  startDate: string;
  endDate: string;
  countries: string[];
  days: {
    date: string;
    locationId: string;
    notes?: string;
  }[];
  activities: {
    tripDayIndex: number;
    type: ActivityType;
    name: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
  }[];
  accommodations: {
    tripDayIndex: number;
    name: string;
    type: AccommodationType;
    price: string;
    bookingUrl?: string;
  }[];
  transportation: {
    fromDayIndex: number;
    toDayIndex: number;
    type: string;
    name: string;
    price: string;
    bookingUrl?: string;
  }[];
  locations: string[];
  budget?: number;
  description?: string;
}

interface TripState {
  // Trip data
  trips: Trip[];
  tripDays: TripDay[];
  tripActivities: TripActivity[];
  
  // Trip planning state
  tripStartPoint: TripStartPoint | null;
  tripEndPoint: TripEndPoint | null;
  tripPreferences: TripPreferences | null;
  tripPlan: TripPlan | null;
  tripVisitCountries: string[] | null;
  
  // UI state
  selectedTripId: string | null;
  
  // Trip planning actions
  setTripStartPoint: (startPoint: TripStartPoint) => void;
  setTripEndPoint: (endPoint: TripEndPoint | null) => void;
  setTripPreferences: (preferences: TripPreferences) => void;
  setTripVisitCountries: (countryIds: string[]) => void;
  generateTripPlan: () => void;
  resetTripPlanning: () => void;
  
  // Trip actions
  createTrip: (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'> | TripPlan) => string;
  updateTrip: (id: string, updates: Partial<Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTrip: (id: string) => void;
  
  createTripDay: (tripDay: Omit<TripDay, 'id'>) => string;
  updateTripDay: (id: string, updates: Partial<Omit<TripDay, 'id'>>) => void;
  deleteTripDay: (id: string) => void;
  
  createTripActivity: (activity: Omit<TripActivity, 'id'>) => string;
  updateTripActivity: (id: string, updates: Partial<Omit<TripActivity, 'id'>>) => void;
  deleteTripActivity: (id: string) => void;
  toggleActivityCompletion: (id: string) => void;
  
  setSelectedTripId: (id: string | null) => void;
  
  // Trip planning getters
  getTripStartPoint: () => TripStartPoint;
  getTripEndPoint: () => TripEndPoint | null;
  getTripPreferences: () => TripPreferences;
  getTripPlan: () => TripPlan | null;
  
  // Trip getters
  getAllTrips: () => Trip[];
  getTripById: (id: string) => Trip | undefined;
  getTripDaysByTripId: (tripId: string) => TripDay[];
  getTripActivitiesByDayId: (dayId: string) => TripActivity[];
  getUpcomingTrips: () => Trip[];
  getPastTrips: () => Trip[];
  getCurrentTrip: () => Trip | undefined;
  
  // Reset function
  resetTrips: () => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      // Trip data
      trips: [],
      tripDays: [],
      tripActivities: [],
      
      // Trip planning state
      tripStartPoint: null,
      tripEndPoint: null,
      tripPreferences: null,
      tripPlan: null,
      tripVisitCountries: null,
      
      // UI state
      selectedTripId: null,
      
      // Trip planning actions
      setTripStartPoint: (startPoint) => {
        set({ tripStartPoint: startPoint });
      },
      
      setTripEndPoint: (endPoint) => {
        set({ tripEndPoint: endPoint });
      },
      
      setTripPreferences: (preferences) => {
        set({ tripPreferences: preferences });
      },
      
      setTripVisitCountries: (countryIds) => {
        set({ tripVisitCountries: countryIds });
      },
      
      resetTripPlanning: () => {
        set({
          tripStartPoint: null,
          tripEndPoint: null,
          tripPreferences: null,
          tripPlan: null,
          tripVisitCountries: null
        });
      },
      
      generateTripPlan: () => {
        const { tripStartPoint, tripEndPoint, tripPreferences, tripVisitCountries } = get();
        
        if (!tripStartPoint || !tripPreferences) {
          console.error('Missing required trip planning data');
          return;
        }
        
        // Generate a trip plan based on the user's preferences
        // This is a simplified example - in a real app, this would be more complex
        const startDate = new Date(tripStartPoint.date);
        const endDate = tripEndPoint ? new Date(tripEndPoint.date || startDate) : new Date(startDate);
        
        if (tripEndPoint && tripEndPoint.date) {
          endDate.setTime(new Date(tripEndPoint.date).getTime());
        } else {
          // If no end point, set end date to 7 days after start date
          endDate.setDate(startDate.getDate() + 7);
        }
        
        // Calculate number of days
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Generate days
        const days = [];
        const locations = [tripStartPoint.countryId];
        
        // Add visit countries to locations
        if (tripVisitCountries && tripVisitCountries.length > 0) {
          tripVisitCountries.forEach(countryId => {
            if (!locations.includes(countryId)) {
              locations.push(countryId);
            }
          });
        }
        
        if (tripEndPoint && !locations.includes(tripEndPoint.countryId)) {
          locations.push(tripEndPoint.countryId);
        }
        
        // Distribute countries across days
        const totalCountries = locations.length;
        const daysPerCountry = Math.floor(diffDays / totalCountries);
        let remainingDays = diffDays % totalCountries;
        
        let currentDay = 0;
        for (let i = 0; i < totalCountries; i++) {
          const countryId = locations[i];
          let countryDays = daysPerCountry;
          
          // Distribute remaining days
          if (remainingDays > 0) {
            countryDays++;
            remainingDays--;
          }
          
          for (let j = 0; j < countryDays; j++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + currentDay);
            
            days.push({
              date: currentDate.toISOString().split('T')[0],
              locationId: countryId,
              notes: ''
            });
            
            currentDay++;
          }
        }
        
        // Generate activities (simplified)
        const activities = [];
        for (let i = 0; i < diffDays; i++) {
          // Morning activity
          activities.push({
            tripDayIndex: i,
            type: 'activity' as ActivityType,
            name: 'סיור בוקר',
            startTime: '09:00',
            endTime: '12:00'
          });
          
          // Lunch
          activities.push({
            tripDayIndex: i,
            type: 'restaurant' as ActivityType,
            name: 'ארוחת צהריים',
            startTime: '12:30',
            endTime: '14:00'
          });
          
          // Afternoon activity
          activities.push({
            tripDayIndex: i,
            type: 'activity' as ActivityType,
            name: 'פעילות אחר הצהריים',
            startTime: '14:30',
            endTime: '17:30'
          });
        }
        
        // Generate accommodations
        const accommodations = [];
        for (let i = 0; i < diffDays; i++) {
          accommodations.push({
            tripDayIndex: i,
            name: `לינה ליום ${i + 1}`,
            type: tripPreferences.accommodation[0],
            price: tripPreferences.budget === 'low' ? '$50-100' : 
                  tripPreferences.budget === 'medium' ? '$100-200' : '$200+',
            bookingUrl: 'https://www.booking.com'
          });
        }
        
        // Generate transportation between locations
        const transportation = [];
        if (locations.length > 1) {
          let currentCountryIndex = 0;
          for (let i = 1; i < locations.length; i++) {
            const fromCountry = locations[i-1];
            const toCountry = locations[i];
            
            // Find the day index for this transportation
            const fromDayIndex = days.findIndex((day, idx) => 
              day.locationId === fromCountry && 
              (idx === days.length - 1 || days[idx + 1].locationId === toCountry)
            );
            
            if (fromDayIndex !== -1) {
              transportation.push({
                fromDayIndex: fromDayIndex,
                toDayIndex: fromDayIndex + 1,
                type: tripPreferences.transportation[0],
                name: `נסיעה מ${fromCountry} ל${toCountry}`,
                price: tripPreferences.budget === 'low' ? '$20-50' : 
                      tripPreferences.budget === 'medium' ? '$50-100' : '$100+',
                bookingUrl: 'https://www.skyscanner.com'
              });
            }
            
            currentCountryIndex++;
          }
        }
        
        const tripPlan: TripPlan = {
          name: `טיול ל${locations.map(id => id).join(', ')}`,
          startDate: tripStartPoint.date,
          endDate: endDate.toISOString().split('T')[0],
          countries: [...new Set(locations)],
          days,
          activities,
          accommodations,
          transportation,
          locations: [...new Set(locations)],
          budget: tripPreferences.budget === 'low' ? 1000 : 
                 tripPreferences.budget === 'medium' ? 2000 : 3000,
          description: `טיול מותאם אישית ל${tripPreferences.travelerType === 'solo' ? 'מטייל בודד' : 
                        tripPreferences.travelerType === 'couple' ? 'זוג' : 
                        tripPreferences.travelerType === 'family' ? 'משפחה' : 
                        tripPreferences.travelerType === 'friends' ? 'חברים' : 'עסקים'}`
        };
        
        set({ tripPlan });
      },
      
      // Trip actions
      createTrip: (tripData) => {
        const id = Date.now().toString();
        const now = Date.now();
        
        let newTrip: Trip;
        
        if ('days' in tripData) {
          // Convert TripPlan to Trip
          const tripPlan = tripData as TripPlan;
          
          newTrip = {
            id,
            name: tripPlan.name,
            startDate: tripPlan.startDate,
            endDate: tripPlan.endDate,
            countries: tripPlan.countries,
            description: tripPlan.description,
            budget: tripPlan.budget,
            createdAt: now,
            updatedAt: now
          };
          
          // Create trip days and activities
          const tripDays: TripDay[] = [];
          const tripActivities: TripActivity[] = [];
          
          // Create days
          tripPlan.days.forEach((day, index) => {
            const dayId = `${id}-day-${index}`;
            
            tripDays.push({
              id: dayId,
              tripId: id,
              date: day.date,
              locationId: day.locationId,
              notes: day.notes
            });
            
            // Create activities for this day
            const dayActivities = tripPlan.activities.filter(a => a.tripDayIndex === index);
            dayActivities.forEach((activity, actIndex) => {
              tripActivities.push({
                id: `${dayId}-activity-${actIndex}`,
                tripDayId: dayId,
                type: activity.type,
                name: activity.name,
                startTime: activity.startTime,
                endTime: activity.endTime,
                notes: activity.notes,
                isCompleted: false
              });
            });
            
            // Add accommodation as an activity
            const accommodation = tripPlan.accommodations.find(a => a.tripDayIndex === index);
            if (accommodation) {
              tripActivities.push({
                id: `${dayId}-accommodation`,
                tripDayId: dayId,
                type: accommodation.type as ActivityType,
                name: accommodation.name,
                notes: `מחיר: ${accommodation.price}${accommodation.bookingUrl ? `
הזמנה: ${accommodation.bookingUrl}` : ''}`,
                isCompleted: false
              });
            }
          });
          
          // Add transportation activities
          tripPlan.transportation.forEach((transport, index) => {
            const fromDayId = tripDays[transport.fromDayIndex].id;
            
            tripActivities.push({
              id: `${id}-transport-${index}`,
              tripDayId: fromDayId,
              type: 'transportation',
              name: transport.name,
              notes: `סוג: ${transport.type}
מחיר: ${transport.price}${transport.bookingUrl ? `
הזמנה: ${transport.bookingUrl}` : ''}`,
              isCompleted: false
            });
          });
          
          // Update state with new trip, days, and activities
          set(state => ({
            trips: [...state.trips, newTrip],
            tripDays: [...state.tripDays, ...tripDays],
            tripActivities: [...state.tripActivities, ...tripActivities],
            selectedTripId: id,
            // Reset planning state
            tripStartPoint: null,
            tripEndPoint: null,
            tripPreferences: null,
            tripPlan: null,
            tripVisitCountries: null
          }));
        } else {
          // Regular trip creation
          newTrip = {
            id,
            ...tripData as Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>,
            createdAt: now,
            updatedAt: now
          };
          
          set(state => ({
            trips: [...state.trips, newTrip],
            selectedTripId: id
          }));
        }
        
        return id;
      },
      
      updateTrip: (id, updates) => {
        set(state => ({
          trips: state.trips.map(trip => 
            trip.id === id 
              ? { ...trip, ...updates, updatedAt: Date.now() } 
              : trip
          )
        }));
      },
      
      deleteTrip: (id) => {
        // Delete trip and all related days and activities
        const tripDaysToDelete = get().tripDays.filter(day => day.tripId === id);
        const dayIdsToDelete = tripDaysToDelete.map(day => day.id);
        
        set(state => ({
          trips: state.trips.filter(trip => trip.id !== id),
          tripDays: state.tripDays.filter(day => day.tripId !== id),
          tripActivities: state.tripActivities.filter(activity => 
            !dayIdsToDelete.includes(activity.tripDayId)
          ),
          selectedTripId: state.selectedTripId === id ? null : state.selectedTripId
        }));
      },
      
      createTripDay: (tripDayData) => {
        const id = Date.now().toString();
        
        const newTripDay: TripDay = {
          id,
          ...tripDayData
        };
        
        set(state => ({
          tripDays: [...state.tripDays, newTripDay]
        }));
        
        return id;
      },
      
      updateTripDay: (id, updates) => {
        set(state => ({
          tripDays: state.tripDays.map(day => 
            day.id === id 
              ? { ...day, ...updates } 
              : day
          )
        }));
      },
      
      deleteTripDay: (id) => {
        set(state => ({
          tripDays: state.tripDays.filter(day => day.id !== id),
          tripActivities: state.tripActivities.filter(activity => activity.tripDayId !== id)
        }));
      },
      
      createTripActivity: (activityData) => {
        const id = Date.now().toString();
        
        const newActivity: TripActivity = {
          id,
          ...activityData
        };
        
        set(state => ({
          tripActivities: [...state.tripActivities, newActivity]
        }));
        
        return id;
      },
      
      updateTripActivity: (id, updates) => {
        set(state => ({
          tripActivities: state.tripActivities.map(activity => 
            activity.id === id 
              ? { ...activity, ...updates } 
              : activity
          )
        }));
      },
      
      deleteTripActivity: (id) => {
        set(state => ({
          tripActivities: state.tripActivities.filter(activity => activity.id !== id)
        }));
      },
      
      toggleActivityCompletion: (id) => {
        set(state => ({
          tripActivities: state.tripActivities.map(activity => 
            activity.id === id 
              ? { ...activity, isCompleted: !activity.isCompleted } 
              : activity
          )
        }));
      },
      
      setSelectedTripId: (id) => {
        set({ selectedTripId: id });
      },
      
      // Trip planning getters
      getTripStartPoint: () => {
        const { tripStartPoint } = get();
        if (!tripStartPoint) {
          throw new Error('Trip start point not set');
        }
        return tripStartPoint;
      },
      
      getTripEndPoint: () => {
        return get().tripEndPoint;
      },
      
      getTripPreferences: () => {
        const { tripPreferences } = get();
        if (!tripPreferences) {
          throw new Error('Trip preferences not set');
        }
        return tripPreferences;
      },
      
      getTripPlan: () => {
        return get().tripPlan;
      },
      
      // Trip getters
      getAllTrips: () => {
        return get().trips;
      },
      
      getTripById: (id) => {
        return get().trips.find(trip => trip.id === id);
      },
      
      getTripDaysByTripId: (tripId) => {
        return get().tripDays
          .filter(day => day.tripId === tripId)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
      
      getTripActivitiesByDayId: (dayId) => {
        return get().tripActivities.filter(activity => activity.tripDayId === dayId);
      },
      
      getUpcomingTrips: () => {
        const now = new Date();
        return get().trips
          .filter(trip => new Date(trip.startDate) > now)
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      },
      
      getPastTrips: () => {
        const now = new Date();
        return get().trips
          .filter(trip => new Date(trip.endDate) < now)
          .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
      },
      
      getCurrentTrip: () => {
        const now = new Date();
        return get().trips.find(trip => 
          new Date(trip.startDate) <= now && new Date(trip.endDate) >= now
        );
      },
      
      // Reset function
      resetTrips: () => {
        set({
          trips: [],
          tripDays: [],
          tripActivities: [],
          selectedTripId: null
        });
      }
    }),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        trips: state.trips,
        tripDays: state.tripDays,
        tripActivities: state.tripActivities,
        selectedTripId: state.selectedTripId
      })
    }
  )
);