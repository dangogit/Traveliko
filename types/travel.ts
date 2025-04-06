export interface Region {
  id: string;
  nameEn: string;
  nameHe: string;
  description: string;
  image: string;
  featured?: boolean; // Added this property
}

export interface Country {
  id: string;
  regionId: string;
  nameEn: string;
  nameHe: string;
  description: string;
  image: string;
  currency: string;
  language: string;
  timeZone: string;
  capital: string;
  popular?: boolean; // Added this property
  name?: string; // Compatibility property
  flagImage?: string; // Compatibility property
}

export interface Location {
  id: string;
  countryId: string;
  nameEn: string;
  nameHe: string;
  description: string;
  image: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  recommended?: boolean; // Added this property
  name?: string; // Compatibility property
}

export interface Recommendation {
  id: string;
  locationId: string;
  type: 'hotel' | 'hostel' | 'activity' | 'restaurant';
  nameEn: string;
  nameHe: string;
  description: string;
  image: string;
  price: {
    amount: number;
    currency: string;
  };
  rating: number;
  address: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  suitableFor?: TravelerType[];
  bestSeason?: Season[];
}

export type TravelerType = 'solo' | 'couple' | 'family' | 'friends' | 'business';
export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface UserFavorite {
  id: string;
  type: 'country' | 'location' | 'recommendation';
  itemId: string;
}

export interface UserHistory {
  id: string;
  type: 'country' | 'location' | 'recommendation';
  itemId: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

// Trip planning types
export interface TripEndPoint {
  countryId: string;
  countryName: string;
  cityName: string;
  date: string | Date;
  dateUnknown?: boolean;
  locationId?: string;
  name?: string; // Display name
}