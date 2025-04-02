import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, TravelerType } from '@/types/travel';

interface ProfileState {
  // User profile
  profile: UserProfile;
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  setTravelerType: (type: TravelerType) => void;
  addInterest: (interest: string) => void;
  removeInterest: (interest: string) => void;
  setBudget: (budget: 'low' | 'medium' | 'high') => void;
  addAccommodation: (accommodation: 'hotel' | 'hostel' | 'apartment' | 'camping') => void;
  removeAccommodation: (accommodation: 'hotel' | 'hostel' | 'apartment' | 'camping') => void;
  addTransportation: (transportation: 'public' | 'rental' | 'taxi' | 'walking') => void;
  removeTransportation: (transportation: 'public' | 'rental' | 'taxi' | 'walking') => void;
  addDietaryRestriction: (restriction: string) => void;
  removeDietaryRestriction: (restriction: string) => void;
  resetProfile: () => void;
  completeProfile: () => void;
}

const defaultProfile: UserProfile = {
  travelerType: 'solo', // Changed from empty string to 'solo' as default
  interests: [],
  budget: 'medium',
  preferredAccommodation: [],
  preferredTransportation: [],
  dietaryRestrictions: [],
  isProfileComplete: false,
  hasSeenOnboarding: false,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      // User profile
      profile: defaultProfile,
      
      // Actions
      updateProfile: (updates) => set({ profile: { ...get().profile, ...updates } }),
      
      setTravelerType: (type) => set({ 
        profile: { ...get().profile, travelerType: type } 
      }),
      
      addInterest: (interest) => {
        const interests = get().profile.interests;
        if (!interests.includes(interest)) {
          set({ 
            profile: { 
              ...get().profile, 
              interests: [...interests, interest] 
            } 
          });
        }
      },
      
      removeInterest: (interest) => {
        set({ 
          profile: { 
            ...get().profile, 
            interests: get().profile.interests.filter(i => i !== interest) 
          } 
        });
      },
      
      setBudget: (budget) => set({ 
        profile: { ...get().profile, budget } 
      }),
      
      addAccommodation: (accommodation) => {
        const accommodations = get().profile.preferredAccommodation;
        if (!accommodations.includes(accommodation)) {
          set({ 
            profile: { 
              ...get().profile, 
              preferredAccommodation: [...accommodations, accommodation] 
            } 
          });
        }
      },
      
      removeAccommodation: (accommodation) => {
        set({ 
          profile: { 
            ...get().profile, 
            preferredAccommodation: get().profile.preferredAccommodation.filter(a => a !== accommodation) 
          } 
        });
      },
      
      addTransportation: (transportation) => {
        const transportations = get().profile.preferredTransportation;
        if (!transportations.includes(transportation)) {
          set({ 
            profile: { 
              ...get().profile, 
              preferredTransportation: [...transportations, transportation] 
            } 
          });
        }
      },
      
      removeTransportation: (transportation) => {
        set({ 
          profile: { 
            ...get().profile, 
            preferredTransportation: get().profile.preferredTransportation.filter(t => t !== transportation) 
          } 
        });
      },
      
      addDietaryRestriction: (restriction) => {
        const restrictions = get().profile.dietaryRestrictions;
        if (!restrictions.includes(restriction)) {
          set({ 
            profile: { 
              ...get().profile, 
              dietaryRestrictions: [...restrictions, restriction] 
            } 
          });
        }
      },
      
      removeDietaryRestriction: (restriction) => {
        set({ 
          profile: { 
            ...get().profile, 
            dietaryRestrictions: get().profile.dietaryRestrictions.filter(r => r !== restriction) 
          } 
        });
      },
      
      resetProfile: () => set({ profile: defaultProfile }),
      
      completeProfile: () => set({ 
        profile: { 
          ...get().profile, 
          isProfileComplete: true,
          hasSeenOnboarding: true,
          // Set defaults if user skipped
          travelerType: get().profile.travelerType || 'solo',
          preferredAccommodation: get().profile.preferredAccommodation.length ? 
            get().profile.preferredAccommodation : ['hotel'],
          preferredTransportation: get().profile.preferredTransportation.length ? 
            get().profile.preferredTransportation : ['public', 'walking']
        } 
      }),
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);