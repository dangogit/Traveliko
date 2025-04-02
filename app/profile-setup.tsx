import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  Pressable, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useProfileStore } from '@/store/profile-store';
import colors from '@/constants/colors';
import { ArrowLeft, Check } from 'lucide-react-native';
import StepIndicator from '@/components/StepIndicator';
import ProfileTypeSelector from '@/components/ProfileTypeSelector';
import InterestSelector from '@/components/InterestSelector';
import BudgetSelector from '@/components/BudgetSelector';
import { TravelerType } from '@/types/travel';

interface Step {
  id: number;
  title: string;
}

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { profile, updateProfile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState(profile.name || '');
  const [travelerType, setTravelerType] = useState<TravelerType>(profile.travelerType || 'solo');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests || []);
  const [budget, setBudget] = useState<'low' | 'medium' | 'high'>(profile.budget || 'medium');
  
  const steps: Step[] = [
    { id: 1, title: 'פרטים אישיים' },
    { id: 2, title: 'סוג מטייל' },
    { id: 3, title: 'תחומי עניין' },
    { id: 4, title: 'תקציב' }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    updateProfile({
      name,
      travelerType,
      interests: selectedInterests,
      budget,
      isProfileComplete: true
    });
    router.replace('/');
  };
  
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  
  const isNextDisabled = () => {
    if (currentStep === 1 && !name.trim()) return true;
    if (currentStep === 3 && selectedInterests.length === 0) return true;
    return false;
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>שם</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="הכנס את שמך"
              placeholderTextColor={colors.muted}
              textAlign="right"
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>איך אתה מטייל בדרך כלל?</Text>
            <ProfileTypeSelector
              selectedType={travelerType}
              onSelect={setTravelerType}
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>מה מעניין אותך בטיולים?</Text>
            <Text style={styles.sublabel}>בחר לפחות אחד</Text>
            <InterestSelector
              selectedInterests={selectedInterests}
              onToggle={toggleInterest}
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.label}>מה התקציב שלך לטיולים?</Text>
            <BudgetSelector
              selectedBudget={budget}
              onSelect={setBudget}
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false
      }} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>הגדרת פרופיל</Text>
            <Text style={styles.subtitle}>
              עזור לנו להתאים את החוויה שלך
            </Text>
          </View>
          
          <StepIndicator steps={steps} currentStep={currentStep} />
          
          {renderStepContent()}
        </ScrollView>
        
        <View style={styles.buttonsContainer}>
          {currentStep > 1 && (
            <Pressable style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={20} color={colors.text} style={styles.buttonIcon} />
              <Text style={styles.backButtonText}>חזור</Text>
            </Pressable>
          )}
          
          <Pressable 
            style={[
              styles.nextButton,
              isNextDisabled() && styles.disabledButton
            ]} 
            onPress={handleNext}
            disabled={isNextDisabled()}
          >
            {currentStep === steps.length ? (
              <>
                <Check size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.nextButtonText}>סיים</Text>
              </>
            ) : (
              <>
                <ArrowLeft size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.nextButtonText}>הבא</Text>
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'right',
  },
  stepContent: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  sublabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 16,
    marginTop: -8,
    textAlign: 'right',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.text,
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
  disabledButton: {
    backgroundColor: colors.border,
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