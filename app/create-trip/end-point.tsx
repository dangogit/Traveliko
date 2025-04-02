import React, { useState, useCallback, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  Pressable,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import { useTripStore } from '@/store/trip-store';
import colors from '@/constants/colors';
import { Search, Check, ArrowLeft, ArrowRight, MapPin, Calendar, X } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import { Country, TripEndPoint } from '@/types/travel';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@/components/BackButton';
import CountryFlag from '@/components/CountryFlag';
import { countries } from '@/mocks/countries';
import { locations } from '@/mocks/locations';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRecoilState } from 'recoil';
import { tripEndPointState } from '@/store/trip-store';
import { getCountryNameHebrew } from '@/utils/country-utils';

export default function EndPointScreen() {
  const router = useRouter();
  const { countries: travelCountries, getCountryById } = useTravelStore();
  const { setTripEndPoint, tripStartPoint, tripVisitCountries } = useTripStore();
  const [tripEndPoint, setTripEndPointState] = useRecoilState<TripEndPoint>(tripEndPointState);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    tripEndPoint?.countryId ? 
    travelCountries.find(country => country.id === tripEndPoint.countryId) || null : 
    null
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [customCity, setCustomCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date>(
    tripEndPoint?.date ? new Date(tripEndPoint.date) : new Date()
  );
  
  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    return searchQuery.length === 0
      ? travelCountries
      : travelCountries.filter(country => 
          country.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.nameHe.includes(searchQuery)
        );
  }, [searchQuery, travelCountries]);
  
  // Sample cities for the selected country
  const getCitiesForCountry = (countryId: string): string[] => {
    // In a real app, you would fetch this data from an API or database
    const citiesByCountry: Record<string, string[]> = {
      'TH': ['בנגקוק', 'צ\'יאנג מאי', 'פוקט', 'קראבי', 'פאי'],
      'JP': ['טוקיו', 'קיוטו', 'אוסקה', 'הירושימה', 'סאפורו'],
      'VN': ['הא נוי', 'הו צ\'י מין', 'הוי אן', 'דה נאנג', 'נה טראנג'],
      // Add more countries and cities as needed
    };
    
    return citiesByCountry[countryId] || [];
  };
  
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedCity(null);
    setCustomCity('');
  };
  
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCustomCity('');
  };
  
  const handleCustomCityChange = (text: string) => {
    setCustomCity(text);
    setSelectedCity(null);
  };
  
  const handleDateConfirm = (date: Date) => {
    setEndDate(date);
    setShowDatePicker(false);
  };
  
  const handleConfirm = () => {
    if (!selectedCountry) return;
    
    const cityName = selectedCity || customCity || selectedCountry.nameHe;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const endPoint: TripEndPoint = {
        countryId: selectedCountry.id,
        countryName: selectedCountry.nameHe,
        cityName: cityName,
        date: endDate,
      };
      
      setIsRoundTrip(true);
      setTripEndPointState(endPoint);
      setIsLoading(false);
      
      router.push('/create-trip/preferences');
    }, 1000);
  };
  
  const isConfirmDisabled = !selectedCountry || (
    !selectedCity && customCity.trim() === '' && !selectedCountry
  );
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSkip = () => {
    setTripEndPointState(null);
    router.push('/create-trip/preferences');
  };

  // Define steps for the step indicator
  const steps = [
    { id: 1, title: 'נקודת התחלה' },
    { id: 2, title: 'מדינות לביקור' },
    { id: 3, title: 'יעד סיום' },
    { id: 4, title: 'העדפות' },
    { id: 5, title: 'סיכום' }
  ];

  // Get start point details safely
  const startPointCountry = tripStartPoint?.countryId ? getCountryById(tripStartPoint.countryId) : null;
  const startPointCountryName = startPointCountry?.nameHe || '';
  const startPointLocationName = tripStartPoint?.locationId || '';

  // Get visit countries
  const visitCountriesNames = tripVisitCountries?.map(id => {
    const country = getCountryById(id);
    return country?.nameHe || '';
  }).join(', ') || '';

  // Get locations for selected country
  const countryLocations = useMemo(() => {
    if (!selectedCountry) return [];
    return locations.filter(location => location.countryId === selectedCountry.id);
  }, [selectedCountry]);
  
  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('he-IL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <Pressable 
      style={[
        styles.countryCard, 
        selectedCountry?.id === item.id && styles.selectedCard
      ]}
      onPress={() => handleCountrySelect(item)}
    >
      <LinearGradient
        colors={selectedCountry?.id === item.id ? 
          ['rgba(155, 210, 255, 0.2)', 'rgba(120, 190, 255, 0.3)'] : 
          ['rgba(255, 255, 255, 0.7)', 'rgba(245, 245, 245, 0.9)']}
        style={styles.cardGradient}
      />
      
      <View style={styles.countryHeader}>
        <View style={styles.flagContainer}>
          <CountryFlag countryCode={item.id} size={36} />
        </View>
        
        <View style={styles.countryInfo}>
          <Text style={styles.countryNameHe}>{item.nameHe}</Text>
          <Text style={styles.countryName}>{item.name}</Text>
        </View>
      </View>
    </Pressable>
  );
  
  const renderLocationItem = ({ item }: { item: typeof locations[0] }) => (
    <Pressable 
      style={[
        styles.locationCard, 
        selectedCity === item.nameHe && styles.selectedCard
      ]}
      onPress={() => handleCitySelect(item.nameHe)}
    >
      <LinearGradient
        colors={selectedCity === item.nameHe ? 
          ['rgba(155, 210, 255, 0.2)', 'rgba(120, 190, 255, 0.3)'] : 
          ['rgba(255, 255, 255, 0.7)', 'rgba(245, 245, 245, 0.9)']}
        style={styles.cardGradient}
      />
      
      <View style={styles.locationHeader}>
        <View style={styles.locationIconContainer}>
          <MapPin size={20} color={colors.primary} />
        </View>
        
        <View style={styles.locationInfo}>
          <Text style={styles.locationNameHe}>{item.nameHe}</Text>
          <Text style={styles.locationName}>{item.name}</Text>
        </View>
      </View>
    </Pressable>
  );

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (_: any, date?: Date) => {
    if (date) {
      setEndDate(date);
    }
    setShowDatePicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "יעד סיום",
        headerLeft: () => <BackButton />
      }} />
      
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?q=80&w=1000" }} 
        style={styles.backgroundImage} 
        blurRadius={20}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <StepIndicator 
          steps={steps}
          currentStep={3} 
        />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>לאן אתה מתכנן להגיע?</Text>
          
          {tripStartPoint && (
            <View style={styles.startPointInfo}>
              <Text style={styles.startPointLabel}>נקודת התחלה:</Text>
              <Text style={styles.startPointValue}>
                {startPointLocationName || startPointCountryName}
              </Text>
            </View>
          )}
          
          {tripVisitCountries && tripVisitCountries.length > 0 && (
            <View style={styles.startPointInfo}>
              <Text style={styles.startPointLabel}>מדינות לביקור:</Text>
              <Text style={styles.startPointValue}>
                {visitCountriesNames}
              </Text>
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
            />
            {searchQuery !== '' && (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={() => setSearchQuery('')}
              >
                <X size={16} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>
          
          {!selectedCountry ? (
            <View style={styles.countriesList}>
              <Text style={styles.sectionTitle}>בחר מדינה</Text>
              <FlatList
                data={filteredCountries}
                renderItem={renderCountryItem}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.countriesList}
              />
            </View>
          ) : (
            <View style={styles.citySelection}>
              <View style={styles.selectedCountryHeader}>
                <Image
                  source={{ uri: selectedCountry.flagImage || selectedCountry.image }}
                  style={styles.selectedCountryFlag}
                  contentFit="cover"
                />
                <View style={styles.selectedCountryInfo}>
                  <Text style={styles.selectedCountryName}>{selectedCountry.nameHe}</Text>
                  <Pressable onPress={() => setSelectedCountry(null)}>
                    <Text style={styles.changeCountry}>שנה מדינה</Text>
                  </Pressable>
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>בחר עיר</Text>
              
              <View style={styles.citiesList}>
                <FlatList
                  data={countryLocations}
                  renderItem={renderLocationItem}
                  keyExtractor={item => item.id}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.locationsList}
                />
              </View>
              
              <View style={styles.customCityContainer}>
                <Text style={styles.customCityLabel}>או הזן עיר אחרת:</Text>
                <TextInput
                  style={styles.customCityInput}
                  placeholder="שם העיר..."
                  value={customCity}
                  onChangeText={handleCustomCityChange}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>
          )}
        </ScrollView>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>תאריך סיום</Text>
          
          <TouchableOpacity style={styles.dateButton} onPress={toggleDatePicker}>
            <Text style={styles.dateButtonText}>
              {endDate.toLocaleDateString('he-IL')}
            </Text>
            <FontAwesome name="calendar" size={20} color="#333" />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={20} color={colors.primary} />
              <Text style={styles.backButtonText}>חזור</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.confirmButton, isConfirmDisabled && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={isConfirmDisabled || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>המשך</Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </Pressable>
          </View>
          
          {!isRoundTrip && (
            <Pressable style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>דלג (טיול חד כיווני)</Text>
            </Pressable>
          )}
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
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  startPointInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  startPointLabel: {
    fontSize: 14,
    color: colors.muted,
    marginRight: 8,
  },
  startPointValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: colors.text,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  countriesList: {
    marginBottom: 16,
  },
  countryCard: {
    width: 150,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  countryHeader: {
    padding: 16,
    alignItems: 'center',
  },
  flagContainer: {
    marginBottom: 10,
  },
  countryInfo: {
    alignItems: 'center',
  },
  countryNameHe: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  countryName: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  citySelection: {
    marginBottom: 16,
  },
  selectedCountryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedCountryFlag: {
    width: 48,
    height: 36,
    borderRadius: 4,
    marginLeft: 12,
  },
  selectedCountryInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  selectedCountryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  changeCountry: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'right',
  },
  citiesList: {
    marginBottom: 16,
  },
  locationCard: {
    width: 150,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  locationHeader: {
    padding: 16,
    alignItems: 'center',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  locationInfo: {
    alignItems: 'center',
  },
  locationNameHe: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  locationName: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  customCityContainer: {
    marginTop: 8,
  },
  customCityLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  customCityInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text,
    textAlign: 'right',
  },
  footer: {
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: colors.card,
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
  confirmButton: {
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
    backgroundColor: colors.muted,
  },
  confirmButtonText: {
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
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  clearButton: {
    padding: 8,
  },
  locationsList: {
    paddingVertical: 8,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});