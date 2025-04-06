import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  Pressable,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Search, Check, ArrowRight, ArrowLeft, Plus, X, Globe, Calendar, Minus } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import BackButton from '@/components/BackButton';
import { Image } from 'expo-image';
import { Country } from '@/types/travel';
import { LinearGradient } from 'expo-linear-gradient';
import CountryFlag from '@/components/CountryFlag';

export default function VisitCountriesScreen() {
  const router = useRouter();
  const { countries, getCountryById } = useTravelStore();
  const { tripStartPoint, setTripVisitCountries, tripVisitCountries, setDaysPerCountry: setStoreDaysPerCountry, daysPerCountry: daysPerCountryFromStore } = useTripStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [continentFilter, setContinentFilter] = useState<string | null>(null);
  const [daysPerCountry, setDaysPerCountry] = useState<Record<string, number>>({});
  
  // Initialize selected countries from tripVisitCountries
  useEffect(() => {
    if (tripVisitCountries && tripVisitCountries.length > 0) {
      const selectedCountryObjects = tripVisitCountries
        .map(id => countries.find(c => c.id === id))
        .filter(country => country !== undefined) as Country[];
      
      setSelectedCountries(selectedCountryObjects);
      
      // Initialize days per country from store or with default values
      const initialDaysPerCountry: Record<string, number> = {};
      tripVisitCountries.forEach((countryId, index) => {
        initialDaysPerCountry[countryId] = daysPerCountryFromStore && daysPerCountryFromStore[countryId] 
          ? daysPerCountryFromStore[countryId] 
          : 5; // Default to 5 days instead of 1
      });
      
      setDaysPerCountry(initialDaysPerCountry);
    }
    
    // Auto-set the filter to the start country's region if available
    if (tripStartPoint?.countryId) {
      const startCountry = countries.find(c => c.id === tripStartPoint.countryId);
      if (startCountry) {
        setContinentFilter(startCountry.regionId);
      }
    }
  }, [tripVisitCountries, countries, tripStartPoint, daysPerCountryFromStore]);
  
  // Region translation mapping
  const regionTranslations: Record<string, string> = {
    'East Asia': 'מזרח אסיה',
    'South East Asia': 'דרום מזרח אסיה',
    'South Asia': 'דרום אסיה',
    'Middle East': 'המזרח התיכון',
    'Eastern Europe': 'מזרח אירופה',
    'Western Europe': 'מערב אירופה',
    'Northern Europe': 'צפון אירופה',
    'Southern Europe': 'דרום אירופה',
    'North America': 'צפון אמריקה',
    'Central America': 'מרכז אמריקה',
    'South America': 'דרום אמריקה',
    'Oceania': 'אוקיאניה',
    'Africa': 'אפריקה',
    'Caribbean': 'האיים הקריביים'
    // Add other regions as needed
  };

  // Translate region name to Hebrew
  const translateRegion = (regionId: string): string => {
    return regionTranslations[regionId] || regionId;
  };
  
  // Get unique continents for filtering
  const continents = Array.from(new Set(countries.map(country => country.regionId))).sort();
  
  // Get the start country's region
  const startCountryRegion = tripStartPoint?.countryId 
    ? countries.find(c => c.id === tripStartPoint.countryId)?.regionId 
    : null;
  
  // Filter and sort countries based on search query, continent filter, and region priority
  const filteredCountries = countries
    .filter(country => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        country.nameHe.includes(searchQuery) || 
        country.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by continent
      const matchesContinent = continentFilter === null || country.regionId === continentFilter;
      
      // Filter out start country
      const isNotStartCountry = tripStartPoint ? country.id !== tripStartPoint.countryId : true;
      
      return matchesSearch && matchesContinent && isNotStartCountry;
    })
    .sort((a, b) => {
      // First prioritize by same region as start country
      const aIsSameRegion = a.regionId === startCountryRegion;
      const bIsSameRegion = b.regionId === startCountryRegion;
      
      if (aIsSameRegion && !bIsSameRegion) return -1;
      if (!aIsSameRegion && bIsSameRegion) return 1;
      
      // Then sort by popular
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      
      // Then alphabetically
      return a.nameHe.localeCompare(b.nameHe);
    });
  
  // Group countries by region for display
  const countryGroups = filteredCountries.reduce<Record<string, Country[]>>((groups, country) => {
    const regionId = country.regionId;
    if (!groups[regionId]) {
      groups[regionId] = [];
    }
    groups[regionId].push(country);
    return groups;
  }, {});
  
  // Order the region groups - start country's region first
  const orderedRegions = Object.keys(countryGroups).sort((a, b) => {
    if (a === startCountryRegion) return -1;
    if (b === startCountryRegion) return 1;
    return a.localeCompare(b);
  });
  
  const steps = [
    { id: 1, title: "נקודת התחלה" },
    { id: 2, title: "מדינות לביקור" },
    { id: 3, title: "נקודת סיום" },
    { id: 4, title: "העדפות" },
    { id: 5, title: "סיכום" }
  ];
  
  const handleCountryToggle = (country: Country) => {
    if (selectedCountries.some(c => c.id === country.id)) {
      setSelectedCountries(selectedCountries.filter(c => c.id !== country.id));
      
      // Remove days count for this country
      const newDaysPerCountry = { ...daysPerCountry };
      delete newDaysPerCountry[country.id];
      setDaysPerCountry(newDaysPerCountry);
    } else {
      setSelectedCountries([...selectedCountries, country]);
      
      // Add default days for this country (5 days instead of 1)
      setDaysPerCountry({ 
        ...daysPerCountry, 
        [country.id]: 5 
      });
    }
  };
  
  // Add function to change days count
  const changeDaysCount = (countryId: string, increment: boolean) => {
    const currentDays = daysPerCountry[countryId] || 1;
    const newDays = increment ? currentDays + 1 : Math.max(1, currentDays - 1);
    setDaysPerCountry({ ...daysPerCountry, [countryId]: newDays });
  };
  
  const handleNext = () => {
    try {
      // Save selected countries
      const countryIds = selectedCountries.map(c => c.id);
      setTripVisitCountries(countryIds);
      
      // Save days per country
      setStoreDaysPerCountry(daysPerCountry);
      
      // Navigate to end point screen
      router.push('/create-trip/end-point');
    } catch (error) {
      console.error('Error saving visit countries:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בשמירת המדינות. אנא נסה שנית.');
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSkip = () => {
    // Clear any previously selected countries
    setTripVisitCountries([]);
    
    // Navigate to end point screen
    router.push('/create-trip/end-point');
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setContinentFilter(null);
  };

  // Check if start point is set
  if (!tripStartPoint) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Stack.Screen options={{ 
          title: "שגיאה",
          headerLeft: () => <BackButton />
        }} />
        
        <View style={styles.errorContent}>
          <Text style={styles.errorTitle}>אופס! משהו השתבש</Text>
          <Text style={styles.errorMessage}>נקודת התחלה לא הוגדרה. אנא חזור לשלב הקודם.</Text>
          
          <Pressable style={styles.startOverButton} onPress={() => router.replace('/create-trip')}>
            <Text style={styles.startOverButtonText}>התחל מחדש</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "מדינות לביקור",
        headerLeft: () => <BackButton />
      }} />
      
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1496161446026-a535a789705f?q=80&w=1000" }} 
        style={styles.backgroundImage} 
        blurRadius={20}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <StepIndicator steps={steps} currentStep={2} />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <Text style={styles.title}>באילו מדינות תרצה לבקר?</Text>
          <Text style={styles.subtitle}>בחר מדינות שתרצה לבקר בהן במהלך הטיול</Text>
          
          {selectedCountries.length > 0 && (
            <View style={styles.selectedCountriesContainer}>
              <Text style={styles.sectionTitle}>מדינות שנבחרו ({selectedCountries.length})</Text>
              <FlatList
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.selectedCountriesScroll}
                data={selectedCountries}
                keyExtractor={country => country.id}
                renderItem={({ item }) => (
                  <View style={styles.selectedCountryContainer}>
                    <Pressable 
                      key={item.id} 
                      style={styles.selectedCountryChip}
                      onPress={() => handleCountryToggle(item)}
                    >
                      <CountryFlag 
                        countryCode={item.id} 
                        size={20}
                        style={styles.chipFlag}
                      />
                      <Text style={styles.chipText}>{item.nameHe}</Text>
                      <X size={16} color={colors.text} />
                    </Pressable>
                    
                    <View style={styles.daysControlsSmall}>
                      <TouchableOpacity 
                        style={styles.daysButtonSmall}
                        onPress={() => changeDaysCount(item.id, false)}
                      >
                        <Minus size={12} color={colors.primary} />
                      </TouchableOpacity>
                      
                      <Text style={styles.daysCountSmall}>{daysPerCountry[item.id] || 1} ימים</Text>
                      
                      <TouchableOpacity 
                        style={styles.daysButtonSmall}
                        onPress={() => changeDaysCount(item.id, true)}
                      >
                        <Plus size={12} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
          
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.muted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="חפש מדינה..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.muted}
              textAlign="right"
            />
            {searchQuery !== '' && (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClearSearch}
              >
                <X size={16} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Continent Filter */}
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={[styles.filterChip, continentFilter === null && styles.activeFilterChip]} 
                onPress={() => setContinentFilter(null)}
              >
                <Globe size={16} color={continentFilter === null ? 'white' : colors.primary} />
                <Text style={[styles.filterChipText, continentFilter === null && styles.activeFilterChipText]}>הכל</Text>
              </TouchableOpacity>
              
              {continents.map(continent => (
                <TouchableOpacity 
                  key={continent}
                  style={[styles.filterChip, continentFilter === continent && styles.activeFilterChip]} 
                  onPress={() => setContinentFilter(continent)}
                >
                  <Text style={[styles.filterChipText, continentFilter === continent && styles.activeFilterChipText]}>
                    {translateRegion(continent)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {(searchQuery || continentFilter) && (
              <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>נקה סינון</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Countries list - grouped by region */}
          <View style={styles.countriesList}>
            {orderedRegions.map(regionId => (
              <View key={regionId} style={styles.regionSection}>
                <Text style={styles.regionTitle}>
                  {translateRegion(regionId)} 
                  {regionId === startCountryRegion && (
                    <Text style={styles.startCountryRegionIndicator}> (אזור מדינת המוצא)</Text>
                  )}
                </Text>
                
                <FlatList
                  data={countryGroups[regionId]}
                  renderItem={({ item }) => (
                    <Pressable
                      key={item.id}
                      style={[
                        styles.countryCard, 
                        selectedCountries.some(c => c.id === item.id) && styles.selectedCard
                      ]}
                      onPress={() => handleCountryToggle(item)}
                    >
                      <Image 
                        source={{ uri: `https://source.unsplash.com/300x200/?${encodeURIComponent(item.nameEn)},landmark,travel` }} 
                        style={styles.countryImage}
                        contentFit="cover"
                        transition={300}
                        placeholder={{
                          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300"
                        }}
                      />
                      <LinearGradient
                        colors={
                          selectedCountries.some(c => c.id === item.id)
                            ? ['rgba(0, 0, 0, 0.6)', 'rgba(0, 60, 120, 0.7)']
                            : ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.5)']
                        }
                        style={styles.cardGradient}
                      />
                      
                      <View style={styles.countryHeader}>
                        <View style={styles.flagContainer}>
                          <CountryFlag countryCode={item.id} size={36} />
                        </View>
                        
                        <View style={styles.countryInfo}>
                          <Text style={[styles.countryNameHe, { color: 'white' }]}>{item.nameHe}</Text>
                          <Text style={[styles.countryName, { color: 'rgba(255,255,255,0.8)' }]}>{item.nameEn}</Text>
                          {selectedCountries.some(c => c.id === item.id) && (
                            <View style={styles.selectedBadge}>
                              <Check size={16} color="white" />
                            </View>
                          )}
                        </View>
                      </View>
                      
                      {/* Add days selector for selected countries */}
                      {selectedCountries.some(c => c.id === item.id) && (
                        <View style={styles.daysSelector}>
                          <View style={styles.daysSelectorHeader}>
                            <Calendar size={16} color="white" />
                            <Text style={styles.daysSelectorLabel}>מספר ימים:</Text>
                          </View>
                          
                          <View style={styles.daysControls}>
                            <TouchableOpacity 
                              style={styles.daysButton}
                              onPress={() => changeDaysCount(item.id, false)}
                            >
                              <Minus size={16} color="white" />
                            </TouchableOpacity>
                            
                            <Text style={styles.daysCount}>{daysPerCountry[item.id] || 1}</Text>
                            
                            <TouchableOpacity 
                              style={styles.daysButton}
                              onPress={() => changeDaysCount(item.id, true)}
                            >
                              <Plus size={16} color="white" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </Pressable>
                  )}
                  keyExtractor={item => item.id}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.regionCountriesList}
                />
              </View>
            ))}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={20} color={colors.primary} />
              <Text style={styles.backButtonText}>חזור</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.nextButton, selectedCountries.length === 0 && styles.disabledButton]}
              onPress={handleNext}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>המשך</Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </Pressable>
          </View>
          
          <Pressable style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>דלג (ללא מדינות נוספות)</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
    alignSelf: 'flex-end',
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    padding: 8,
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 16,
    textAlign: 'right',
    position: 'relative',
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 114, 178, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 114, 178, 0.2)',
  },
  infoIcon: {
    marginLeft: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  countriesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  countryCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: colors.card,
    position: 'relative',
  },
  countryCardGradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  countrySelectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 114, 178, 0.3)',
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 16,
  },
  countryCardImage: {
    ...StyleSheet.absoluteFillObject,
  },
  countryHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flagContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  selectedCheckmark: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  countryInfo: {
    marginTop: 'auto',
    padding: 12,
    zIndex: 1,
  },
  countryNameHe: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  countryName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  countryDaysContainer: {
    marginTop: 8,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-end',
  },
  daysControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  daysButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  daysText: {
    fontSize: 14,
    color: 'white',
    marginHorizontal: 6,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  selectionSummary: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectionSummaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonGradientSecondary: {
    flex: 1,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 24,
    textAlign: 'center',
  },
  startOverButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  startOverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 12,
  },
  daysSelector: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  daysSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  daysSelectorLabel: {
    fontSize: 14,
    color: 'white',
    marginRight: 8,
  },
  daysControlsSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  daysButtonSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  daysCountSmall: {
    fontSize: 12,
    color: colors.text,
    marginHorizontal: 8,
    minWidth: 30,
    textAlign: 'center',
    textShadowRadius: 1,
  },
  filterContainer: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  activeFilterChipText: {
    color: 'white',
  },
  clearFiltersButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginTop: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  countriesList: {
    marginBottom: 16,
  },
  regionSection: {
    marginBottom: 24,
  },
  regionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  startCountryRegionIndicator: {
    fontWeight: 'normal',
    fontSize: 14,
    color: colors.primary,
  },
  regionCountriesList: {
    paddingVertical: 12,
    paddingBottom: 16,
  },
  countryImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
  },
  footer: {
    marginTop: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 114, 178, 0.5)',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  selectedCountriesContainer: {
    marginBottom: 16,
  },
  selectedCountriesScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  selectedCountryContainer: {
    marginRight: 8,
    alignItems: 'center',
  },
  selectedCountryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  chipFlag: {
    width: 20,
    height: 15,
    borderRadius: 2,
    marginRight: 6,
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 16,
    textAlign: 'right',
  },
  daysCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
});