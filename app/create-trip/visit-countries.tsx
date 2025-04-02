import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  TextInput, 
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Search, Check, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import BackButton from '@/components/BackButton';
import { Image } from 'expo-image';
import { Country } from '@/types/travel';

export default function VisitCountriesScreen() {
  const router = useRouter();
  const { countries } = useTravelStore();
  const { tripStartPoint, setTripVisitCountries, tripVisitCountries } = useTripStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<Country[]>(
    tripVisitCountries ? tripVisitCountries.map(id => countries.find(c => c.id === id)).filter(Boolean) as Country[] : []
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter countries based on search query
  const filteredCountries = searchQuery
    ? countries.filter(country => 
        country.nameHe.includes(searchQuery) || 
        country.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
    : countries;
  
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
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };
  
  const handleNext = () => {
    // Save selected countries
    setTripVisitCountries(selectedCountries.map(c => c.id));
    
    // Navigate to end point screen
    router.push('/create-trip/end-point');
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
      
      <View style={styles.content}>
        <StepIndicator steps={steps} currentStep={2} />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>באילו מדינות תרצה לבקר?</Text>
          <Text style={styles.subtitle}>בחר מדינות שתרצה לבקר בהן במהלך הטיול</Text>
          
          {selectedCountries.length > 0 && (
            <View style={styles.selectedCountriesContainer}>
              <Text style={styles.sectionTitle}>מדינות שנבחרו</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedCountriesScroll}>
                {selectedCountries.map(country => (
                  <Pressable 
                    key={country.id} 
                    style={styles.selectedCountryChip}
                    onPress={() => handleCountryToggle(country)}
                  >
                    <Image
                      source={{ uri: country.flagImage || country.image }}
                      style={styles.chipFlag}
                      contentFit="cover"
                    />
                    <Text style={styles.chipText}>{country.nameHe}</Text>
                    <X size={16} color={colors.text} />
                  </Pressable>
                ))}
              </ScrollView>
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
          </View>
          
          <View style={styles.countriesList}>
            <Text style={styles.sectionTitle}>בחר מדינות</Text>
            {filteredCountries
              .filter(country => country.id !== tripStartPoint.countryId) // Filter out start country
              .map(country => (
                <Pressable
                  key={country.id}
                  style={[
                    styles.countryItem,
                    selectedCountries.some(c => c.id === country.id) && styles.selectedCountryItem
                  ]}
                  onPress={() => handleCountryToggle(country)}
                >
                  <View style={styles.countryInfo}>
                    <Text style={styles.countryName}>{country.nameHe}</Text>
                    <Text style={styles.countryNameEn}>{country.nameEn}</Text>
                  </View>
                  <View style={styles.countryRightSection}>
                    {selectedCountries.some(c => c.id === country.id) ? (
                      <View style={styles.checkIconContainer}>
                        <Check size={16} color="white" />
                      </View>
                    ) : (
                      <View style={styles.plusIconContainer}>
                        <Plus size={16} color={colors.primary} />
                      </View>
                    )}
                    <Image
                      source={{ uri: country.flagImage || country.image }}
                      style={styles.countryFlag}
                      contentFit="cover"
                    />
                  </View>
                </Pressable>
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
              style={styles.nextButton}
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
    marginBottom: 8,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 16,
    textAlign: 'right',
  },
  selectedCountriesContainer: {
    marginBottom: 16,
  },
  selectedCountriesScroll: {
    flexDirection: 'row',
    marginBottom: 8,
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
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCountryItem: {
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: `${colors.primary}10`,
  },
  countryInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'right',
  },
  countryNameEn: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
  },
  countryRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    width: 40,
    height: 30,
    borderRadius: 4,
    marginLeft: 12,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  plusIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primary,
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
});