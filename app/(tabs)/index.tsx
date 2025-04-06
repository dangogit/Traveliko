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
import colors from '@/constants/colors';
import { Image } from 'expo-image';
import { 
  MapPin, 
  Search, 
  Globe, 
  Compass, 
  PlaneTakeoff,
  CalendarDays 
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.7;

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
            <Text style={styles.welcomeText}>שלום!</Text>
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
                console.log("Navigating to trips");
                router.push("/trips");
              }}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#D0F5FD'}]}>
                <CalendarDays size={24} color="#0693E3" />
              </View>
              <Text style={styles.actionText}>טיולים שלי</Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionItem} 
              onPress={() => {
                console.log("Navigating to countries search");
                router.push("/search?filter=countries");
              }}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#FFF5D0'}]}>
                <Globe size={24} color="#F9A826" />
              </View>
              <Text style={styles.actionText}>מדינות</Text>
            </Pressable>
            
            <Pressable 
              style={styles.actionItem} 
              onPress={() => {
                console.log("Navigating to regions search");
                router.push("/search?filter=regions");
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
                console.log("Navigating to transportation");
                router.push("/transportation");
              }}
            >
              <View style={[styles.actionIcon, {backgroundColor: '#F5E1FF'}]}>
                <PlaneTakeoff size={24} color="#9C27B0" />
              </View>
              <Text style={styles.actionText}>תחבורה</Text>
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
    height: 480,
    position: 'relative',
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
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'flex-end', // Align content to the right for RTL
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontFamily: 'System', // Choose appropriate Hebrew font if needed
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'right',
    fontFamily: 'System', // Choose appropriate Hebrew font if needed
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 24,
    textAlign: 'right',
    fontFamily: 'System', // Choose appropriate Hebrew font if needed
  },
  searchContainer: {
    width: '100%',
    marginTop: 16, // Added margin top for better spacing
  },
  searchBar: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row-reverse', // Adjusted for RTL
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    marginLeft: 8, // Adjusted margin for RTL
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    height: '100%', // Ensure input fills height
  },
  quickActionsContainer: {
    marginTop: -40, // Pull actions up over the hero image slightly
    paddingBottom: 24,
  },
  quickActionsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  actionItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    width: 90, // Fixed width for consistency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row-reverse', // Adjusted for RTL
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllButton: {},
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  horizontalScrollContent: {
    paddingRight: 16, // Add padding to the start (right in RTL)
    gap: 16,
  },
  countryCard: {
    width: cardWidth,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  countryImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  countryContent: {
    position: 'absolute',
    bottom: 12,
    right: 12, // Adjusted for RTL
    left: 12,
    alignItems: 'flex-end', // Align text to the right
  },
  countryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  locationInfo: {
    flexDirection: 'row-reverse', // Adjusted for RTL
    alignItems: 'center',
  },
  locationIcon: {
    marginLeft: 4, // Adjusted margin for RTL
  },
  locationCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
}); 