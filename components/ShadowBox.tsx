import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle, Platform } from 'react-native';

interface ShadowBoxProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  elevation?: number;
  shadowColor?: string;
  shadowOpacity?: number;
  shadowRadius?: number;
  shadowOffset?: { width: number; height: number };
  children: React.ReactNode;
}

export default function ShadowBox({
  style,
  elevation = 2,
  shadowColor = '#000',
  shadowOpacity = 0.1,
  shadowRadius = 4,
  shadowOffset = { width: 0, height: 2 },
  children,
  ...props
}: ShadowBoxProps) {
  return (
    <View
      style={[
        {
          elevation,
          // Use boxShadow instead of shadow* properties
          ...(Platform.OS === 'web' ? {
            boxShadow: `${shadowOffset.width}px ${shadowOffset.height}px ${shadowRadius}px rgba(0,0,0,${shadowOpacity})`,
          } : {
            shadowColor,
            shadowOffset,
            shadowOpacity,
            shadowRadius,
          })
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
} 