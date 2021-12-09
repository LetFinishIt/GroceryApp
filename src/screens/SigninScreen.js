import React, { useContext } from 'react';
import { View, StyleSheet, Text , Image, ImageBackground } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
//import { Context } from '../context/AuthContext';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import {navigate} from "../navigationRef";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

function SigninScreen({navigator}) {
  //const { state, signin, clearErrorMessage } = useContext(Context);
  
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
      console.log("response.data: ", response.data.user);
      saveAuthInfo(response.data.accessToken, response.data.refreshToken, response.data.user);
    })
    .catch((e) => {
      // console.log("e.response: ", e.response);
      console.log("e.message: ", e.message);
    });
  }

  const saveAuthInfo = async (accessToken, refreshToken, user) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("firstName", user.firstName);
    await SecureStore.setItemAsync("lastName", user.last_name);
    await SecureStore.setItemAsync("email", user.email);
    await SecureStore.setItemAsync("userId", user._id);
    console.log("await SecureStore.getItemAsync('accessToken'): ", await SecureStore.getItemAsync("accessToken"))
    console.log("await SecureStore.getItemAsync('refreshToken'): ", await SecureStore.getItemAsync("refreshToken"))
    console.log("await SecureStore.getItemAsync('firstName'): ", await SecureStore.getItemAsync("firstName"))
    console.log("await SecureStore.getItemAsync('lastName'): ", await SecureStore.getItemAsync("lastName"))
    console.log("await SecureStore.getItemAsync('email'): ", await SecureStore.getItemAsync("email"))
    console.log("await SecureStore.getItemAsync('userId'): ", await SecureStore.getItemAsync("userId"))
    navigate("RecipeList");
  }

  return (
    <View style={styles.container}>
      {/* <NavigationEvents onWillFocus={clearErrorMessage} /> */}
      <ImageBackground
          source={require('../../assets/images/background.png')}
          resizeMode="cover"
          style={styles.container}
      >
        <KeyboardAwareScrollView>
      <AuthForm
        //headerText="Sign In to Your Account"
        // errorMessage={state.errorMessage}
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
