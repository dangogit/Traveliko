import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Pressable,
  ActivityIndicator,
  Image,
  Dimensions
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useProfileStore } from '@/store/profile-store';
import colors from '@/constants/colors';
import { ArrowRight, Plane, Globe, Map, Calendar, Settings } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import BackButton from '@/components/BackButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CreateTripScreen() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const { resetTripPlanning } = useTripStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reset trip planning state when starting a new trip
  useEffect(() => {
    resetTripPlanning();
  }, []);

  // Check if user has completed profile setup
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // If profile is not complete, redirect to profile setup first
      if (!profile.isProfileComplete) {
        router.push({
          pathname: '/profile-setup',
          params: { returnTo: 'create-trip' }
        });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [profile, router]);

  const steps = [
    { id: 1, title: "נקודת התחלה" },
    { id: 2, title: "מדינות לביקור" },
    { id: 3, title: "נקודת סיום" },
    { id: 4, title: "העדפות" },
    { id: 5, title: "סיכום" }
  ];

  const handleStartPlanning = () => {
    router.push('/create-trip/start-point');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Stack.Screen options={{ 
          title: "טוען...",
          headerLeft: () => <BackButton />
        }} />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>טוען...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "תכנון טיול חדש",
        headerLeft: () => <BackButton />
      }} />
      
      <Image 
        source={{ uri: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000" }} 
        style={styles.backgroundImage} 
        blurRadius={15}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.95)']}
        style={styles.gradient}
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>בואו נתכנן את החוויה שלך</Text>
          <Text style={styles.subtitle}>
            מסע מותאם אישית לטיול שלא תשכח
          </Text>
        </View>
        
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>איך זה עובד?</Text>
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, {backgroundColor: '#E3F5FF'}]}>
              <Plane size={20} color="#0693E3" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoNumber}>1</Text>
              <Text style={styles.infoText}>ספר לנו מאיפה אתה מתחיל ומתי</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, {backgroundColor: '#FFF5D0'}]}>
              <Globe size={20} color="#F9A826" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoNumber}>2</Text>
              <Text style={styles.infoText}>בחר מדינות שתרצה לבקר בהן</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, {backgroundColor: '#FFE5E5'}]}>
              <Map size={20} color="#FF6B6B" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoNumber}>3</Text>
              <Text style={styles.infoText}>בחר את נקודת הסיום (אופציונלי)</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, {backgroundColor: '#E5F8ED'}]}>
              <Settings size={20} color="#38C172" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoNumber}>4</Text>
              <Text style={styles.infoText}>בחר את סגנון הטיול והתקציב שלך</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconContainer, {backgroundColor: '#F5E1FF'}]}>
              <Calendar size={20} color="#9C27B0" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoNumber}>5</Text>
              <Text style={styles.infoText}>קבל תכנית טיול מותאמת אישית עם המלצות</Text>
            </View>
          </View>
        </View>
        
        <Pressable onPress={handleStartPlanning}>
          <LinearGradient
            colors={[colors.primary, '#006199']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>בוא נתחיל במסע</Text>
            <ArrowRight size={20} color="white" />
          </LinearGradient>
        </Pressable>
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
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 24,
    marginTop: 20,
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  startButton: {
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  }
});