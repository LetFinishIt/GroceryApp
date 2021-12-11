import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Spacer from './Spacer';
import { withNavigation } from 'react-navigation';

// reusable component for linking text. Used in sign up and sign in screens
const NavLink = ({ navigation, text, routeName }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(routeName)}>
      <Spacer>
        <Text style={styles.link}>{text}</Text>
      </Spacer>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    fontSize: 16,
    fontWeight: "bold",
    color: 'white'
  }
});

export default withNavigation(NavLink);
