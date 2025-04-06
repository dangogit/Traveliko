import React, { useState, useEffect, useMemo } from 'react';
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
  Image,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Calendar, MapPin, ArrowRight, ChevronDown, X, Search, Check, ArrowLeft, Plus, Minus } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import BackButton from '@/components/BackButton';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Country } from '@/types/travel';
import CountryFlag from '@/components/CountryFlag';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarError, setCalendarError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tripDuration, setTripDuration] = useState(5); // Default 5 days
  
  // Ensure the calendar works properly
  useEffect(() => {
    // Reset calendar error state whenever showCalendar changes
    if (showCalendar) {
      setCalendarError(false);
    }
  }, [showCalendar]);
  
  // Handle potential errors with the DateTimePicker
  const handleCalendarError = () => {
    setCalendarError(true);
    setShowCalendar(false);
    
    // Show fallback date input
    Alert.alert(
      'בחירת תאריך',
      'יש לבחור תאריך התחלה (YYYY-MM-DD)',
      [
        {
          text: 'ביטול',
          style: 'cancel',
        },
        {
          text: 'אישור',
          onPress: (dateText) => {
            try {
              // Simple validation of date format (YYYY-MM-DD)
              if (dateText && typeof dateText === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
                const date = new Date(dateText);
                if (!isNaN(date.getTime())) {
                  setStartDate(date);
                }
              }
            } catch (e) {
              console.error('Error parsing date:', e);
            }
          }
        },
      ],
      {
        cancelable: true,
      }
    );
  };
  
  // Sort and filter countries based on search query and region
  const sortedAndFilteredCountries = useMemo(() => {
    // First filter by search query if any
    let filtered = searchQuery
      ? countries.filter(country => 
          country.nameHe.includes(searchQuery) || 
          country.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
      : [...countries];
    
    // If a country is selected, sort to prioritize countries from the same region
    if (selectedCountry) {
      filtered.sort((a, b) => {
        // Put the selected country first
        if (a.id === selectedCountry.id) return -1;
        if (b.id === selectedCountry.id) return 1;
        
        // Then countries from the same region
        const aIsSameRegion = a.regionId === selectedCountry.regionId;
        const bIsSameRegion = b.regionId === selectedCountry.regionId;
        
        if (aIsSameRegion && !bIsSameRegion) return -1;
        if (!aIsSameRegion && bIsSameRegion) return 1;
        
        // Within the same region, sort alphabetically
        if (aIsSameRegion && bIsSameRegion) {
          return a.nameHe.localeCompare(b.nameHe);
        }
        
        // For other countries, sort by popularity or alphabetically
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        
        return a.nameHe.localeCompare(b.nameHe);
      });
    } else {
      // If no country selected, sort by popularity and then alphabetically
      filtered.sort((a, b) => {
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;
        return a.nameHe.localeCompare(b.nameHe);
      });
    }
    
    return filtered;
  }, [countries, searchQuery, selectedCountry]);
  
  const steps = [
    { id: 1, title: "נקודת התחלה" },
    { id: 2, title: "מדינות לביקור" },
    { id: 3, title: "נקודת סיום" },
    { id: 4, title: "העדפות" },
    { id: 5, title: "סיכום" }
  ];
  
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };
  
  const validateDate = () => {
    if (!startDate) {
      Alert.alert('שגיאה', 'יש להזין תאריך התחלה');
      return false;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDateTime = new Date(startDate);
    startDateTime.setHours(0, 0, 0, 0);
    
    if (startDateTime < today) {
      Alert.alert('שגיאה', 'תאריך ההתחלה חייב להיות בעתיד');
      return false;
    }
    
    return true;
  };
  
  const changeTripDuration = (increment: boolean) => {
    if (increment) {
      setTripDuration(prevDuration => prevDuration + 1);
    } else {
      setTripDuration(prevDuration => Math.max(1, prevDuration - 1));
    }
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
      date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      tripDuration: tripDuration
    });
    
    router.push('/create-trip/visit-countries');
  };
  
  const handleSelectDate = (date: Date) => {
    setStartDate(date);
    setShowCalendar(false);
  };

  const handlePressDateButton = () => {
    console.log('Date button pressed, showing calendar');
    setShowCalendar(true);
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
          <Text style={styles.sectionTitle}>תאריך התחלה</Text>
          
          <TouchableOpacity
            style={styles.dateButtonContainer}
            onPress={handlePressDateButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.9)', 'rgba(240,242,250,0.95)']}
              style={styles.dateGradient}
            >
              <View style={styles.dateButtonContent}>
                <Calendar size={24} color={colors.primary} style={styles.dateIcon} />
                <Text style={styles.dateText}>
                  {startDate ? format(startDate, 'dd/MM/yyyy', { locale: he }) : 'בחר תאריך התחלה'}
                </Text>
                <View style={styles.dateChevronContainer}>
                  <ChevronDown size={18} color={colors.primary} />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>משך הטיול (ימים):</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity 
                style={styles.durationButton}
                onPress={() => changeTripDuration(false)}
              >
                <Minus size={20} color={colors.primary} />
              </TouchableOpacity>
              
              <Text style={styles.durationValue}>{tripDuration}</Text>
              
              <TouchableOpacity 
                style={styles.durationButton}
                onPress={() => changeTripDuration(true)}
              >
                <Plus size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          
          {Platform.OS === 'web' && showCalendar && (
            <Modal
              visible={true}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowCalendar(false)}
            >
              <TouchableOpacity 
                style={styles.modalContainer} 
                activeOpacity={1}
                onPress={() => setShowCalendar(false)}
              >
                <View 
                  style={styles.modalContent}
                  onStartShouldSetResponder={() => true}
                  onTouchEnd={e => e.stopPropagation()}
                >
                  <Text style={styles.modalTitle}>בחר תאריך התחלה</Text>
                  <CalendarPicker
                    selectedDate={startDate || new Date()}
                    onSelectDate={handleSelectDate}
                    onClose={() => setShowCalendar(false)}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          )}
          
          {Platform.OS === 'android' && showCalendar && (
            <RNDateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowCalendar(false);
                if (selectedDate) {
                  setStartDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}
          
          {Platform.OS === 'ios' && (
            <DateTimePickerModal
              isVisible={showCalendar}
              mode="date"
              onConfirm={handleSelectDate}
              onCancel={() => setShowCalendar(false)}
              minimumDate={new Date()}
              locale="he"
              confirmTextIOS="אישור"
              cancelTextIOS="ביטול"
              headerTextIOS="בחר תאריך"
              buttonTextColorIOS={colors.primary}
            />
          )}
          
          {calendarError && (
            <TouchableOpacity 
              style={styles.fallbackDateButton}
              onPress={() => {
                setCalendarError(false);
                setShowCalendar(true);
              }}
            >
              <Text style={styles.fallbackDateButtonText}>נתקלנו בבעיה? נסה שוב או הזן תאריך ידנית</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>מדינת התחלה</Text>
          
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
            data={selectedCountry ? [selectedCountry] : sortedAndFilteredCountries}
            renderItem={({ item }) => (
              <Pressable 
                style={[
                  styles.countryCard, 
                  selectedCountry?.id === item.id && styles.selectedCard,
                  item.regionId === selectedCountry?.regionId && item.id !== selectedCountry?.id && styles.sameRegionCard
                ]}
                onPress={() => handleCountrySelect(item)}
              >
                <Image 
                  source={{ uri: item.image || `https://source.unsplash.com/300x200/?${item.nameEn},landmark` }} 
                  style={styles.countryImage}
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
                    {item.regionId === selectedCountry?.regionId && item.id !== selectedCountry?.id && (
                      <View style={styles.sameRegionBadge}>
                        <Text style={styles.sameRegionText}>אותו אזור</Text>
                      </View>
                    )}
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
            onPress={handleNext}
          >
            <LinearGradient
              colors={[colors.primary, '#006199']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.buttonGradient}
            >
              <ArrowRight size={20} color="white" style={{marginLeft: 8}} />
              <Text style={styles.buttonTextPrimary}>המשך</Text>
            </LinearGradient>
          </Pressable>
          
          <Pressable 
            style={styles.button} 
            onPress={() => router.back()}
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
  dateButtonContainer: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
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
  durationContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
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
    textAlign: 'right',
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
    marginTop: 16,
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
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  changeSelectionText: {
    color: colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)', 
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    marginLeft: 8,
    flex: 1,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  webCalendarContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    textAlign: 'center',
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
  },
  fallbackDateButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  fallbackDateButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  sameRegionCard: {
    borderColor: 'rgba(0, 114, 178, 0.5)',
    borderWidth: 1,
  },
  sameRegionBadge: {
    backgroundColor: 'rgba(0, 114, 178, 0.3)',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 4,
  },
  sameRegionText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});