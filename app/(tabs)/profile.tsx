import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useProfileStore } from '@/store/profile-store';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Image } from 'expo-image';
import { 
  User, 
  Settings, 
  LogOut, 
  Edit, 
  Heart, 
  Calendar, 
  MapPin,
  Globe,
  Utensils,
  Clock
} from 'lucide-react-native';
import { interests } from '@/mocks/interests';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, resetProfile } = useProfileStore();
  const { getAllTrips, resetTrips } = useTripStore();
  const { resetFavorites } = useTravelStore();
  
  const trips = getAllTrips();
  const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > new Date()).length;
  
  const handleEditProfile = () => {
    router.push('/profile-setup');
  };
  
  const handleLogout = () => {
    Alert.alert(
      "התנתקות",
      "האם אתה בטוח שברצונך להתנתק?",
      [
        { text: "ביטול", style: "cancel" },
        { 
          text: "התנתק", 
          style: "destructive",
          onPress: () => {
            resetProfile();
            resetTrips();
            resetFavorites();
            router.replace('/onboarding');
          }
        }
      ]
    );
  };
  
  const getTravelerTypeLabel = (type: string) => {
    switch (type) {
      case 'adventure': return 'הרפתקן';
      case 'culture': return 'תרבותי';
      case 'relaxation': return 'רגוע';
      case 'budget': return 'תקציבי';
      case 'luxury': return 'יוקרתי';
      case 'family': return 'משפחתי';
      default: return type;
    }
  };
  
  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case 'low': return 'נמוך';
      case 'medium': return 'בינוני';
      case 'high': return 'גבוה';
      default: return budget;
    }
  };

  // Helper to get Hebrew interest name
  const getInterestHebrewName = (interestId: string): string => {
    const interest = interests.find(i => i.id === interestId);
    return interest ? interest.nameHe : interestId;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' }}
              style={styles.profileImage}
              contentFit="cover"
            />
          </View>
          
          <Text style={styles.profileName}>{profile.name || "משתמש"}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trips.length}</Text>
              <Text style={styles.statLabel}>טיולים</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{upcomingTrips}</Text>
              <Text style={styles.statLabel}>מתוכננים</Text>
            </View>
          </View>
          
          <Pressable style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>ערוך פרופיל</Text>
            <Edit size={16} color={colors.primary} />
          </Pressable>
        </View>
        
        {profile.isProfileComplete && (
          <View style={styles.preferencesCard}>
            <Text style={styles.sectionTitle}>העדפות טיול</Text>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceLabel}>סוג מטייל</Text>
                <Text style={styles.preferenceValue}>{getTravelerTypeLabel(profile.travelerType)}</Text>
              </View>
              <User size={20} color={colors.primary} />
            </View>
            
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceContent}>
                <Text style={styles.preferenceLabel}>תקציב</Text>
                <Text style={styles.preferenceValue}>{getBudgetLabel(profile.budget)}</Text>
              </View>
              <Globe size={20} color={colors.primary} />
            </View>
            
            {profile.dietaryRestrictions && profile.dietaryRestrictions.length > 0 && (
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceContent}>
                  <Text style={styles.preferenceLabel}>הגבלות תזונה</Text>
                  <Text style={styles.preferenceValue}>{profile.dietaryRestrictions.join(', ')}</Text>
                </View>
                <Utensils size={20} color={colors.primary} />
              </View>
            )}
            
            {profile.travelDuration && (
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceContent}>
                  <Text style={styles.preferenceLabel}>משך טיול מועדף</Text>
                  <Text style={styles.preferenceValue}>{profile.travelDuration}</Text>
                </View>
                <Clock size={20} color={colors.primary} />
              </View>
            )}
            
            {profile.interests && profile.interests.length > 0 && (
              <View style={styles.interestsContainer}>
                <Text style={styles.interestsLabel}>תחומי עניין</Text>
                <View style={styles.interestTags}>
                  {profile.interests.map((interestId, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestTagText}>{getInterestHebrewName(interestId)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.actionsCard}>
          <Pressable style={styles.actionButton} onPress={() => router.push('/trips')}>
            <Text style={styles.actionButtonText}>הטיולים שלי</Text>
            <Calendar size={20} color={colors.text} />
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={() => router.push('/favorites')}>
            <Text style={styles.actionButtonText}>המועדפים שלי</Text>
            <Heart size={20} color={colors.text} />
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={() => router.push('/settings')}>
            <Text style={styles.actionButtonText}>הגדרות</Text>
            <Settings size={20} color={colors.text} />
          </Pressable>
          
          <Pressable style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>התנתק</Text>
            <LogOut size={20} color={colors.notification} />
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '500',
    marginRight: 6,
  },
  preferencesCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  preferenceItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  preferenceContent: {
    alignItems: 'flex-end',
  },
  preferenceLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  interestsContainer: {
    marginTop: 8,
  },
  interestsLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 8,
    textAlign: 'right',
  },
  interestTags: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: colors.primaryMuted,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  interestTagText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  actionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    borderBottomWidth: 0, // No border for the last item
  },
  logoutButtonText: {
    fontSize: 16,
    color: colors.notification, // Use notification color for logout
    fontWeight: '500',
  },
}); 