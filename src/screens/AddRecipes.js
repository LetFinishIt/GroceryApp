import React from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import RecipeForm from '../components/RecipeForm';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import {navigate} from "../navigationRef";

// add recipe screen
const AddRecipes = ({ navigation }) => {

  // submit recipe to backend, then navigate to recipe list
  const AddNewRecipes =  async (recipeName, price, description, photo, ingredientList)=>{
    if (recipeName && description && ingredientList.length > 0) {
      const body = {
        recipeName: recipeName,
        description: description, 
        price : price,
        recipePhoto: photo,
        recipeItem: ingredientList,
        isPrivate: false,
        user:  await SecureStore.getItemAsync("userId"),
        userEmail: await SecureStore.getItemAsync("email"),
      }
      
      Api().post("recipe" , body).then((response)=>{
        navigate("RecipeList");
      }).catch((e) => {
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Background image */}
      <ImageBackground
          source={require('../../assets/images/boards.png')}
          resizeMode="cover"
          style={styles.imageContainer}
      >
        {/* Form with new recipe fields */}
        <RecipeForm
          submitButtonText="Create"
          onSubmit={(recipeName, price, description, recipeItem, photo, ingredientList)=>
            { AddNewRecipes(recipeName, price, description, recipeItem , photo, ingredientList);
            }}
        />
      </ImageBackground>
    </View>
  );
};

// Do not display navigation header
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
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

export default AddRecipes;