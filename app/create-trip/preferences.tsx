import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  Switch,
  Alert,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useProfileStore } from '@/store/profile-store';
import colors from '@/constants/colors';
import { ArrowRight, ArrowLeft, User, Settings } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import ProfileTypeSelector from '@/components/ProfileTypeSelector';
import BudgetSelector from '@/components/BudgetSelector';
import InterestSelector from '@/components/InterestSelector';
import OptionSelector from '@/components/OptionSelector';
import { TravelerType } from '@/types/travel';
import BackButton from '@/components/BackButton';
import { interests } from '@/mocks/interests';
import { LinearGradient } from 'expo-linear-gradient';

// Define missing types
type AccommodationType = 'hotel' | 'hostel' | 'apartment' | 'camping';
type TransportationType = 'public' | 'rental' | 'taxi' | 'walking';

export default function TripPreferencesScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const { setTripPreferences } = useTripStore();
  
  const [useExistingProfile, setUseExistingProfile] = useState(profile.isProfileComplete);
  const [travelerType, setTravelerType] = useState<TravelerType>(profile.travelerType || 'solo');
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>(profile.budget || 'medium');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([...profile.interests]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<AccommodationType[]>([...(profile.preferredAccommodation || []) as AccommodationType[]]);
  const [selectedTransportation, setSelectedTransportation] = useState<TransportationType[]>([...(profile.preferredTransportation || []) as TransportationType[]]);
  
  const steps = [
    { id: 1, title: "נקודת התחלה" },
    { id: 2, title: "מדינות לביקור" },
    { id: 3, title: "נקודת סיום" },
    { id: 4, title: "העדפות" },
    { id: 5, title: "סיכום" }
  ];
  
  const accommodationOptions = [
    { value: 'hotel', label: 'מלון' },
    { value: 'hostel', label: 'אכסניה' },
    { value: 'apartment', label: 'דירה' },
    { value: 'camping', label: 'קמפינג' }
  ];
  
  const transportationOptions = [
    { value: 'public', label: 'תחבורה ציבורית' },
    { value: 'rental', label: 'רכב שכור' },
    { value: 'taxi', label: 'מונית' },
    { value: 'walking', label: 'הליכה' }
  ];
  
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const handleAccommodationToggle = (option: string) => {
    const typedOption = option as AccommodationType;
    if (selectedAccommodation.includes(typedOption)) {
      setSelectedAccommodation(selectedAccommodation.filter(o => o !== typedOption));
    } else {
      setSelectedAccommodation([...selectedAccommodation, typedOption]);
    }
  };
  
  const handleTransportationToggle = (option: string) => {
    const typedOption = option as TransportationType;
    if (selectedTransportation.includes(typedOption)) {
      setSelectedTransportation(selectedTransportation.filter(o => o !== typedOption));
    } else {
      setSelectedTransportation([...selectedTransportation, typedOption]);
    }
  };
  
  const validatePreferences = () => {
    if (!travelerType) {
      Alert.alert('שגיאה', 'יש לבחור סוג מטייל');
      return false;
    }
    
    if (selectedAccommodation.length === 0) {
      Alert.alert('שגיאה', 'יש לבחור לפחות סוג אחד של לינה');
      return false;
    }
    
    if (selectedTransportation.length === 0) {
      Alert.alert('שגיאה', 'יש לבחור לפחות סוג אחד של תחבורה');
      return false;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (!validatePreferences()) {
      return;
    }
    
    // Save trip preferences
    setTripPreferences({
      travelerType,
      budget,
      interests: selectedInterests,
      accommodation: selectedAccommodation,
      transportation: selectedTransportation
    });
    
    // Update profile if needed
    if (!useExistingProfile) {
      updateProfile({
        travelerType,
        budget,
        interests: selectedInterests,
        preferredAccommodation: selectedAccommodation,
        preferredTransportation: selectedTransportation,
        isProfileComplete: true
      });
    }
    
    router.push('/create-trip/summary');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  // Helper to get Hebrew interest name
  const getInterestHebrewName = (interestId: string): string => {
    const interest = interests.find(i => i.id === interestId);
    return interest ? interest.nameHe : interestId;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "העדפות טיול",
        headerLeft: () => <BackButton />
      }} />
      
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1000" }} 
        style={styles.backgroundImage} 
        blurRadius={20}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.85)', 'rgba(255,255,255,0.95)']}
        style={styles.gradient}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StepIndicator steps={steps} currentStep={4} />
        
        {profile.isProfileComplete && (
          <View style={styles.profileToggleContainer}>
            <Text style={styles.profileToggleLabel}>השתמש בפרופיל הקיים שלי</Text>
            <Switch
              value={useExistingProfile}
              onValueChange={setUseExistingProfile}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="white"
            />
          </View>
        )}
        
        {!useExistingProfile && (
          <>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <User size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>סוג מטייל</Text>
              </View>
              <Text style={styles.sectionDescription}>בחר את סוג הטיול שמתאים לך</Text>
              
              <ProfileTypeSelector
                selectedType={travelerType}
                onSelect={setTravelerType}
              />
            </View>
            
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Settings size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>תקציב</Text>
              </View>
              <Text style={styles.sectionDescription}>בחר את רמת התקציב המתאימה לך</Text>
              
              <BudgetSelector
                selectedBudget={budget}
                onSelect={setBudget}
              />
            </View>
            
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Settings size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>תחומי עניין</Text>
              </View>
              <Text style={styles.sectionDescription}>בחר את תחומי העניין שלך</Text>
              
              <InterestSelector
                selectedInterests={selectedInterests}
                onToggle={handleInterestToggle}
              />
            </View>
            
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Settings size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>לינה מועדפת</Text>
              </View>
              <Text style={styles.sectionDescription}>בחר את סוגי הלינה המועדפים עליך</Text>
              
              <OptionSelector
                options={accommodationOptions}
                selectedOptions={selectedAccommodation}
                onToggle={handleAccommodationToggle}
              />
            </View>
            
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Settings size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>תחבורה מועדפת</Text>
              </View>
              <Text style={styles.sectionDescription}>בחר את סוגי התחבורה המועדפים עליך</Text>
              
              <OptionSelector
                options={transportationOptions}
                selectedOptions={selectedTransportation}
                onToggle={handleTransportationToggle}
              />
            </View>
          </>
        )}
        
        {useExistingProfile && (
          <View style={styles.profileSummaryCard}>
            <Text style={styles.profileSummaryTitle}>פרופיל נוכחי</Text>
            
            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>סוג מטייל:</Text>
              <Text style={styles.profileItemValue}>
                {travelerType === 'solo' ? 'לבד' : 
                 travelerType === 'couple' ? 'זוג' : 
                 travelerType === 'family' ? 'משפחה' : 
                 travelerType === 'friends' ? 'חברים' : 'עסקים'}
              </Text>
            </View>
            
            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>תקציב:</Text>
              <Text style={styles.profileItemValue}>
                {budget === 'low' ? 'חסכוני' : 
                 budget === 'medium' ? 'בינוני' : 'גבוה'}
              </Text>
            </View>
            
            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>תחומי עניין:</Text>
              <Text style={styles.profileItemValue}>
                {profile.interests.map((interestId: string) => getInterestHebrewName(interestId)).join(', ') || 'לא נבחרו'}
              </Text>
            </View>
            
            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>לינה מועדפת:</Text>
              <Text style={styles.profileItemValue}>
                {profile.preferredAccommodation.map((acc: string) => 
                  acc === 'hotel' ? 'מלון' : 
                  acc === 'hostel' ? 'אכסניה' : 
                  acc === 'apartment' ? 'דירה' : 'קמפינג'
                ).join(', ')}
              </Text>
            </View>
            
            <View style={styles.profileItem}>
              <Text style={styles.profileItemLabel}>תחבורה מועדפת:</Text>
              <Text style={styles.profileItemValue}>
                {profile.preferredTransportation.map((trans: string) => 
                  trans === 'public' ? 'תחבורה ציבורית' : 
                  trans === 'rental' ? 'רכב שכור' : 
                  trans === 'taxi' ? 'מונית' : 'הליכה'
                ).join(', ')}
              </Text>
            </View>
            
            <Pressable 
              style={styles.editProfileButton}
              onPress={() => setUseExistingProfile(false)}
            >
              <Text style={styles.editProfileButtonText}>ערוך העדפות לטיול זה</Text>
            </Pressable>
          </View>
        )}
        
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileToggleLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 16,
  },
  profileSummaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileItemLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  profileItemValue: {
    fontSize: 16,
    color: colors.muted,
    maxWidth: '60%',
    textAlign: 'right',
  },
  editProfileButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editProfileButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
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