import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { regions } from '@/mocks/regions';
import { countries } from '@/mocks/countries';
import { locations } from '@/mocks/locations';
import { recommendations } from '@/mocks/recommendations';
import { accommodations } from '@/mocks/accommodations';
import { ChatMessage, UserFavorite, UserHistory, TravelerType, Season, Country, Location, Recommendation } from '@/types/travel';

interface Accommodation extends Recommendation {
  countryId?: string; 
}

interface TravelState {
  // Data
  regions: typeof regions;
  countries: typeof countries;
  locations: typeof locations;
  recommendations: typeof recommendations;
  accommodations: Accommodation[];
  
  // User data
  favorites: UserFavorite[];
  history: UserHistory[];
  chatMessages: ChatMessage[];
  
  // UI state
  selectedRegionId: string | null;
  selectedCountryId: string | null;
  selectedLocationId: string | null;
  searchQuery: string;
  
  // Actions
  setSelectedRegionId: (id: string | null) => void;
  setSelectedCountryId: (id: string | null) => void;
  setSelectedLocationId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  addFavorite: (type: 'country' | 'location' | 'recommendation' | 'accommodation', itemId: string) => void;
  removeFavorite: (itemId: string) => void;
  isFavorite: (itemId: string) => boolean;
  toggleFavorite: (type: 'country' | 'location' | 'recommendation' | 'accommodation', itemId: string) => void;
  
  addToHistory: (type: 'country' | 'location' | 'recommendation' | 'accommodation', itemId: string) => void;
  clearHistory: () => void;
  
  addChatMessage: (text: string, isUser: boolean) => void;
  clearChatMessages: () => void;
  
  // Getters
  getRegionById: (id: string) => (typeof regions)[0] | undefined;
  getCountryById: (id: string) => (typeof countries)[0] | undefined;
  getLocationById: (id: string) => (typeof locations)[0] | undefined;
  getRecommendationById: (id: string) => (typeof recommendations)[0] | undefined;
  getAccommodationById: (id: string) => Accommodation | undefined;
  
  getCountriesByRegion: (regionId: string) => (typeof countries);
  getLocationsByCountry: (countryId: string) => (typeof locations);
  getLocationsByCountryId: (countryId: string) => (typeof locations);
  getRecommendationsByLocation: (
    locationId: string, 
    type?: 'hotel' | 'hostel' | 'activity' | 'restaurant',
    travelerType?: TravelerType,
    season?: Season
  ) => (typeof recommendations);
  getAccommodationsByCountry: (countryId: string) => Accommodation[];
  
  // Added selector functions
  getFeaturedRegions: () => (typeof regions);
  getPopularCountries: () => (typeof countries);
  getRecommendedLocations: () => (typeof locations);
  
  // Search functions
  searchRegions: (query: string) => (typeof regions);
  searchCountries: (query: string) => (typeof countries);
  searchLocations: (query: string) => (typeof locations);
  searchRecommendations: (query: string) => (typeof recommendations);
  searchAccommodations: (query: string) => Accommodation[];
  
  searchAll: (query: string) => {
    regions: (typeof regions);
    countries: (typeof countries);
    locations: (typeof locations);
    recommendations: (typeof recommendations);
    accommodations: Accommodation[];
  };
  
  // Getters for favorites (declare them here)
  getFavoriteCountries: () => Country[];
  getFavoriteLocations: () => Location[];
  getFavoriteRecommendations: () => Recommendation[];
  getFavoriteAccommodations: () => Accommodation[];
  
  // Reset function
  resetFavorites: () => void;
}

