import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  Dimensions,
  StatusBar,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import { useProfileStore } from '@/store/profile-store';
import colors from '@/constants/colors';
import { Image } from 'expo-image';
import { 
  MapPin, 
  Search, 
  Globe, 
  Compass, 
  PlaneTakeoff,
  Bed,
  Camera
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.65;

// Mock data for location counts
const getLocationCount = (countryId: string) => {
  const mockCounts: Record<string, number> = {
    'italy': 15,
    'spain': 12,
    'france': 18,
    'japan': 14,
    'thailand': 10,
    'india': 22,
    'usa': 25,
    'mexico': 8,
    'canada': 12,
    'brazil': 11,
    'argentina': 9,
    'australia': 13,
    'new_zealand': 7,
    'egypt': 8,
    'morocco': 6,
    'south_africa': 9,
  };
  
  return mockCounts[countryId] || Math.floor(Math.random() * 15) + 5; // 5-20 random locations if not found
};

export default function HomeScreen() {
  const router = useRouter();
  const { 
    getPopularCountries
  } = useTravelStore();
  const { profile } = useProfileStore();
  const [searchQuery, setSearchQuery] = useState('');

  const popularCountries = getPopularCountries();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search',
        params: { query: searchQuery }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />
          
          <View style={styles.heroContent}>
            <Text style={styles.welcomeText}>שלום, {profile.firstName || 'אורח'}!</Text>
            <Text style={styles.heroTitle}>גלה את העולם</Text>
            <Text style={styles.heroSubtitle}>צור חוויות שלא תשכח לעולם</Text>
            
            <View style={styles.searchContainer}>
              <BlurView intensity={30} style={styles.searchBar}>
                <View style={styles.searchInputContainer}>
                  <Search size={20} color="rgba(255,255,255,0.8)" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="לאן תרצה לטייל?"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    textAlign="right"
                    textAlignVertical="center"
                  />
                </View>
              </BlurView>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContent}
          >
            <Pressable 
              style={styles.actionItem} 
              onPress={() => {
                console.log("Navigating to transportation");
                router.push("/transportation");
              }}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#F5E1FF'}]}>
                <PlaneTakeoff size={24} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>תחבורה</Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionItem} 
              onPress={() => {
                console.log("Navigating to dedicated regions search");
                router.push("/regions-search");
              }}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#EBFBEE'}]}>
                <Compass size={24} color="#31B057" />
              </View>
              <Text style={styles.actionText}>אזורים</Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionItem} 
              onPress={() => {
                console.log("Navigating to dedicated accommodations search");
                router.push("/accommodations-search");
              }}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#D0F5FD'}]}>
                <Bed size={24} color="#0693E3" />
              </View>
              <Text style={styles.actionText}>לינה</Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionItem} 
              onPress={() => {
                console.log("Navigating to dedicated attractions search");
                router.push("/attractions-search");
              }}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#FFF5D0'}]}>
                <Camera size={24} color="#F9A826" />
              </View>
              <Text style={styles.actionText}>אטרקציות</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Popular Countries */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Pressable 
              style={styles.seeAllButton}
              onPress={() => {
                console.log("Navigating to all countries");
                router.push("/search?filter=countries");
              }}
            >
              <Text style={styles.seeAllText}>הכל</Text>
            </Pressable>
            <Text style={styles.sectionTitle}>מדינות פופולריות</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
            decelerationRate="fast"
            snapToInterval={cardWidth + 16}
            snapToAlignment="center"
          >
            {popularCountries.map(country => (
              <Pressable 
                key={country.id}
                style={styles.countryCard}
                onPress={() => {
                  console.log(`Navigating to country: ${country.id}`);
                  router.push(`/country/${country.id}`);
                }}
              >
                <Image
                  source={{ uri: country.image }}
                  style={styles.countryImage}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.cardGradient}
                />
                <View style={styles.countryContent}>
                  <Text style={styles.countryName}>{country.nameHe}</Text>
                  <View style={styles.locationInfo}>
                    <MapPin size={14} color="white" style={styles.locationIcon} />
                    <Text style={styles.locationCount}>{getLocationCount(country.id)} מקומות</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
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
  scrollContent: {
    paddingBottom: 32,
  },
  heroContainer: {
    height: 380,
    position: 'relative',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 6,
    fontFamily: 'System',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textAlign: 'right',
    fontFamily: 'System',
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 20,
    textAlign: 'right',
    fontFamily: 'System',
  },
  searchContainer: {
    width: '100%',
    marginTop: 12,
  },
  searchBar: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  searchInputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    height: '100%',
  },
  quickActionsContainer: {
    marginTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  quickActionsContent: {
    paddingHorizontal: 0,
    gap: 10,
  },
  actionItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    width: 85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.text,
  },
  seeAllButton: {},
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  countryCard: {
    width: cardWidth,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    display: 'none',
  },
  countryContent: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'flex-end',
  },
  countryName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  locationInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  locationIcon: {
    marginLeft: 4,
  },
  locationCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
}); 