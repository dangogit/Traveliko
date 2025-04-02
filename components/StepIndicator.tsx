import React from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import colors from '@/constants/colors';
import { Step } from '@/types/travel';

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  // Icons or emojis to represent each step (optional)
  const stepIcons = ['🚀', '🗺️', '🏁', '⚙️', '📝'];
  
  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground} />
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${(Math.max(1, currentStep - 1) / (steps.length - 1)) * 100}%`,
            }
          ]} 
        />
      </View>
      
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isActive = step.id <= currentStep;
          const isCurrent = step.id === currentStep;
          
          return (
            <View 
              key={step.id} 
              style={[
                styles.stepContainer,
                { width: `${100 / steps.length}%` }
              ]}
            >
              <View 
                style={[
                  styles.stepCircle,
                  isActive && styles.activeStepCircle,
                  isCurrent && styles.currentStepCircle,
                ]}
              >
                {isActive && (
                  <View style={styles.innerCircle}>
                    <Text style={styles.stepIcon}>{stepIcons[index] || step.id}</Text>
                  </View>
                )}
                {!isActive && (
                  <Text style={styles.stepNumber}>{step.id}</Text>
                )}
              </View>
              
              <Text 
                style={[
                  styles.stepTitle,
                  isActive && styles.activeStepTitle,
                  isCurrent && styles.currentStepTitle,
                ]}
                numberOfLines={2}
              >
                {step.title}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    paddingHorizontal: 8,
  },
  progressBarContainer: {
    height: 6,
    width: '90%',
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 16,
    position: 'relative',
    alignSelf: 'center',
    marginTop: 10,
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  progressBar: {
    height: '100%',
    position: 'absolute',
    left: 0,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeStepCircle: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  currentStepCircle: {
    transform: [{ scale: 1.1 }],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  innerCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  stepIcon: {
    fontSize: 16,
  },
  stepTitle: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    maxWidth: 80,
  },
  activeStepTitle: {
    color: colors.text,
    fontWeight: '500',
  },
  currentStepTitle: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});