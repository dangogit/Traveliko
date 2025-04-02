import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle, Platform } from 'react-native';

interface BoxShadowViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: { width: number; height: number };
  children: React.ReactNode;
}

export default function BoxShadowView({
  style,
  shadowColor = '#000',
  shadowOpacity = 0.1,
  shadowRadius = 4,
  shadowOffset = { width: 0, height: 2 },
  children,
  ...props
}: BoxShadowViewProps) {
  // For web, convert shadow props to boxShadow
  const webShadow = Platform.OS === 'web' 
    ? { 
        boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(0,0,0,${shadowOpacity})` 
      } 
    : {
        shadowColor,
        shadowOffset,
        shadowOpacity,
        shadowRadius,
      };

  return (
    <View
      style={[webShadow, style]}
      {...props}
    >
      {children}
    </View>
  );
} 