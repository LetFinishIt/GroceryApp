import React, { useContext } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import Api from '../api/apiInstance';

const SignupScreen = ({ navigation }) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {/* <NavigationEvents onWillFocus={clearErrorMessage} /> */}
      <ImageBackground
          source={require('../../assets/images/background.png')}
          resizeMode="cover"
          style={styles.container}
      >
        <AuthForm
          //headerText="Sign Up for GroList"
          // errorMessage={state.errorMessage}
          submitButtonText="Sign Up"
          onSubmit={(email,password,firstName,lastName)=>signup({email,password,firstName,lastName})}
          isSignUp
        />
        <NavLink
          routeName="Signin"
          text="Already have an account? Sign in instead!"
        />
      </ImageBackground>
    </View>
  );
};

SignupScreen.navigationOptions = () => {
  return {
    header: () => false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoImage: {
    height: 200,
    width: '100%',
    alignSelf: 'center',
    marginTop: 50,
    //backgroundColor: 'black',
},
});

export default SignupScreen;
