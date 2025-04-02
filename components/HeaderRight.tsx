import React from 'react';
import { StyleSheet, View } from 'react-native';
import MenuButton from './MenuButton';

export default function HeaderRight() {
  return (
    <View style={styles.container}>
      <MenuButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    zIndex: 100,
  },
});