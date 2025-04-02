import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';

interface StylePointerEventsViewProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  pointerEventsValue?: 'box-none' | 'none' | 'box-only' | 'auto';
  children: React.ReactNode;
}

export default function StylePointerEventsView({
  style,
  pointerEventsValue = 'auto',
  children,
  ...props
}: StylePointerEventsViewProps) {
  // Apply pointerEvents as a style property instead of a direct prop
  const combinedStyle = StyleSheet.flatten([
    { pointerEvents: pointerEventsValue },
    style || {}
  ]);

  return (
    <View
      style={combinedStyle}
      {...props}
    >
      {children}
    </View>
  );
} 