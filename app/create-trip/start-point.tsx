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
  Modal,
  TouchableOpacity,
  I18nManager,
  ActivityIndicator,
  FlatList,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Calendar, MapPin, ArrowRight, ChevronDown, X, Search, Check, ArrowLeft } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import BackButton from '@/components/BackButton';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Country } from '@/types/travel';
import CountryFlag from '@/components/CountryFlag';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';

// Simple calendar component
const CalendarPicker = ({ 
  selectedDate, 
  onSelectDate, 
  onClose 
}: { 
  selectedDate: Date | null, 
  onSelectDate: (date: Date) => void,
  onClose: () => void
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const handleSelectDate = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onSelectDate(newDate);
    onClose();
  };
  
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() && 
        date.getMonth() === selectedDate.getMonth() && 
        date.getFullYear() === selectedDate.getFullYear();
      
      const isToday = 
        date.getDate() === new Date().getDate() && 
        date.getMonth() === new Date().getMonth() && 
        date.getFullYear() === new Date().getFullYear();
      
      days.push(
        <TouchableOpacity 
          key={`day-${i}`} 
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
            isToday && styles.todayDay
          ]}
          onPress={() => handleSelectDate(i)}
        >
          <Text style={[
            styles.calendarDayText,
            isSelected && styles.selectedDayText,
            isToday && styles.todayDayText
          ]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };
  
  const monthNames = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  
  const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  
  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.calendarNavButton}>
          <Text style={styles.calendarNavButtonText}>{'<'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.calendarTitle}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        
        <TouchableOpacity onPress={handleNextMonth} style={styles.calendarNavButton}>
          <Text style={styles.calendarNavButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.calendarDaysHeader}>
        {dayNames.map((day, index) => (
          <Text key={index} style={styles.calendarDayHeaderText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.calendarGrid}>
        {renderCalendarDays()}
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>סגור</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function StartPointScreen() {
  const router = useRouter();
  const { countries } = useTravelStore();
  const { setTripStartPoint } = useTripStore();
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter countries based on search query
  const filteredCountries = searchQuery
    ? countries.filter(country => 
        country.nameHe.includes(searchQuery) || 
        country.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
    : countries;
  
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
  
  const steps = [
    { id: 1, title: "נקודת התחלה" },
    { id: 2, title: "מדינות לביקור" },
    { id: 3, title: "נקודת סיום" },
    { id: 4, title: "העדפות" },
    { id: 5, title: "סיכום" }
  ];
  
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedLocation('');
    setCustomCity('');
  };
  
  const handleCitySelect = (city: string) => {
    setSelectedLocation(city);
    setCustomCity('');
  };
  
  const handleCustomCityChange = (text: string) => {
    setCustomCity(text);
    setSelectedLocation('');
  };
  
  const validateDate = () => {
    if (!startDate) {
      Alert.alert('שגיאה', 'יש להזין תאריך התחלה');
      return false;
    }
    
    if (startDate < new Date()) {
      Alert.alert('שגיאה', 'תאריך ההתחלה חייב להיות בעתיד');
      return false;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (!selectedCountry) {
      Alert.alert('שגיאה', 'יש לבחור מדינת התחלה');
      return;
    }
    
    if (!validateDate()) {
      return;
    }
    
    setTripStartPoint({
      countryId: selectedCountry.id,
      countryName: selectedCountry.nameHe,
      locationId: selectedLocation || customCity || undefined,
      date: startDate ? format(startDate, 'yyyy-MM-dd') : ''
    });
    
    router.push('/create-trip/visit-countries');
  };
  
  const handleSelectDate = (date: Date) => {
    setStartDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "נקודת התחלה",
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
        <StepIndicator steps={steps} currentStep={1} />
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>מדינת התחלה</Text>
          
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.muted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="חפש מדינה..."
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
          
          <FlatList
            data={filteredCountries}
            renderItem={({ item }) => (
              <Pressable 
                style={[
                  styles.countryCard, 
                  selectedCountry === item && styles.selectedCard
                ]}
                onPress={() => handleCountrySelect(item)}
              >
                <LinearGradient
                  colors={selectedCountry === item ? 
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
            )}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.countriesList}
          />
        </View>
        
        {selectedCountry && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>מיקום התחלה (אופציונלי)</Text>
            
            <FlatList
              data={getCitiesForCountry(selectedCountry.id).map(city => ({ id: city, name: city, nameHe: city })) as Country[]}
              renderItem={({ item }) => (
                <Pressable 
                  style={[
                    styles.locationCard, 
                    selectedLocation === item.id && styles.selectedCard
                  ]}
                  onPress={() => handleCitySelect(item.id)}
                >
                  <LinearGradient
                    colors={selectedLocation === item.id ? 
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
              )}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.locationsList}
            />
          </View>
        )}
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>תאריך התחלה</Text>
          
          <Pressable 
            style={styles.dateButton}
            onPress={() => setShowCalendar(true)}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={styles.dateButtonText}>
              {startDate ? format(startDate, 'dd/MM/yyyy', { locale: he }) : 'בחר תאריך התחלה'}
            </Text>
          </Pressable>
          
          <DateTimePickerModal
            isVisible={showCalendar}
            mode="date"
            onConfirm={handleSelectDate}
            onCancel={() => setShowCalendar(false)}
            minimumDate={new Date()}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
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
  content: {
    flex: 1,
    padding: 20,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  searchContainer: {
    flexDirection: 'row',
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
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: colors.text,
    fontSize: 16,
    textAlign: 'right',
  },
  clearButton: {
    padding: 8,
  },
  countriesList: {
    paddingVertical: 8,
  },
  locationsList: {
    paddingVertical: 8,
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
  locationCard: {
    width: 150,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 1,
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
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
  },
  calendarContainer: {
    backgroundColor: colors.background,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarNavButtonText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calendarDayHeaderText: {
    fontSize: 14,
    color: colors.muted,
    width: 36,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarDayText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedDay: {
    backgroundColor: colors.primary,
    borderRadius: 18,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 18,
  },
  todayDayText: {
    color: colors.primary,
  },
  closeButton: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  }
});