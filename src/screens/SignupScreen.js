import React, { useContext } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignupScreen = () => {
  const { signup } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <ImageBackground
          source={require('../../assets/images/background.png')}
          resizeMode="cover"
          style={styles.container}
      >
        <KeyboardAwareScrollView>
        <AuthForm
          submitButtonText="Sign Up"
          onSubmit={(email,password,firstName,lastName)=>signup({email,password,firstName,lastName})}
          isSignUp
        />
        <View style={styles.linkContainer}>
          <NavLink
            routeName="Signin"
            text="Already have an account? Sign in instead!"
          />
        </View>
        </KeyboardAwareScrollView>
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
    paddingTop: 15,
    paddingBottom: 15,
  },
  logoImage: {
    height: 200,
    width: '100%',
    alignSelf: 'center',
    marginTop: 50,
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