export const useTravelStore = create<TravelState>()(
  persist(
    (set, get) => ({
      // Data
      regions,
      countries,
      locations,
      recommendations,
      accommodations,
      
      // User data
      favorites: [],
      history: [],
      chatMessages: [],
      
      // UI state
      selectedRegionId: null,
      selectedCountryId: null,
      selectedLocationId: null,
      searchQuery: '',
      
      // Actions
      setSelectedRegionId: (id) => set({ selectedRegionId: id }),
      setSelectedCountryId: (id) => set({ selectedCountryId: id }),
      setSelectedLocationId: (id) => set({ selectedLocationId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      addFavorite: (type, itemId) => {
        const favorites = get().favorites;
        if (!favorites.some(fav => fav.itemId === itemId)) {
          set({ 
            favorites: [...favorites, { 
              id: Date.now().toString(), 
              type, 
              itemId 
            }] 
          });
        }
      },
      
      removeFavorite: (itemId) => {
        set({ 
          favorites: get().favorites.filter(fav => fav.itemId !== itemId) 
        });
      },
      
      isFavorite: (itemId) => {
        return get().favorites.some(fav => fav.itemId === itemId);
      },
      
      toggleFavorite: (type, itemId) => {
        if (get().isFavorite(itemId)) {
          get().removeFavorite(itemId);
        } else {
          get().addFavorite(type, itemId);
        }
      },
      
      addToHistory: (type, itemId) => {
        const history = get().history;
        // Remove if exists to avoid duplicates
        const filteredHistory = history.filter(item => !(item.itemId === itemId && item.type === type));
        
        set({ 
          history: [
            { 
              id: Date.now().toString(), 
              type, 
              itemId,
              timestamp: Date.now()
            },
            ...filteredHistory
          ].slice(0, 50) // Keep only last 50 items
        });
      },
      
      clearHistory: () => set({ history: [] }),
      
      addChatMessage: (text, isUser) => {
        set({ 
          chatMessages: [
            ...get().chatMessages,
            {
              id: Date.now().toString(),
              text,
              isUser,
              timestamp: Date.now()
            }
          ]
        });
      },
      
      clearChatMessages: () => set({ chatMessages: [] }),
      
      // Getters
      getRegionById: (id) => get().regions.find(region => region.id === id),
      getCountryById: (id) => get().countries.find(country => country.id === id),
      getLocationById: (id) => get().locations.find(location => location.id === id),
      getRecommendationById: (id) => get().recommendations.find(rec => rec.id === id),
      getAccommodationById: (id) => get().accommodations.find(acc => acc.id === id),
      
      // Add implementations for favorite getters
      getFavoriteCountries: () => {
        const favoriteIds = get().favorites
          .filter(fav => fav.type === 'country')
          .map(fav => fav.itemId);
        return get().countries.filter(country => favoriteIds.includes(country.id));
      },
      
      getFavoriteLocations: () => {
        const favoriteIds = get().favorites
          .filter(fav => fav.type === 'location')
          .map(fav => fav.itemId);
        return get().locations.filter(location => favoriteIds.includes(location.id));
      },
      
      getFavoriteRecommendations: () => {
        const favoriteIds = get().favorites
          .filter(fav => fav.type === 'recommendation')
          .map(fav => fav.itemId);
        return get().recommendations.filter(rec => favoriteIds.includes(rec.id));
      },

      getFavoriteAccommodations: () => {
        const favoriteIds = get().favorites
          .filter(fav => fav.type === 'accommodation')
          .map(fav => fav.itemId);
        return get().accommodations.filter(acc => favoriteIds.includes(acc.id));
      },

      getCountriesByRegion: (regionId) => 
        get().countries.filter(country => country.regionId === regionId),
      
      getLocationsByCountry: (countryId) => 
        get().locations.filter(location => location.countryId === countryId),
      
      getLocationsByCountryId: (countryId) => 
        get().locations.filter(location => location.countryId === countryId),
        
      getRecommendationsByLocation: (locationId, type, travelerType, season) => {
        let recs = get().recommendations.filter(rec => rec.locationId === locationId);
        
        if (type) {
          recs = recs.filter(rec => rec.type === type);
        }
        
        if (travelerType) {
          // If recommendation has suitableFor property, filter by it
          // Otherwise include all recommendations
          recs = recs.filter(rec => 
            !rec.suitableFor || 
            rec.suitableFor.includes(travelerType)
          );
        }
        
        if (season) {
          // If recommendation has bestSeason property, filter by it
          // Otherwise include all recommendations
          recs = recs.filter(rec => 
            !rec.bestSeason || 
            rec.bestSeason.includes(season)
          );
        }
        
        return recs;
      },
      
      getAccommodationsByCountry: (countryId) => {
        return get().accommodations.filter(acc => acc.countryId === countryId);
      },
      
      // Added selector functions
      getFeaturedRegions: () => {
        // Return regions marked as featured, or first 5 if none are marked
        const featured = get().regions.filter(region => region.featured);
        return featured.length > 0 ? featured : get().regions.slice(0, 5);
      },
      
      getPopularCountries: () => {
        // Return countries marked as popular, or first 5 if none are marked
        const popular = get().countries.filter(country => country.popular);
        return popular.length > 0 ? popular : get().countries.slice(0, 5);
      },
      
      getRecommendedLocations: () => {
        // Return locations marked as recommended, or first 6 if none are marked
        const recommended = get().locations.filter(location => location.recommended);
        return recommended.length > 0 ? recommended : get().locations.slice(0, 6);
      },
      
      // Search functions
      searchRegions: (query) => {
        if (!query) return get().regions;
        const lowerQuery = query.toLowerCase();
        return get().regions.filter(region => 
          region.nameHe.includes(query) || 
          region.nameEn.toLowerCase().includes(lowerQuery) ||
          region.description.includes(query)
        );
      },
      
      searchCountries: (query) => {
        if (!query) return get().countries;
        const lowerQuery = query.toLowerCase();
        return get().countries.filter(country => 
          country.nameHe.includes(query) || 
          country.nameEn.toLowerCase().includes(lowerQuery) ||
          country.description.includes(query)
        );
      },
      
      searchLocations: (query) => {
        if (!query) return get().locations;
        const lowerQuery = query.toLowerCase();
        return get().locations.filter(location => 
          location.nameHe.includes(query) || 
          location.nameEn.toLowerCase().includes(lowerQuery) ||
          location.description.includes(query)
        );
      },
      
      searchRecommendations: (query) => {
        if (!query) return get().recommendations;
        const lowerQuery = query.toLowerCase();
        return get().recommendations.filter(rec => 
          rec.nameHe.includes(query) || 
          rec.nameEn.toLowerCase().includes(lowerQuery) ||
          rec.description.includes(query)
        );
      },

      searchAccommodations: (query) => {
        if (!query) return get().accommodations;
        const lowerQuery = query.toLowerCase();
        return get().accommodations.filter(acc => 
          (acc.nameHe && acc.nameHe.includes(query)) || 
          (acc.nameEn && acc.nameEn.toLowerCase().includes(lowerQuery)) ||
          (acc.description && acc.description.includes(query))
        );
      },
      
      searchAll: (query) => {
        const lowerQuery = query.toLowerCase();
        
        return {
          regions: get().regions.filter(region => 
            region.nameHe.includes(query) || 
            region.nameEn.toLowerCase().includes(lowerQuery) ||
            region.description.includes(query)
          ),
          countries: get().countries.filter(country => 
            country.nameHe.includes(query) || 
            country.nameEn.toLowerCase().includes(lowerQuery) ||
            country.description.includes(query)
          ),
          locations: get().locations.filter(location => 
            location.nameHe.includes(query) || 
            location.nameEn.toLowerCase().includes(lowerQuery) ||
            location.description.includes(query)
          ),
          recommendations: get().recommendations.filter(rec => 
            rec.nameHe.includes(query) || 
            rec.nameEn.toLowerCase().includes(lowerQuery) ||
            rec.description.includes(query)
          ),
          accommodations: get().accommodations.filter(acc => 
            (acc.nameHe && acc.nameHe.includes(query)) || 
            (acc.nameEn && acc.nameEn.toLowerCase().includes(lowerQuery)) ||
            (acc.description && acc.description.includes(query))
          ),
        };
      },
      
      // Reset function
      resetFavorites: () => {
        set({
          favorites: [],
          history: []
        });
      }
    }),
    {
      name: 'travel-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        history: state.history,
        chatMessages: state.chatMessages
      })
    }
  )
);