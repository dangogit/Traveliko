import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Pressable, 
  SafeAreaView, 
  TouchableOpacity,
  TextInput,
  Image,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import colors from '@/constants/colors';
import { ArrowRight, ArrowLeft, Search, X, Calendar, Plus, Minus } from 'lucide-react-native';
import CountryFlag from '@/components/CountryFlag';
import BackButton from '@/components/BackButton';
import StepIndicator from '@/components/StepIndicator';
import { countries } from '@/mocks/countries';
import { LinearGradient } from 'expo-linear-gradient';

type CountryItem = {
  id: string;
  name: string;
  nameHe: string;
  continent: string;
};

export default function CountriesScreen() {
  const router = useRouter();
  const { setCountries, setDaysPerCountry } = useTripStore();
  
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [daysCount, setDaysCount] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const steps = [
    { id: 1, title: "נקודת התחלה" },
    { id: 2, title: "מדינות לביקור" },
    { id: 3, title: "נקודת סיום" },
    { id: 4, title: "העדפות" },
    { id: 5, title: "סיכום" }
  ];
  
  // Filter countries based on search query
  const filteredCountries = countries.filter(country => {
    const query = searchQuery.toLowerCase();
    return (
      country.name.toLowerCase().includes(query) ||
      country.nameHe.toLowerCase().includes(query)
    );
  });
  
  // Handle country selection
  const toggleCountry = (countryId: string) => {
    if (selectedCountries.includes(countryId)) {
      // Remove country from selection
      setSelectedCountries(selectedCountries.filter(id => id !== countryId));
      
      // Remove days count for this country
      const newDaysCount = { ...daysCount };
      delete newDaysCount[countryId];
      setDaysCount(newDaysCount);
    } else {
      // Add country to selection with default 3 days
      setSelectedCountries([...selectedCountries, countryId]);
      setDaysCount({ ...daysCount, [countryId]: 3 });
    }
  };
  
  // Handle days count change
  const changeDaysCount = (countryId: string, increment: boolean) => {
    const currentDays = daysCount[countryId] || 3;
    const newDays = increment ? currentDays + 1 : Math.max(1, currentDays - 1);
    setDaysCount({ ...daysCount, [countryId]: newDays });
  };
  
  const handleNext = () => {
    if (selectedCountries.length === 0) {
      Alert.alert('שגיאה', 'יש לבחור לפחות מדינה אחת לביקור');
      return;
    }
    
    // Convert days count object to array in the same order as selected countries
    const daysPerCountry = selectedCountries.map(countryId => daysCount[countryId] || 3);
    
    setCountries(selectedCountries);
    setDaysPerCountry(daysPerCountry);
    
    router.push('/create-trip/end-point');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  // Render each country item
  const renderCountryItem = ({ item }: { item: CountryItem }) => {
    const isSelected = selectedCountries.includes(item.id);
    
    return (
      <Pressable 
        style={[
          styles.countryCard, 
          isSelected && styles.selectedCountryCard
        ]}
        onPress={() => toggleCountry(item.id)}
      >
        <LinearGradient
          colors={isSelected ? 
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
          
          <View style={styles.selectionIndicator}>
            {isSelected ? (
              <View style={styles.selectedIndicator}>
                <X size={16} color="white" />
              </View>
            ) : (
              <View style={styles.unselectedIndicator}>
                <Plus size={16} color={colors.primary} />
              </View>
            )}
          </View>
        </View>
        
        {isSelected && (
          <View style={styles.daysSelector}>
            <View style={styles.daysSelectorHeader}>
              <Calendar size={16} color={colors.text} />
              <Text style={styles.daysSelectorLabel}>מספר ימים:</Text>
            </View>
            
            <View style={styles.daysControls}>
              <TouchableOpacity 
                style={styles.daysButton}
                onPress={() => changeDaysCount(item.id, false)}
              >
                <Minus size={16} color={colors.primary} />
              </TouchableOpacity>
              
              <Text style={styles.daysCount}>{daysCount[item.id] || 3}</Text>
              
              <TouchableOpacity 
                style={styles.daysButton}
                onPress={() => changeDaysCount(item.id, true)}
              >
                <Plus size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "מדינות לביקור",
        headerLeft: () => <BackButton />
      }} />
      
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1000" }} 
        style={styles.backgroundImage} 
        blurRadius={20}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <StepIndicator steps={steps} currentStep={2} />
        
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="חפש מדינות..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign="right"
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
        
        <View style={styles.selectedHeader}>
          <Text style={styles.selectedText}>
            {selectedCountries.length > 0 
              ? `נבחרו ${selectedCountries.length} מדינות`
              : 'בחר מדינות לביקור'
            }
          </Text>
        </View>
        
        <FlatList
          data={filteredCountries}
          renderItem={renderCountryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        
        <View style={styles.buttonContainer}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>חזור</Text>
          </Pressable>
          
          <Pressable onPress={handleNext}>
            <LinearGradient
              colors={[colors.primary, '#006199']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>המשך</Text>
              <ArrowRight size={20} color="white" />
            </LinearGradient>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 24,
    textAlign: 'right',
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
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
  filterContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    flexDirection: 'row-reverse',
  },
  filterChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 114, 178, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginRight: 6,
  },
  filterChipTextActive: {
    color: 'white',
  },
  countriesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  countryCard: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryImage: {
    ...StyleSheet.absoluteFillObject,
  },
  cardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  countryFlagContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  countryInfo: {
    alignItems: 'flex-end',
  },
  countryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  btnContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearFiltersButton: {
    backgroundColor: 'rgba(0, 114, 178, 0.1)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 114, 178, 0.2)',
  },
  clearFiltersText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  emptyStateContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 16,
  },
  selectedHeader: {
    marginBottom: 16,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  listContent: {
    paddingBottom: 20,
  },
  selectedCountryCard: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  flagContainer: {
    marginRight: 16,
  },
  countryNameHe: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  selectionIndicator: {
    marginLeft: 8,
  },
  selectedIndicator: {
    backgroundColor: colors.error,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unselectedIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  daysSelector: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
  },
  daysSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  daysSelectorLabel: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  daysControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  daysCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
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
  nextButton: {
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
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  }
}); 