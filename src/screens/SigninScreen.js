import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import {navigate} from "../navigationRef";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function SigninScreen({}) {
  
  const handleLogin = async (email, password) => {
    const body = {
      email: email,
      password: password
    }

    Api()
    .post("login", body, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      saveAuthInfo(response.data.accessToken, response.data.refreshToken, response.data.user);
    })
    .catch((e) => {
    });
  }

  const saveAuthInfo = async (accessToken, refreshToken, user) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("firstName", user.firstName);
    await SecureStore.setItemAsync("lastName", user.last_name);
    await SecureStore.setItemAsync("email", user.email);
    await SecureStore.setItemAsync("userId", user._id);
    navigate("RecipeList");
  }

  return (
    <View style={styles.container}>
      <ImageBackground
          source={require('../../assets/images/background.png')}
          resizeMode="cover"
          style={styles.container}
      >
        <KeyboardAwareScrollView>
      <AuthForm
        onSubmit={(email, password, firstName, lastName) => handleLogin(email, password)}
        submitButtonText="Sign In"
      />
      <View style={styles.linkContainer}>
        <NavLink
          text="Dont have an account? Sign up"
          routeName="Signup"
        />
      </View>
      </KeyboardAwareScrollView>
      </ImageBackground>
    </View>
  );
};

SigninScreen.navigationOptions = {
  header: () => false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    height: "100%",
    paddingTop: 15,
    paddingBottom: 15,
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

export default SigninScreen;
