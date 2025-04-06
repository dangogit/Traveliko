import React, { useState, useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Calendar, MapPin, ArrowLeft, Check, Clock, CheckCircle2, ArrowRight, Plus, Minus, AlertCircle } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import BackButton from '@/components/BackButton';
import { LinearGradient } from 'expo-linear-gradient';
import { getCountryNameHebrew } from '@/utils/country-utils';

// Type for trip summary item
type SummaryItemProps = {
  label: string;
  value: string | string[];
  isArray?: boolean;
};

const SummaryItem = ({ label, value, isArray = false }: SummaryItemProps) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryItemLabel}>{label}</Text>
    {isArray ? (
      <View style={styles.tagsContainer}>
        {(value as string[]).map((item, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>
    ) : (
      <Text style={styles.summaryItemValue}>{value as string}</Text>
    )}
  </View>
);

// Create a new component for countries with adjustable days
const CountryWithDays = ({ 
  countryId, 
  days, 
  onChangeDays, 
  isStartOrEnd = false,
  label = '',
  onRemove
}: { 
  countryId: string, 
  days: number, 
  onChangeDays: (countryId: string, increment: boolean) => void,
  isStartOrEnd?: boolean,
  label?: string,
  onRemove?: (countryId: string) => void
}) => {
  const { getCountryById } = useTravelStore();
  const country = getCountryById(countryId);
  const countryName = getCountryNameHebrew(country);
  
  return (
    <View style={[
      styles.countryWithDaysContainer,
      isStartOrEnd && styles.specialPointContainer
    ]}>
      {isStartOrEnd && (
        <View style={styles.pointIndicator}>
          <MapPin size={14} color="white" />
        </View>
      )}
      <View style={styles.countryWithDaysInfo}>
        <Text style={styles.countryWithDaysName}>
          {label ? label : countryName}
        </Text>
      </View>
      
      <View style={styles.daysControls}>
        {!isStartOrEnd && onRemove && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => onRemove(countryId)}
          >
            <Text style={styles.removeButtonText}>הסר</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.daysControlsInner}>
          <TouchableOpacity 
            style={[styles.daysButton, days <= 1 && styles.daysButtonDisabled]}
            onPress={() => onChangeDays(countryId, false)}
            disabled={days <= 1}
          >
            <Minus size={14} color={days <= 1 ? colors.muted : colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.daysCount}>{days} ימים</Text>
          
          <TouchableOpacity 
            style={styles.daysButton}
            onPress={() => onChangeDays(countryId, true)}
          >
            <Plus size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function TripSummaryScreen() {
  const router = useRouter();
  const { 
    getTripStartPoint, 
    getTripEndPoint, 
    getTripPreferences,
    generateTripPlan,
    getTripPlan,
    createTrip,
    tripVisitCountries: visitCountriesFromStore,
    setDaysPerCountry: setStoreDaysPerCountry,
    daysPerCountry: daysPerCountryFromStore
  } = useTripStore();
  const { getCountryById, getLocationById } = useTravelStore();
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Safely get trip data
  const [startPoint, setStartPoint] = useState<any>(null);
  const [endPoint, setEndPoint] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [tripPlan, setTripPlan] = useState<any>(null);
  const [visitCountries, setVisitCountries] = useState<string[]>([]);
  const [daysPerCountry, setLocalDaysPerCountry] = useState<Record<string, number>>(daysPerCountryFromStore || {});
  
  // Calculate total trip duration between start and end dates
  const totalTripDays = useMemo(() => {
    if (!startPoint?.date || !endPoint?.date) return 0;
    
    const start = new Date(startPoint.date);
    const end = new Date(endPoint.date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays;
  }, [startPoint?.date, endPoint?.date]);
  
  // Keep track of all countries, including start and end points
  const allCountries = useMemo(() => {
    const countries = new Set<string>();
    
    // Add start country
    if (startPoint?.countryId) {
      countries.add(startPoint.countryId);
    }
    
    // Add countries to visit
    visitCountries.forEach(countryId => {
      countries.add(countryId);
    });
    
    // Add end country
    if (endPoint?.countryId) {
      countries.add(endPoint.countryId);
    }
    
    return Array.from(countries);
  }, [startPoint, endPoint, visitCountries]);
  
  // Calculate the current total allocated days
  const currentTotalDays = useMemo(() => {
    return allCountries.reduce((total, countryId) => {
      return total + (daysPerCountry[countryId] || 1);
    }, 0);
  }, [allCountries, daysPerCountry]);
  
  // Check if the total days match the trip duration
  const isDaysValid = useMemo(() => {
    return currentTotalDays === totalTripDays;
  }, [currentTotalDays, totalTripDays]);
  
  // Fetch trip data safely
  useEffect(() => {
    try {
      const startPointData = getTripStartPoint();
      console.log('Start Point Data:', JSON.stringify(startPointData));
      setStartPoint(startPointData);
    } catch (e) {
      setError("נקודת התחלה לא הוגדרה. אנא חזור לשלב הקודם.");
    }
    
    try {
      const endPointData = getTripEndPoint();
      console.log('End Point Data:', JSON.stringify(endPointData));
      setEndPoint(endPointData);
    } catch (e) {
      // End point is optional, so no error needed
    }
    
    try {
      const preferencesData = getTripPreferences();
      setPreferences(preferencesData);
    } catch (e) {
      setError("העדפות לא הוגדרו. אנא חזור לשלב הקודם.");
    }
    
    setTripPlan(getTripPlan());
    setVisitCountries(visitCountriesFromStore || []);
    
    // Simulate trip plan generation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update days allocation from initial data
  useEffect(() => {
    if (!daysPerCountry || Object.keys(daysPerCountry).length === 0) {
      distributeDefaultDays();
    }
  }, [visitCountries, startPoint, endPoint, totalTripDays]);
  
  // Function to distribute days evenly across countries
  const distributeDefaultDays = () => {
    if (allCountries.length === 0 || totalTripDays === 0) return;
    
    const defaultDaysPerCountry: Record<string, number> = {};
    const defaultDays = Math.floor(totalTripDays / allCountries.length);
    let remainingDays = totalTripDays % allCountries.length;
    
    allCountries.forEach(countryId => {
      defaultDaysPerCountry[countryId] = defaultDays;
      if (remainingDays > 0) {
        defaultDaysPerCountry[countryId]++;
        remainingDays--;
      }
    });
    
    setLocalDaysPerCountry(defaultDaysPerCountry);
    if (typeof setStoreDaysPerCountry === 'function') {
      setStoreDaysPerCountry(defaultDaysPerCountry);
    }
  };
  
  // Function to change days for a country
  const changeDaysForCountry = (countryId: string, increment: boolean) => {
    // Don't allow decreasing below 1 day
    if (!increment && (daysPerCountry[countryId] || 1) <= 1) return;
    
    // Calculate new days
    const newDaysPerCountry = { ...daysPerCountry };
    newDaysPerCountry[countryId] = (newDaysPerCountry[countryId] || 1) + (increment ? 1 : -1);
    
    // Verify that the total days don't exceed the trip duration
    const newTotalDays = Object.values(newDaysPerCountry).reduce((sum, days) => sum + days, 0);
    
    if (newTotalDays > totalTripDays) {
      Alert.alert('שגיאה', 'לא ניתן להוסיף יותר ימים. סך הימים צריך להתאים למשך הטיול.');
      return;
    }
    
    // Update the state
    setLocalDaysPerCountry(newDaysPerCountry);
    if (typeof setStoreDaysPerCountry === 'function') {
      setStoreDaysPerCountry(newDaysPerCountry);
    }
  };
  
  // Function to reset the days distribution
  const resetDaysDistribution = () => {
    distributeDefaultDays();
  };
  
  const steps = [
    { id: 1, title: "נקודת התחלה" },
    { id: 2, title: "מדינות לביקור" },
    { id: 3, title: "נקודת סיום" },
    { id: 4, title: "העדפות" },
    { id: 5, title: "סיכום" }
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const getCountryName = (countryId: string) => {
    const country = getCountryById(countryId);
    return country ? country.nameHe : 'לא ידוע';
  };
  
  const getLocationName = (locationId?: string) => {
    if (!locationId) return '';
    const location = getLocationById(locationId);
    return location ? location.nameHe : '';
  };
  
  const getDuration = () => {
    if (!startPoint || !endPoint) return 0;
    
    const start = new Date(startPoint.date);
    const end = new Date(endPoint.date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const handleGeneratePlan = () => {
    setGenerating(true);
    
    // Simulate plan generation
    setTimeout(() => {
      generateTripPlan();
      setTripPlan(getTripPlan());
      setGenerating(false);
    }, 2000);
  };
  
  const handleCreateTrip = async () => {
    if (!validateTrip()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call for creating the trip
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create trip
      createTrip(tripPlan);
      
      // Navigate to trip details
      router.replace('/(tabs)/trips');
    } catch (error) {
      Alert.alert('שגיאה', 'אירעה שגיאה ביצירת הטיול, נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };
  
  const validateTrip = (): boolean => {
    if (!tripPlan) {
      Alert.alert('שגיאה', 'יש ליצור תכנית טיול תחילה');
      return false;
    }
    
    return true;
  };
  
  const getTravelerTypeText = (type: string): string => {
    switch (type) {
      case 'solo': return 'לבד';
      case 'couple': return 'זוג';
      case 'family': return 'משפחה';
      case 'friends': return 'חברים';
      case 'business': return 'עסקים';
      default: return type;
    }
  };
  
  const getBudgetText = (budget: string): string => {
    switch (budget) {
      case 'low': return 'חסכוני';
      case 'medium': return 'בינוני';
      case 'high': return 'גבוה';
      default: return budget;
    }
  };
  
  const getAccommodationText = (acc: string): string => {
    switch (acc) {
      case 'hotel': return 'מלון';
      case 'hostel': return 'אכסניה';
      case 'apartment': return 'דירה';
      case 'camping': return 'קמפינג';
      default: return acc;
    }
  };
  
  const getTransportationText = (trans: string): string => {
    switch (trans) {
      case 'public': return 'תחבורה ציבורית';
      case 'rental': return 'רכב שכור';
      case 'taxi': return 'מונית';
      case 'walking': return 'הליכה';
      default: return trans;
    }
  };
  
  const countriesWithDays = visitCountries.map((countryId) => {
    const country = getCountryById(countryId);
    // Use a default of 1 day if daysPerCountry is undefined or doesn't have this countryId
    const days = daysPerCountry && typeof daysPerCountry[countryId] === 'number' ? daysPerCountry[countryId] : 1;
    return `${getCountryNameHebrew(country)} (${days} ימים)`;
  });
  
  const accommodationOptions = preferences?.accommodation.map(acc => getAccommodationText(acc)) || [];
  const transportationOptions = preferences?.transportation.map(trans => getTransportationText(trans)) || [];
  
  const handleBack = () => {
    router.back();
  };
  
  const handleStartOver = () => {
    router.replace('/create-trip');
  };
  
  // Add a helper function to format start/end point details
  const formatPointDetails = (point: any) => {
    if (!point) return '';
    
    try {
      // Get country info
      let countryName = '';
      if (point.countryName) {
        countryName = point.countryName;
      } else if (point.countryId) {
        const country = getCountryById(point.countryId);
        countryName = country ? (country.nameHe || country.name || '') : '';
      }
      
      // Get location info
      let locationName = '';
      if (point.cityName) {
        locationName = point.cityName;
      } else if (point.name && point.name !== countryName) {
        locationName = point.name;
      } else if (point.customLocation) {
        locationName = point.customLocation;
      } else if (point.locationId) {
        const location = getLocationById(point.locationId);
        locationName = location ? (location.nameHe || location.name || '') : '';
      }
      
      // Format date
      let dateStr = '';
      if (point.date) {
        dateStr = ` | ${formatDate(point.date)}`;
      }
      
      // Build the final string
      let result = '';
      if (locationName && countryName) {
        result = `${locationName}, ${countryName}`;
      } else if (countryName) {
        result = countryName;
      } else if (locationName) {
        result = locationName;
      }
      
      return result + dateStr;
    } catch (error) {
      console.error('Error formatting point details:', error);
      return point.name || point.countryName || '';
    }
  };
  
  // Add function to remove a country
  const removeCountry = (countryId: string) => {
    // Update local state
    setVisitCountries(prev => prev.filter(id => id !== countryId));
    
    // Update the store
    const updatedVisitCountries = visitCountries.filter(id => id !== countryId);
    useTripStore.getState().setTripVisitCountries(updatedVisitCountries);
    
    // Remove the country from days allocation
    const newDaysPerCountry = { ...daysPerCountry };
    delete newDaysPerCountry[countryId];
    
    // Update the days allocation
    setLocalDaysPerCountry(newDaysPerCountry);
    if (typeof setStoreDaysPerCountry === 'function') {
      setStoreDaysPerCountry(newDaysPerCountry);
    }
    
    // Redistribute days to maintain the total
    distributeDefaultDays();
  };
  
  // Add function to navigate to add more countries
  const goToAddMoreCountries = () => {
    router.push('/create-trip/visit-countries');
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Stack.Screen options={{ 
          title: "טוען...",
          headerLeft: () => <BackButton />
        }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>מכין את סיכום הטיול...</Text>
      </SafeAreaView>
    );
  }
  
  if (error || !startPoint || !preferences) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Stack.Screen options={{ 
          title: "שגיאה",
          headerLeft: () => <BackButton />
        }} />
        
        <View style={styles.errorContent}>
          <Text style={styles.errorTitle}>אופס! משהו השתבש</Text>
          <Text style={styles.errorMessage}>{error || "נתוני הטיול חסרים. אנא התחל את תהליך יצירת הטיול מחדש."}</Text>
          
          <Pressable style={styles.startOverButton} onPress={handleStartOver}>
            <Text style={styles.startOverButtonText}>התחל מחדש</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "סיכום הטיול",
        headerLeft: () => <BackButton />
      }} />
      
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000" }} 
        style={styles.backgroundImage} 
        blurRadius={20}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.gradient}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StepIndicator steps={steps} currentStep={5} />
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryHeader}>
            <CheckCircle2 size={24} color={colors.success} />
            <Text style={styles.summaryTitle}>סיכום פרטי הטיול</Text>
          </View>
          
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>מסלול הטיול</Text>
            
            {/* Show warning if days allocation is invalid */}
            {!isDaysValid && (
              <View style={styles.warningContainer}>
                <AlertCircle size={18} color={colors.error} />
                <Text style={styles.warningText}>
                  סך ימי הטיול ({currentTotalDays}) לא תואם את התאריכים שנבחרו ({totalTripDays} ימים)
                </Text>
              </View>
            )}
            
            {/* Show total trip duration */}
            <View style={styles.tripDurationRow}>
              <Calendar size={18} color={colors.primary} />
              <Text style={styles.tripDurationText}>
                משך הטיול: {totalTripDays} ימים
              </Text>
            </View>
            
            {/* Start point with days */}
            {startPoint?.countryId && (
              <CountryWithDays
                countryId={startPoint.countryId}
                days={daysPerCountry[startPoint.countryId] || 1}
                onChangeDays={changeDaysForCountry}
                isStartOrEnd={true}
                label={`נקודת התחלה: ${formatPointDetails(startPoint)}`}
              />
            )}
            
            {/* Visit countries with days */}
            {visitCountries.length > 0 && (
              <View style={styles.visitCountriesContainer}>
                <View style={styles.visitCountriesHeader}>
                  <Text style={styles.visitCountriesTitle}>מדינות לביקור:</Text>
                  
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={goToAddMoreCountries}
                  >
                    <Text style={styles.editButtonText}>עריכה</Text>
                  </TouchableOpacity>
                </View>
                
                {visitCountries.map(countryId => (
                  <CountryWithDays
                    key={countryId}
                    countryId={countryId}
                    days={daysPerCountry[countryId] || 1}
                    onChangeDays={changeDaysForCountry}
                    onRemove={removeCountry}
                  />
                ))}
                
                <TouchableOpacity 
                  style={styles.addMoreButton}
                  onPress={goToAddMoreCountries}
                >
                  <Plus size={16} color={colors.primary} />
                  <Text style={styles.addMoreButtonText}>הוסף מדינות נוספות</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* End point with days */}
            {endPoint?.countryId && (
              <CountryWithDays
                countryId={endPoint.countryId}
                days={daysPerCountry[endPoint.countryId] || 1}
                onChangeDays={changeDaysForCountry}
                isStartOrEnd={true}
                label={`נקודת סיום: ${formatPointDetails(endPoint)}`}
              />
            )}
            
            {/* Option to reset days distribution */}
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetDaysDistribution}
            >
              <Text style={styles.resetButtonText}>חלק ימים באופן שווה</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>העדפות הטיול</Text>
            {preferences && (
              <>
                <SummaryItem 
                  label="סוג מטייל" 
                  value={getTravelerTypeText(preferences.travelerType)} 
                />
                <SummaryItem 
                  label="תקציב" 
                  value={getBudgetText(preferences.budget)} 
                />
                <SummaryItem 
                  label="לינה מועדפת" 
                  value={accommodationOptions} 
                  isArray={true} 
                />
                <SummaryItem 
                  label="תחבורה מועדפת" 
                  value={transportationOptions} 
                  isArray={true} 
                />
              </>
            )}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>חזור</Text>
          </Pressable>
          
          <Pressable 
            onPress={handleCreateTrip} 
            disabled={loading || !isDaysValid}
            style={[styles.createButtonWrapper, !isDaysValid && styles.disabledButtonWrapper]}
          >
            <LinearGradient
              colors={[colors.primary, '#006199']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.createButton}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.createButtonText}>צור טיול</Text>
                  <ArrowRight size={20} color="white" />
                </>
              )}
            </LinearGradient>
          </Pressable>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  summaryContainer: {
    marginTop: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(240, 240, 240, 0.8)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 114, 178, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  summaryItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
  },
  summaryItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  summaryItemValue: {
    fontSize: 16,
    color: colors.muted,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: colors.primary,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  createButtonWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  createButton: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#003559',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  noteText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
    marginBottom: 8,
    fontStyle: 'italic'
  },
  editableCountryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  countryNameContainer: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    color: colors.text,
  },
  daysControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysControlsInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 114, 178, 0.08)',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  daysButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  daysButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowOpacity: 0,
    elevation: 0,
  },
  daysCount: {
    minWidth: 52,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 6,
  },
  tripDurationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tripDurationText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
    marginRight: 10,
    flex: 1,
  },
  daysAllocatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysAllocatedText: {
    fontSize: 14,
    color: colors.text,
  },
  daysAllocatedTextInvalid: {
    color: colors.error,
  },
  warningIcon: {
    marginLeft: 5,
  },
  countriesDaysContainer: {
    marginBottom: 16,
  },
  warningContainer: {
    backgroundColor: colors.errorLight,
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  warningText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },
  disabledButtonWrapper: {
    opacity: 0.6,
  },
  countryWithDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 114, 178, 0.1)',
    position: 'relative',
  },
  specialPointContainer: {
    backgroundColor: 'rgba(0, 114, 178, 0.05)',
    borderRadius: 12,
    paddingLeft: 25,
    marginVertical: 6,
    borderBottomWidth: 0,
  },
  pointIndicator: {
    position: 'absolute',
    left: -6,
    top: '50%',
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  countryWithDaysInfo: {
    flex: 1,
    paddingRight: 10,
  },
  countryWithDaysName: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  visitCountriesContainer: {
    marginVertical: 12,
    backgroundColor: 'rgba(0, 114, 178, 0.03)',
    borderRadius: 16,
    padding: 14,
  },
  visitCountriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 114, 178, 0.1)',
  },
  visitCountriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 114, 178, 0.08)',
    padding: 14,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  addMoreButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: 'rgba(0, 114, 178, 0.08)',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  resetButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: colors.errorLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  removeButtonText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  tripDurationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 114, 178, 0.1)',
  },
});