import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity, View, ImageBackground, Switch,  RefreshControl} from "react-native";
import { Card, Icon, Avatar, Button, SearchBar } from "react-native-elements";
import Api from '../api/apiInstance';
import {navigate} from "../navigationRef";
import { connect } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';

// Landing screen with list of recipes
const RecipeList = ({ selectedRecipes, setSelectedRecipes }) => {
  const [recipeList, setRecipeList] = useState([]);
  const [viewGlobalRecipes, setViewGlobalRecipes] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // select recipe to be included in grocery list generation. If recipe is already selected, increment count
  const selectRecipe = (recipe) => {
    let existingSelectedRecipe = selectedRecipes.find(selectedRecipe => selectedRecipe.recipe._id === recipe._id);
    if (existingSelectedRecipe) {
      existingSelectedRecipe.quantity ++;
      let otherSelectedRecipes = selectedRecipes.filter(selectedRecipe => selectedRecipe.recipe._id !== recipe._id);
      setSelectedRecipes([...otherSelectedRecipes, existingSelectedRecipe]);
    }
    else {
      let newSelectedRecipe = {
        recipe: recipe,
        quantity: 1
      }
      setSelectedRecipes([...selectedRecipes, newSelectedRecipe])
    }
  }

  // Card for each recipe item. Shows title, price, and either picture or placeholder picture
  const RecipeCard = recipe => {
    return (
      <TouchableOpacity  
      onPress={() =>
        navigate("RecipeDetails", {recipeId: recipe._id})
      }>
      <Card containerStyle={{borderRadius: 10, backgroundColor:'#dce2e3'}}>
        <View style={{flexDirection: 'row'}}>
        <Avatar  size="large" rounded 
          source={recipe.recipePhoto ? 
            {uri : recipe.recipePhoto} : 
            {uri : "https://www.thefrenchcookingacademy.com/wp-content/themes/neptune-by-osetin/assets/img/placeholder.jpg"}} />
        <View style={styles.recipeInfo}>
        <Card.Title>{recipe.recipeName}</Card.Title>
        <View style={{flexDirection: 'row'}}>
        <Icon name='pricetag-outline' type='ionicon' color='red'/>
        <Card.Title style={{color:'red'}}>{recipe.price}</Card.Title>
        <Button title={"Add"} buttonStyle={{backgroundColor: '#ed288e'}} containerStyle={styles.newRecipeButton} onPress={() => selectRecipe(recipe)}/>
        </View>
        </View>
        </View>
      </Card>
      </TouchableOpacity>
    );
  };

  // if toggle is set to display global recipes, show all publicly visible recipes. Else show only recipes belonging to authenticated user
  const displayRecipes = async () => {
    if (viewGlobalRecipes) {
      displayGlobalRecipes();
    }
    else {
      displayPersonalRecipes();
    }
  }

  // Display all publicly visible recipes
  const displayGlobalRecipes = async () => {
    Api()
    .get("allRecipes")
    .then((response) => {
      setRecipeList(response.data.recipes);
    })
    .catch((e) => {
    });
  }

  // Display recieps belonging to authenticated user
  const displayPersonalRecipes = async () => {
    const email = await SecureStore.getItemAsync("email")
    Api()
    .get(`userRecipes/?email=${email}`)
    .then((response) => {
      setRecipeList([...response.data.recipes[0]]);
    })
    .catch((e) => {
    });
  }

  // On first render, load recipes
  useEffect(() =>{
    displayRecipes();
  },[]);

  // Display refreshing icon and reload recipes
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    displayRecipes();
    setRefreshing(false);
  }, []);

  // When toggle value is changed, reload recipes
  useEffect(() => {
    displayRecipes();
  }, [viewGlobalRecipes])


  return (
      <ImageBackground source={require('../../assets/images/boards.png')} style={styles.container}>
      <SearchBar
        placeholder="Type Here..."
        inputStyle={{backgroundColor: '#dce2e3'}}
        containerStyle={{backgroundColor: '#dce2e3', borderRadius: 40, marginTop: 40, width: '95%', alignSelf:'center'}}
        inputContainerStyle={{backgroundColor: '#dce2e3'}}
      />
      <View style={styles.settingBar}>
        <View  style={{flexDirection: 'row'}}>
        <Text style={{fontWeight: "bold" , color: '#ed288e', fontSize: 15, marginTop: 15 , marginLeft: 15}}>View Global Recipes</Text>
        <Switch
        value={viewGlobalRecipes}
        onValueChange={(value) => setViewGlobalRecipes(value)}
        />
        </View>
        <TouchableOpacity 
          onPress={() => navigate("SelectedRecipes")}
          style={styles.cartButton}
        >
          <FontAwesome5 name="shopping-cart" size={18} color="white" />
        </TouchableOpacity>
        <Button title={"+"} buttonStyle={{backgroundColor: '#ed288e'}} containerStyle={styles.button} onPress={() => navigate("AddRecipes")}/>
      </View>
      {/* Render list of recipes */}
      <FlatList
        data={recipeList}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} 
          onRefresh={() => {
            onRefresh();      
           }} />
        }
        renderItem={({ item }) => RecipeCard(item)}
      />
      </ImageBackground>
  );
};

// Do not display screen header
RecipeList.navigationOptions = {
  header: () => false,
};

const styles = StyleSheet.create({
 card: {
  borderRadius: 20,
  height: 200,
 },
 recipeInfo: {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  paddingLeft: 50,
 },
 button :{
  height: 40,
  width: 40,
  borderRadius: 40,
  marginLeft: 20,
  marginRight: 20,
  marginBottom: 10,
 },
 cartButton :{
  height: 40,
  width: 40,
  borderRadius: 40,
  marginLeft: 20,
  marginRight: 20,
  marginBottom: 10,
  paddingRight: 2,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.65)",
 },
 container: {
  flex: 1,
 },
settingBar: {
  flexDirection: 'row',
  borderRadius: 10,
  marginTop: 20,
  width: '95%',
},
newRecipeButton :{
  height: 40,
  width: 80,
  borderRadius: 10,
  marginLeft: 60,
},
});

function mapStateToProps(state) {
  return {
    selectedRecipes: state.recipeItems.selectedRecipes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setSelectedRecipes: (newSelectedRecipes) =>
      dispatch({
        type: 'SET_SELECTED_RECIPES',
        newSelectedRecipes: newSelectedRecipes,
      }),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(RecipeList);

