import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';

interface PointerEventsViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  children: React.ReactNode;
}

export default function PointerEventsView({
  style,
  pointerEvents,
  children,
  ...props
}: PointerEventsViewProps) {
  // Process style to include pointerEvents
  const combinedStyle = {
    pointerEvents: pointerEvents || 'auto',
    ...StyleSheet.flatten(style || {})
  };

  return (
    <View
      style={combinedStyle}
      {...props}
    >
      {children}
    </View>
  );
} 