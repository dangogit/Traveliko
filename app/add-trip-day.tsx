import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  I18nManager
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Calendar, MapPin, Check, ChevronDown, X } from 'lucide-react-native';
import { Location } from '@/types/travel';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

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

export default function AddTripDayScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const router = useRouter();
  const { createTripDay, getTripById } = useTripStore();
  const { locations } = useTravelStore();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [locationId, setLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  
  const trip = getTripById(tripId);
  
  // Filter locations based on search query
  const filteredLocations = locations.filter(location => {
    const matchesSearch = 
      location.nameHe.includes(searchQuery) || 
      location.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If trip has countries, filter by those countries
    if (trip && trip.countries.length > 0) {
      return matchesSearch && trip.countries.includes(location.countryId);
    }
    
    return matchesSearch;
  });
  
  const handleCreateDay = () => {
    if (!selectedDate) {
      Alert.alert('שגיאה', 'יש להזין תאריך');
      return;
    }
    
    if (!locationId) {
      Alert.alert('שגיאה', 'יש לבחור מיקום');
      return;
    }
    
    const dayId = createTripDay({
      tripId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      locationId,
      notes: notes.trim() || undefined
    });
    
    router.replace(`/trip/${tripId}`);
  };
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "הוסף יום לטיול",
        headerLeft: () => <BackButton />,
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>תאריך</Text>
          <Pressable 
            style={styles.dateInputContainer}
            onPress={() => setShowCalendar(true)}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.dateInput, !selectedDate && styles.dateInputPlaceholder]}>
              {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: he }) : 'בחר תאריך'}
            </Text>
            <ChevronDown size={20} color={colors.muted} />
          </Pressable>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>מיקום</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="חפש מיקום..."
            placeholderTextColor={colors.muted}
            textAlign="right"
          />
          
          <ScrollView style={styles.locationsContainer} nestedScrollEnabled>
            {filteredLocations.map((location: Location) => (
              <Pressable
                key={location.id}
                style={[
                  styles.locationItem,
                  locationId === location.id && styles.selectedLocationItem
                ]}
                onPress={() => setLocationId(location.id)}
              >
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.nameHe}</Text>
                  <Text style={styles.locationCountry}>
                    {useTravelStore.getState().getCountryById(location.countryId)?.nameHe || ''}
                  </Text>
                </View>
                {locationId === location.id && (
                  <Check size={20} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>הערות (אופציונלי)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="הזן הערות ליום זה..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={4}
            textAlign="right"
            textAlignVertical="top"
          />
        </View>
        
        <Pressable style={styles.createButton} onPress={handleCreateDay}>
          <Text style={styles.createButtonText}>הוסף יום</Text>
        </Pressable>
      </ScrollView>
      
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>בחר תאריך</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowCalendar(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <CalendarPicker 
              selectedDate={selectedDate} 
              onSelectDate={handleSelectDate}
              onClose={() => setShowCalendar(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  saveButton: {
    padding: 8,
  },
  formGroup: {
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    textAlign: 'right',
  },
  dateInputPlaceholder: {
    color: colors.muted,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    textAlign: 'right',
    width: '100%',
  },
  locationsContainer: {
    maxHeight: 200,
    width: '100%',
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedLocationItem: {
    borderColor: colors.primary,
  },
  locationInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'right',
  },
  locationCountry: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
  },
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    textAlign: 'right',
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
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