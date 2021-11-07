import React, { useContext } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { NavigationEvents } from 'react-navigation';
//import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';

const SignupScreen = ({ navigation }) => {
  //const { state, signup, clearErrorMessage } = useContext(AuthContext);

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
          //onSubmit={signup}
          isSignUp
        />
        <View style={styles.linkContainer}>
          <NavLink
            routeName="Signin"
            text="Already have an account? Sign in instead!"
          />
        </View>
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
  linkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 10
  },
});

export default SignupScreen;
