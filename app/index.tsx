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
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
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
            <Pressable style={styles.actionItem} onPress={() => router.push('/trips')}>
              <View style={[styles.actionIcon, {backgroundColor: '#D0F5FD'}]}>
                <CalendarDays size={24} color="#0693E3" />
              </View>
              <Text style={styles.actionText}>טיולים שלי</Text>
            </Pressable>
            
            <Pressable style={styles.actionItem} onPress={() => router.push('/search?filter=countries')}>
              <View style={[styles.actionIcon, {backgroundColor: '#FFF5D0'}]}>
                <Globe size={24} color="#F9A826" />
              </View>
              <Text style={styles.actionText}>מדינות</Text>
            </Pressable>
            
            <Pressable style={styles.actionItem} onPress={() => router.push('/search?filter=regions')}>
              <View style={[styles.actionIcon, {backgroundColor: '#EBFBEE'}]}>
                <Compass size={24} color="#31B057" />
              </View>
              <Text style={styles.actionText}>אזורים</Text>
            </Pressable>
            
            <Pressable style={styles.actionItem} onPress={() => router.push('/transportation')}>
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
              onPress={() => router.push('/search?filter=countries')}
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
                onPress={() => router.push(`/country/${country.id}`)}
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
    opacity: 0.9,
  },
  searchContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  searchBar: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    padding: 0,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  quickActionsContainer: {
    marginTop: -40,
    zIndex: 10,
    marginBottom: 24,
  },
  quickActionsContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 16,
  },
  actionItem: {
    alignItems: 'center',
    width: 80,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '500',
  },
  horizontalScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 16,
  },
  countryCard: {
    width: cardWidth,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  countryImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  countryContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  countryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  locationInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  locationCount: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.9,
  },
  locationIcon: {
    marginRight: 4,
  },
});