import React from 'react';
import { View, StyleSheet } from 'react-native';

// reusable component to space out the UI
const Spacer = ({ children }) => {
  return <View style={styles.spacer}>{children}</View>;
};

const styles = StyleSheet.create({
  spacer: {
    margin: 5
  }
});

export default Spacer;
