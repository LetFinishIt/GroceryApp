import React, { useContext } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import RecipeForm from '../components/RecipeForm';
import NavLink from '../components/NavLink';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import {navigate} from "../navigationRef";


const AddRecipes = ({ navigation }) => {
  const { state, signup, clearErrorMessage } = useContext(AuthContext);

  const AddNewRecipes =  async (recipeName, price, description, photo, ingredientList)=>{
    const body = {
      recipeName: recipeName,
      description: description, 
      price : price,
      recipePhoto: photo,
      recipeItem: ingredientList,
      isPrivate: false,
      user:  await SecureStore.getItemAsync("userId"),
    }


   Api().post("recipe" , body).then((response)=>{
      console.log("response.data: ", response.data);
   }).catch((e) => {
    // console.log("e.response: ", e.response);
    console.log("e.message: ", e.message);
    });
  };

  return (
    <View style={styles.container}>
      {/* <NavigationEvents onWillFocus={clearErrorMessage} /> */}
      <ImageBackground
          source={require('../../assets/images/boards.png')}
          resizeMode="cover"
          style={styles.container}
      >
        <RecipeForm
          //headerText="Sign Up for GroList"
          // errorMessage={state.errorMessage}
          submitButtonText="Create"
          onSubmit={(recipeName, price, description, recipeItem, photo, ingredientList)=>
            { AddNewRecipes(recipeName, price, description, recipeItem , photo, ingredientList);
              navigate("RecipeList");
            }}
        />
      </ImageBackground>
    </View>
  );
};

AddRecipes.navigationOptions = () => {
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

export default AddRecipes;