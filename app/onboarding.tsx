import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  Pressable, 
  Image,
  Dimensions,
  FlatList,
  I18nManager
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useProfileStore } from '@/store/profile-store';
import colors from '@/constants/colors';
import { ArrowLeft, Check, Map, Compass, Camera, Utensils, Hotel, Plane, Globe, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  features?: string[];
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: 'ברוכים הבאים לאפליקציית הטיולים',
      description: 'גלה מקומות חדשים, תכנן טיולים ושתף חוויות עם חברים',
      image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1000&auto=format&fit=crop',
      icon: <Globe size={32} color={colors.primary} />,
      features: [
        'מידע מקיף על יעדים ברחבי העולם',
        'תכנון מסלולים מותאם אישית',
        'המלצות מקומיות מטיילים אחרים'
      ]
    },
    {
      id: '2',
      title: 'מידע מקיף על יעדים',
      description: 'קבל מידע מפורט על מדינות, ערים, אטרקציות, מסעדות ועוד',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1000&auto=format&fit=crop',
      icon: <Map size={32} color={colors.primary} />,
      features: [
        'מידע על מזג האוויר בזמן אמת',
        'טיפים מקומיים ומידע תרבותי',
        'שעות פתיחה ומחירי כניסה'
      ]
    },
    {
      id: '3',
      title: 'תכנון טיולים חכם',
      description: 'תכנן את הטיול שלך בקלות עם המלצות מותאמות אישית',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop',
      icon: <Compass size={32} color={colors.primary} />,
      features: [
        'יצירת מסלולים יומיים מותאמים אישית',
        'ניהול לוח זמנים וסנכרון עם יומן',
        'חישוב מרחקים וזמני נסיעה'
      ]
    },
    {
      id: '4',
      title: 'חוויות מקומיות',
      description: 'גלה אטרקציות, מסעדות ופעילויות מומלצות בכל יעד',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
      icon: <Camera size={32} color={colors.primary} />,
      features: [
        'המלצות על אטרקציות מקומיות',
        'סיורים קולינריים ומסעדות מומלצות',
        'פעילויות ייחודיות מחוץ למסלול התיירותי'
      ]
    },
    {
      id: '5',
      title: 'אוכל ולינה',
      description: 'מצא את המסעדות והמלונות הטובים ביותר בכל יעד',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1000&auto=format&fit=crop',
      icon: <Utensils size={32} color={colors.primary} />,
      features: [
        'המלצות על מסעדות מקומיות',
        'אפשרויות לינה לכל תקציב',
        'ביקורות והמלצות מטיילים אחרים'
      ]
    },
    {
      id: '6',
      title: 'תחבורה וניידות',
      description: 'מידע על אפשרויות תחבורה, השכרת רכב ותחבורה ציבורית',
      image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?q=80&w=1000&auto=format&fit=crop',
      icon: <Plane size={32} color={colors.primary} />,
      features: [
        'מידע על תחבורה ציבורית מקומית',
        'השוואת מחירי השכרת רכב',
        'טיפים לניווט בערים זרות'
      ]
    },
    {
      id: '7',
      title: 'בואו נתחיל!',
      description: 'הגדר את הפרופיל שלך כדי לקבל המלצות מותאמות אישית',
      image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=1000&auto=format&fit=crop',
      icon: <Users size={32} color={colors.primary} />,
      features: [
        'התאמה אישית לסגנון הטיול שלך',
        'שמירת מקומות מועדפים',
        'יצירת מסלולים מותאמים אישית'
      ]
    }
  ];
  
  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = () => {
    updateProfile({ hasSeenOnboarding: true });
    router.replace('/profile-setup');
  };
  
  const handleSkip = () => {
    updateProfile({ hasSeenOnboarding: true });
    router.replace('/profile-setup');
  };
  
  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slideContainer}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.slideImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />
      </View>
      
      <View style={styles.slideContent}>
        <View style={styles.iconContainer}>
          {item.icon}
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
        
        {item.features && (
          <View style={styles.featuresContainer}>
            {item.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureText}>{feature}</Text>
                <Check size={16} color={colors.primary} style={styles.featureIcon} />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
  
  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <Pressable 
          key={index} 
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot
          ]} 
          onPress={() => {
            setCurrentIndex(index);
            flatListRef.current?.scrollToIndex({ index, animated: true });
          }}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false
      }} />
      
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />
      
      {renderDots()}
      
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>דלג</Text>
        </Pressable>
        
        <Pressable 
          style={styles.nextButton} 
          onPress={handleNext}
        >
          {currentIndex === slides.length - 1 ? (
            <>
              <Check size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.nextButtonText}>התחל</Text>
            </>
          ) : (
            <>
              <ArrowLeft size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.nextButtonText}>הבא</Text>
            </>
          )}
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
  slideContainer: {
    width,
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: '50%',
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  slideContent: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'flex-end',
    width: '100%',
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  featureIcon: {
    marginLeft: 8,
    marginRight: 0,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
    marginRight: 0,
  }
});