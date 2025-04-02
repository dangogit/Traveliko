import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Calendar, MapPin, ArrowLeft, Check, Clock, CheckCircle2, ArrowRight } from 'lucide-react-native';
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

export default function TripSummaryScreen() {
  const router = useRouter();
  const { 
    getTripStartPoint, 
    getTripEndPoint, 
    getTripPreferences,
    generateTripPlan,
    getTripPlan,
    createTrip,
    tripVisitCountries
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
  
  // Fetch trip data safely
  useEffect(() => {
    try {
      const startPointData = getTripStartPoint();
      setStartPoint(startPointData);
    } catch (e) {
      setError("נקודת התחלה לא הוגדרה. אנא חזור לשלב הקודם.");
    }
    
    try {
      const endPointData = getTripEndPoint();
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
    setVisitCountries(tripVisitCountries || []);
    
    // Simulate trip plan generation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
  
  const countriesWithDays = visitCountries.map((countryId, index) => {
    const country = getCountryById(countryId);
    const days = daysPerCountry[index] || 1;
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
            <SummaryItem 
              label="נקודת התחלה" 
              value={startPoint?.name || ''} 
            />
            <SummaryItem 
              label="מדינות לביקור" 
              value={countriesWithDays} 
              isArray={true} 
            />
            <SummaryItem 
              label="נקודת סיום" 
              value={endPoint?.name || ''} 
            />
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
          
          <Pressable onPress={handleCreateTrip} disabled={loading}>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
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
    marginTop: 8,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  createButton: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  }
});