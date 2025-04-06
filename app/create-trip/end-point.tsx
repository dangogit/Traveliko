import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  Alert,
  Platform,
  Modal
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import { useTripStore } from '@/store/trip-store';
import colors from '@/constants/colors';
import { Search, Check, ArrowLeft, ArrowRight, MapPin, Calendar, X, ChevronDown, Minus, Plus } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import { Country, TripEndPoint } from '@/types/travel';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '@/components/BackButton';
import CountryFlag from '@/components/CountryFlag';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function EndPointScreen() {
  const router = useRouter();
  const { countries, getCountryById } = useTravelStore();
  const { setTripEndPoint, tripStartPoint, tripVisitCountries, getTripEndPoint, daysPerCountry: daysPerCountryFromStore } = useTripStore();
  
  // Parse start date from tripStartPoint to use for validation - wrap in useMemo to prevent re-creation on each render
  const startDate = useMemo(() => 
    tripStartPoint?.date ? new Date(tripStartPoint.date) : new Date(),
  [tripStartPoint?.date]);
  
  // Get trip duration from start point if available
  const startPointDuration = useMemo(() => 
    tripStartPoint?.tripDuration || 7,
  [tripStartPoint?.tripDuration]);
  
  // Calculate total days allocated to visit countries plus start point
  const totalDaysBeforeEndPoint = useMemo(() => {
    // Get days from start point
    const startPointDays = tripStartPoint?.tripDuration || 5;
    
    // Get days from visit countries
    const visitCountriesDays = !tripVisitCountries || !daysPerCountryFromStore 
      ? 0 
      : tripVisitCountries.reduce((total, countryId) => {
          return total + (daysPerCountryFromStore[countryId] || 5);
        }, 0);
    
    return startPointDays + visitCountriesDays;
  }, [tripVisitCountries, daysPerCountryFromStore, tripStartPoint]);
  
  // Calculate a suggested end date based on start date and days from all previous points
  const suggestedEndDate = useMemo(() => {
    const suggestedDate = new Date(startDate);
    // Add all days before end point (start point + visit countries)
    suggestedDate.setDate(suggestedDate.getDate() + totalDaysBeforeEndPoint);
    return suggestedDate;
  }, [startDate, totalDaysBeforeEndPoint]);
  
  // Calculate default end point days - we'll start with a default of 5 days at the end point
  const defaultEndPointDays = 5;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [endDate, setEndDate] = useState<Date>(suggestedEndDate);
  const [endPointDays, setEndPointDays] = useState(defaultEndPointDays);
  const [unknownReturnDate, setUnknownReturnDate] = useState(false);
  const [calendarError, setCalendarError] = useState(false);
  const [isEditingDays, setIsEditingDays] = useState(false); // To track whether user is adjusting days or date
  
  // Calculate total trip duration - all points
  const totalTripDuration = useMemo(() => {
    if (unknownReturnDate || !endDate) return totalDaysBeforeEndPoint + defaultEndPointDays;
    
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [endDate, startDate, unknownReturnDate, totalDaysBeforeEndPoint, defaultEndPointDays]);
  
  // Initialize from existing trip end point data if available
  useEffect(() => {
    const currentEndPoint = getTripEndPoint();
    if (currentEndPoint) {
      // Set selected country
      if (currentEndPoint.countryId) {
        const country = countries.find(c => c.id === currentEndPoint.countryId);
        if (country) {
          setSelectedCountry(country);
        }
      }
      
      // Set unknown date flag
      if (currentEndPoint.dateUnknown) {
        setUnknownReturnDate(true);
      } else {
        setUnknownReturnDate(false);
        
        // Set date if not unknown
        if (currentEndPoint.date) {
          const parsedDate = new Date(currentEndPoint.date);
          // Ensure the end date is never before the start date
          if (parsedDate > startDate) {
            setEndDate(parsedDate);
            
            // Calculate end point days based on this date
            const diffTime = Math.abs(parsedDate.getTime() - suggestedEndDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setEndPointDays(Math.max(diffDays, 1));
          } else {
            setEndDate(suggestedEndDate);
            setEndPointDays(defaultEndPointDays);
          }
        }
      }
    } else {
      // No existing end point, use suggested values
      setEndDate(suggestedEndDate);
      setEndPointDays(defaultEndPointDays);
    }
  }, [countries, getTripEndPoint, suggestedEndDate, startDate, defaultEndPointDays]);
  
  // Update end date when end point days change (if user is editing days)
  useEffect(() => {
    if (isEditingDays && !unknownReturnDate) {
      const newEndDate = new Date(suggestedEndDate);
      newEndDate.setDate(newEndDate.getDate() + endPointDays);
      setEndDate(newEndDate);
    }
  }, [endPointDays, suggestedEndDate, isEditingDays, unknownReturnDate]);
  
  // Update end point days when end date changes (if user is editing date directly)
  useEffect(() => {
    if (!isEditingDays && !unknownReturnDate && endDate) {
      const visitEndDate = new Date(suggestedEndDate);
      const diffTime = Math.abs(endDate.getTime() - visitEndDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setEndPointDays(Math.max(diffDays, 0));
    }
  }, [endDate, suggestedEndDate, isEditingDays, unknownReturnDate]);
  
  // Change end point days directly
  const changeEndPointDays = (increment: boolean) => {
    setIsEditingDays(true);
    if (increment) {
      setEndPointDays(prev => prev + 1);
    } else {
      setEndPointDays(prev => Math.max(0, prev - 1));
    }
  };
  
  // Handle date selection from date picker
  const handleDateConfirm = (date: Date) => {
    setIsEditingDays(false); // User is directly picking a date
    
    // Ensure the selected date is after the suggested end date (visit countries)
    if (date >= suggestedEndDate) {
      setEndDate(date);
    } else {
      Alert.alert(
        'תאריך לא חוקי',
        'תאריך סיום חייב להיות אחרי תאריך סיום המדינות לביקור',
        [{ text: 'הבנתי', style: 'default' }]
      );
      setEndDate(suggestedEndDate);
    }
    setShowDatePicker(false);
  };
  
  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    return searchQuery.length === 0
      ? countries
      : countries.filter(country => 
          country.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.nameHe.includes(searchQuery)
        );
  }, [searchQuery, countries]);
  
  // Sort countries to prioritize start country's region and then popular countries
  const sortedAndFilteredCountries = useMemo(() => {
    const startCountry = tripStartPoint?.countryId ? countries.find(c => c.id === tripStartPoint.countryId) : null;
    
    const filtered = [...filteredCountries].sort((a, b) => {
      // First, prioritize countries in the same region as start country
      if (startCountry) {
        const aInSameRegion = a.regionId === startCountry.regionId;
        const bInSameRegion = b.regionId === startCountry.regionId;
        
        if (aInSameRegion && !bInSameRegion) return -1;
        if (!aInSameRegion && bInSameRegion) return 1;
      }
      
      // Then, prioritize popular countries
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      
      // Then sort alphabetically by Hebrew name
      return a.nameHe.localeCompare(b.nameHe);
    });
    
    return filtered;
  }, [filteredCountries, tripStartPoint, countries]);
  
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };
  
  const handlePressDateButton = () => {
    setShowDatePicker(true);
  };
  
  const handleConfirm = () => {
    if (!selectedCountry) {
      Alert.alert('שגיאה', 'יש לבחור מדינת יעד');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create end point object
      const endPoint: TripEndPoint = {
        countryId: selectedCountry.id,
        countryName: selectedCountry.nameHe,
        cityName: selectedCountry.nameHe,
        date: unknownReturnDate ? '' : format(endDate, 'yyyy-MM-dd'),
        dateUnknown: unknownReturnDate,
        dayCount: endPointDays // Add days count to the end point data
      };
      
      // First, set the trip end point
      setTripEndPoint(endPoint);
      
      // Then use requestAnimationFrame to ensure state updates complete before navigation
      requestAnimationFrame(() => {
        setIsLoading(false);
        router.push('/create-trip/preferences');
      });
    } catch (error) {
      console.error('Error saving end point:', error);
      setIsLoading(false);
      Alert.alert('שגיאה', 'אירעה שגיאה בשמירת נקודת הסיום. אנא נסה שנית.');
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleSkip = () => {
    // Clear end point data
    setTripEndPoint(null);
    
    // Use requestAnimationFrame to ensure state updates complete before navigation
    requestAnimationFrame(() => {
      router.push('/create-trip/preferences');
    });
  };

  const toggleUnknownReturnDate = () => {
    setUnknownReturnDate(!unknownReturnDate);
  };

  // Reset calendar error state when showing/hiding calendar
  useEffect(() => {
    setCalendarError(false);
  }, [showDatePicker]);

  // Handle potential errors with the DateTimePicker
  const handleCalendarError = () => {
    setCalendarError(true);
    setShowDatePicker(false);
  };

  // Define steps for the step indicator
  const steps = [
    { id: 1, title: 'נקודת התחלה' },
    { id: 2, title: 'מדינות לביקור' },
    { id: 3, title: 'יעד סיום' },
    { id: 4, title: 'העדפות' },
    { id: 5, title: 'סיכום' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "יעד סיום",
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
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <StepIndicator steps={steps} currentStep={3} />
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>תאריך סיום</Text>
            
            <View style={styles.tripInfoContainer}>
              <Text style={styles.tripInfoTitle}>מסלול הטיול</Text>
              
              {/* Start point */}
              <View style={styles.tripPointRow}>
                <View style={styles.tripPointIconContainer}>
                  <Text style={styles.tripPointNumber}>1</Text>
                </View>
                <View style={styles.tripPointDetails}>
                  <Text style={styles.tripPointTitle}>נקודת התחלה: {tripStartPoint?.countryName || 'לא נבחר'}</Text>
                  <Text style={styles.tripPointSubtitle}>
                    {tripStartPoint?.date ? format(new Date(tripStartPoint.date), 'dd/MM/yyyy', { locale: he }) : ''} 
                    ({tripStartPoint?.tripDuration || 5} ימים)
                  </Text>
                </View>
              </View>
              
              {/* Visit countries */}
              {tripVisitCountries && tripVisitCountries.length > 0 && (
                <View style={styles.tripPointRow}>
                  <View style={styles.tripPointIconContainer}>
                    <Text style={styles.tripPointNumber}>2</Text>
                  </View>
                  <View style={styles.tripPointDetails}>
                    <Text style={styles.tripPointTitle}>מדינות לביקור: {tripVisitCountries.length} מדינות</Text>
                    <Text style={styles.tripPointSubtitle}>
                      סך הכל: {!tripVisitCountries || !daysPerCountryFromStore 
                        ? 0 
                        : tripVisitCountries.reduce((total, countryId) => {
                            return total + (daysPerCountryFromStore[countryId] || 5);
                          }, 0)} ימים
                    </Text>
                  </View>
                </View>
              )}
              
              {/* End point */}
              <View style={styles.tripPointRow}>
                <View style={styles.tripPointIconContainer}>
                  <Text style={styles.tripPointNumber}>3</Text>
                </View>
                <View style={styles.tripPointDetails}>
                  <Text style={styles.tripPointTitle}>נקודת סיום: {selectedCountry?.nameHe || 'טרם נבחר'}</Text>
                  <Text style={styles.tripPointSubtitle}>
                    {!unknownReturnDate && endDate ? format(endDate, 'dd/MM/yyyy', { locale: he }) : 'תאריך לא ידוע'} 
                    ({endPointDays} ימים)
                  </Text>
                </View>
              </View>
              
              {/* Total trip duration */}
              <View style={styles.tripTotalContainer}>
                <Text style={styles.tripTotalLabel}>סך הכל משך הטיול:</Text>
                <Text style={styles.tripTotalValue}>{totalTripDuration} ימים</Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.dateButtonContainer}
              onPress={handlePressDateButton}
              activeOpacity={0.8}
              disabled={unknownReturnDate}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(240,242,250,0.95)']}
                style={[styles.dateGradient, unknownReturnDate && styles.disabledDateGradient]}
              >
                <View style={styles.dateButtonContent}>
                  <Calendar size={24} color={unknownReturnDate ? colors.muted : colors.primary} style={styles.dateIcon} />
                  <Text style={[styles.dateText, unknownReturnDate && styles.disabledDateText]}>
                    {unknownReturnDate ? 'תאריך סיום לא ידוע' : 
                     endDate ? format(endDate, 'dd/MM/yyyy', { locale: he }) : 'בחר תאריך סיום'}
                  </Text>
                  <View style={styles.dateChevronContainer}>
                    <ChevronDown size={18} color={unknownReturnDate ? colors.muted : colors.primary} />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.unknownDateContainer}
              onPress={toggleUnknownReturnDate}
            >
              <View style={[styles.checkbox, unknownReturnDate && styles.checkboxChecked]}>
                {unknownReturnDate && <Check size={16} color="white" />}
              </View>
              <Text style={styles.unknownDateText}>תאריך חזרה לא ידוע</Text>
            </TouchableOpacity>
            
            {Platform.OS === 'web' && showDatePicker && (
              <View style={styles.webCalendarContainer}>
                <Calendar 
                  onChange={handleDateConfirm} 
                  value={endDate || suggestedEndDate}
                  minDate={startDate}
                  locale="he"
                  onClickDay={(value) => {
                    setShowDatePicker(false);
                    handleDateConfirm(value);
                  }}
                />
              </View>
            )}
            
            {Platform.OS === 'android' && showDatePicker && (
              <DateTimePicker
                value={endDate || suggestedEndDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    handleDateConfirm(selectedDate);
                  }
                }}
                minimumDate={startDate}
              />
            )}
            
            {Platform.OS === 'ios' && (
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={handleDateConfirm}
                onCancel={() => setShowDatePicker(false)}
                minimumDate={startDate}
                locale="he"
                confirmTextIOS="אישור"
                cancelTextIOS="ביטול"
                display="inline"
                buttonTextColorIOS={colors.primary}
              />
            )}
            
            {calendarError && (
              <TouchableOpacity 
                style={styles.fallbackDateButton}
                onPress={() => {
                  setCalendarError(false);
                  setShowDatePicker(true);
                }}
              >
                <Text style={styles.fallbackDateButtonText}>נתקלנו בבעיה? נסה שוב או הזן תאריך ידנית</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>מדינת סיום</Text>
            
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="חיפוש מדינה..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.muted}
                textAlign="right"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearchQuery('')}>
                  <X size={18} color={colors.muted} />
                </TouchableOpacity>
              )}
              <Search size={22} color={colors.muted} style={styles.searchIcon} />
            </View>
            
            <FlatList
              data={sortedAndFilteredCountries}
              renderItem={({ item }) => (
                <Pressable 
                  style={[
                    styles.countryCard, 
                    selectedCountry?.id === item.id && styles.selectedCard
                  ]}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Image 
                    source={{ uri: `https://source.unsplash.com/300x200/?${encodeURIComponent(item.nameEn)},landmark,travel,city` }} 
                    style={styles.countryImage}
                    contentFit="cover"
                    transition={300}
                    placeholder={Platform.select({
                      web: undefined,
                      default: {
                        uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300"
                      }
                    })}
                  />
                  <LinearGradient
                    colors={selectedCountry?.id === item.id ? 
                      ['rgba(0, 0, 0, 0.6)', 'rgba(0, 60, 120, 0.7)'] : 
                      item.regionId === selectedCountry?.regionId ?
                      ['rgba(0, 0, 0, 0.4)', 'rgba(0, 90, 120, 0.6)'] :
                      ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.5)']}
                    style={styles.cardGradient}
                  />
                  
                  <View style={styles.countryHeader}>
                    <View style={styles.flagContainer}>
                      <CountryFlag countryCode={item.id} size={36} />
                    </View>
                    
                    <View style={styles.countryInfo}>
                      <Text style={[styles.countryNameHe, { color: 'white' }]}>{item.nameHe}</Text>
                      <Text style={[styles.countryName, { color: 'rgba(255,255,255,0.8)' }]}>{item.nameEn}</Text>
                      {selectedCountry?.id === item.id && (
                        <View style={styles.selectedBadge}>
                          <Check size={16} color="white" />
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              )}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.countriesList}
              initialNumToRender={5}
              windowSize={3}
              getItemLayout={(data, index) => ({
                length: 172, // Width of card (160) + margin (12)
                offset: 172 * index,
                index,
              })}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Pressable 
              style={styles.button} 
              onPress={handleConfirm}
              disabled={!selectedCountry || isLoading}
            >
              <LinearGradient
                colors={[colors.primary, '#006199']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <ArrowRight size={20} color="white" style={{marginLeft: 8}} />
                    <Text style={styles.buttonTextPrimary}>המשך</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
            
            <Pressable 
              style={styles.button} 
              onPress={handleBack}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(245,245,250,0.95)']}
                style={styles.buttonGradientSecondary}
              >
                <ArrowLeft size={20} color={colors.primary} style={{marginLeft: 8}} />
                <Text style={styles.buttonTextSecondary}>חזור</Text>
              </LinearGradient>
            </Pressable>
          </View>
          
          {selectedCountry && (
            <TouchableOpacity 
              style={styles.changeSelectionButton} 
              onPress={() => setSelectedCountry(null)}
            >
              <Text style={styles.changeSelectionText}>שנה בחירה</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>דלג על נקודת סיום (חזרה למדינת המוצא)</Text>
          </TouchableOpacity>
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
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 32,
  },
  sectionContainer: {
    marginBottom: 28,
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
  tripInfoContainer: {
    backgroundColor: 'rgba(0, 114, 178, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 114, 178, 0.2)',
  },
  tripInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  tripPointRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripPointIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  tripPointNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tripPointDetails: {
    flex: 1,
  },
  tripPointTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  tripPointSubtitle: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  tripTotalContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 114, 178, 0.2)',
  },
  tripTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  tripTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  durationContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  durationLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  durationValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    minWidth: 40,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  disabledDateGradient: {
    opacity: 0.6,
  },
  disabledDateText: {
    color: colors.muted,
  },
  webCalendarContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dateButtonContainer: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  dateButtonContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  dateIcon: {
    marginLeft: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  dateChevronContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  calendarContainer: {
    width: '100%',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  modalButtonConfirm: {
    backgroundColor: colors.primary,
  },
  modalButtonTextCancel: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  modalButtonTextConfirm: {
    color: 'white',
    fontWeight: 'bold',
  },
  fallbackDateButton: {
    backgroundColor: 'rgba(0, 114, 178, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  fallbackDateButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  unknownDateContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingRight: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  unknownDateText: {
    color: colors.text,
    fontSize: 14,
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
  clearSearchButton: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 16,
    textAlign: 'right',
  },
  countriesList: {
    paddingVertical: 12,
    paddingBottom: 16,
  },
  countryCard: {
    width: 160,
    height: 130,
    borderRadius: 16,
    marginLeft: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
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
    borderRadius: 16,
  },
  countryHeader: {
    padding: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  countryInfo: {
    flex: 1,
  },
  countryNameHe: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  countryName: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  changeSelectionButton: {
    alignItems: 'center',
    padding: 12,
  },
  changeSelectionText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  skipButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});