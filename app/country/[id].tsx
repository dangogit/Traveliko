import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  Platform
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Globe, 
  Clock, 
  Heart, 
  Share, 
  Plus,
  Smartphone
} from 'lucide-react-native';
import { Image } from 'expo-image';
import LocationCard from '@/components/LocationCard';
import CountryAppCard from '@/components/CountryAppCard';
import { CountryApp } from '@/types/travel';
import BackButton from '@/components/BackButton';
import HeaderRight from '@/components/HeaderRight';

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getCountryById, 
    getLocationsByCountry, 
    toggleFavorite, 
    isFavorite 
  } = useTravelStore();
  
  const [activeTab, setActiveTab] = useState<'locations' | 'apps'>('locations');
  
  const country = getCountryById(id);
  const locations = getLocationsByCountry(id);
  const isFavorited = isFavorite(id);
  
  // Sample country apps - in a real app, this would come from your data store
  const countryApps: CountryApp[] = country?.recommendedApps || [
    {
      id: '1',
      name: 'Grab',
      category: 'transportation',
      description: 'אפליקציית הזמנת מוניות ומשלוחי אוכל פופולרית בדרום-מזרח אסיה',
      icon: 'https://play-lh.googleusercontent.com/eLqKK4MkDoXXbD_F-P-eSA3RZGcQZCVLYZNPGGfNTVm5MgFBZbubQcwVQNh-FpBuEQ=w240-h480-rw',
      website: 'https://www.grab.com',
      appStoreLink: 'https://apps.apple.com/app/grab-app/id647268330',
      googlePlayLink: 'https://play.google.com/store/apps/details?id=com.grabtaxi.passenger'
    },
    {
      id: '2',
      name: 'Klook',
      category: 'activities',
      description: 'הזמנת פעילויות, אטרקציות וסיורים במחירים מוזלים',
      icon: 'https://play-lh.googleusercontent.com/Zs2dQ5WQbLfZxF65Sd7oZC-hll0NJ0bf-CSvCZK5YBJEpJEjI9Yd_kO0-qk_lZmvYZI=w240-h480-rw',
      website: 'https://www.klook.com',
      appStoreLink: 'https://apps.apple.com/app/klook-travel-activities/id961850126',
      googlePlayLink: 'https://play.google.com/store/apps/details?id=com.klook'
    },
    {
      id: '3',
      name: 'Foodpanda',
      category: 'food',
      description: 'שירות משלוחי מזון פופולרי באסיה',
      icon: 'https://play-lh.googleusercontent.com/VISQ7kJrKPjL9NW5B_kJLOa9JGvFzNQjGZ6DvOLEwIKRUY1xUJl0L9JwtytiP6nH4po=w240-h480-rw',
      website: 'https://www.foodpanda.com',
      appStoreLink: 'https://apps.apple.com/app/foodpanda-food-delivery/id758103884',
      googlePlayLink: 'https://play.google.com/store/apps/details?id=com.global.foodpanda.android'
    }
  ];
  
  const handleToggleFavorite = () => {
    toggleFavorite('country', id);
  };
  
  const handleShare = () => {
    // Share functionality would go here
    console.log('Share country:', country?.nameEn);
  };
  
  const handlePlanTrip = () => {
    router.push('/create-trip/start-point');
  };
  
  if (!country) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: "מדינה לא נמצאה",
          headerLeft: () => <BackButton />,
          headerRight: () => <HeaderRight />
        }} />
        <Text>Country not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: country.nameHe,
        headerLeft: () => <BackButton />,
        headerRight: () => (
          <View style={styles.headerActions}>
            <Pressable onPress={handleToggleFavorite} style={styles.headerButton}>
              <Heart 
                size={24} 
                color={isFavorited ? colors.notification : colors.text} 
                fill={isFavorited ? colors.notification : 'none'} 
              />
            </Pressable>
            <Pressable onPress={handleShare} style={styles.headerButton}>
              <Share size={24} color={colors.text} />
            </Pressable>
            <HeaderRight />
          </View>
        )
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: country.image }} 
          style={styles.coverImage}
          contentFit="cover"
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{country.nameHe}</Text>
          <Text style={styles.subtitle}>{country.nameEn}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Globe size={20} color={colors.primary} />
              <Text style={styles.infoText}>{country.language}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <DollarSign size={20} color={colors.primary} />
              <Text style={styles.infoText}>{country.currency}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={20} color={colors.primary} />
              <Text style={styles.infoText}>{country.timeZone}</Text>
            </View>
          </View>
          
          <View style={styles.seasonContainer}>
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.seasonText}>עונה מומלצת: {country.bestTimeToVisit}</Text>
          </View>
          
          <Text style={styles.description}>{country.description}</Text>
          
          <Pressable style={styles.planTripButton} onPress={handlePlanTrip}>
            <Plus size={20} color="white" />
            <Text style={styles.planTripButtonText}>תכנן טיול</Text>
          </Pressable>
          
          <View style={styles.tabsContainer}>
            <Pressable 
              style={[
                styles.tab, 
                activeTab === 'locations' && styles.activeTab
              ]}
              onPress={() => setActiveTab('locations')}
            >
              <MapPin size={16} color={activeTab === 'locations' ? colors.primary : colors.muted} />
              <Text style={[
                styles.tabText,
                activeTab === 'locations' && styles.activeTabText
              ]}>
                מקומות
              </Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.tab, 
                activeTab === 'apps' && styles.activeTab
              ]}
              onPress={() => setActiveTab('apps')}
            >
              <Smartphone size={16} color={activeTab === 'apps' ? colors.primary : colors.muted} />
              <Text style={[
                styles.tabText,
                activeTab === 'apps' && styles.activeTabText
              ]}>
                אפליקציות מומלצות
              </Text>
            </Pressable>
          </View>
          
          {activeTab === 'locations' && (
            <View style={styles.locationsContainer}>
              <Text style={styles.sectionTitle}>מקומות מומלצים</Text>
              {locations && locations.length > 0 ? (
                locations.map((location) => (
                  <LocationCard key={location.id} location={location} />
                ))
              ) : (
                <Text style={styles.emptyText}>אין מקומות מומלצים</Text>
              )}
            </View>
          )}
          
          {activeTab === 'apps' && (
            <View style={styles.appsContainer}>
              <Text style={styles.sectionTitle}>אפליקציות מומלצות</Text>
              {countryApps.map(app => (
                <CountryAppCard key={app.id} app={app} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 16,
    textAlign: 'right',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    textAlign: 'right',
  },
  seasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  seasonText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    textAlign: 'right',
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'right',
  },
  planTripButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  planTripButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    width: '100%',
    justifyContent: 'flex-end',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.muted,
    marginLeft: 8,
    textAlign: 'right',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  locationsContainer: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'flex-end',
  },
  appsContainer: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'right',
    marginTop: 8,
  }
});