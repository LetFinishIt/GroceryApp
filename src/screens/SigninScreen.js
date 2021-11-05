import React, { useContext } from 'react';
import { View, StyleSheet, Text , Image, ImageBackground } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
//import { Context } from '../context/AuthContext';

const SigninScreen = () => {
  //const { state, signin, clearErrorMessage } = useContext(Context);

  return (
    <View style={styles.container}>
      {/* <NavigationEvents onWillFocus={clearErrorMessage} /> */}
      <ImageBackground
          source={require('../../assets/images/background.png')}
          resizeMode="cover"
          style={styles.container}
      >
      <AuthForm
        //headerText="Sign In to Your Account"
        // errorMessage={state.errorMessage}
        //onSubmit={signin}
        submitButtonText="Sign In"
      />
      <NavLink
        text="Dont have an account? Sign up instead"
        routeName="Signup"
      />
      <NavLink
        text="View Recipe UI For now"
        routeName="RecipeList"
      />
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
    //marginBottom: 250,
  },
  logoImage: {
        height: 200,
        width: 200,
        alignSelf: 'center',
        marginTop: 50,
        //backgroundColor: 'black',
  },
});

export default SigninScreen;
