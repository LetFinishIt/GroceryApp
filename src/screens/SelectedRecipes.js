import React, { useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity,View, ImageBackground, Switch} from "react-native";
import { Card, Avatar, Button } from "react-native-elements";
import {navigate} from "../navigationRef";
import { connect } from 'react-redux';

// Confirmation screen for setting correct quantity of each recipe to be used when generating grocery list
const SelectedRecipes = ({ selectedRecipes, setSelectedRecipes }) => {
  const [recipeList, setRecipeList] = useState([]);

  // Decrement count of recipe, minimum 0
  const decrementRecipe = (clickedRecipe) => {
    let updatedSelectedRecipes = selectedRecipes;
    let updatedRecipe = updatedSelectedRecipes.find(selectedRecipe => selectedRecipe.recipe._id === clickedRecipe.recipe._id);
    if (updatedRecipe.quantity > 0) {
        updatedRecipe.quantity --;
        setSelectedRecipes([...updatedSelectedRecipes]);
        setRecipeList([...updatedSelectedRecipes]);
    }
  }

  // Increment count of recipe
  const incrementRecipe = (clickedRecipe) => {
    let updatedSelectedRecipes = selectedRecipes;
    let updatedRecipe = updatedSelectedRecipes.find(selectedRecipe => selectedRecipe.recipe._id === clickedRecipe.recipe._id);
    updatedRecipe.quantity ++;
    setSelectedRecipes([...updatedSelectedRecipes]);
    setRecipeList([...updatedSelectedRecipes]);
  }

  // Remove recipe from list
  const removeRecipe = (clickedRecipe) => {
    let otherSelectedRecipes = selectedRecipes.filter(selectedRecipe => selectedRecipe.recipe._id !== clickedRecipe.recipe._id);
    setSelectedRecipes([...otherSelectedRecipes]);
    setRecipeList([...otherSelectedRecipes]);
  }

  // Object to render for each recipe on list, includes title, quantity, unit type, and recipe photo or placeholder
  const RecipeCard = (selectedRecipe) => {
    return (
      <TouchableOpacity  
      onPress={() =>
        navigate("RecipeDetails", {recipeId: selectedRecipe.recipe._id})
      }>
        <Card containerStyle={{borderRadius: 10, backgroundColor:'rgba(0,0,0,0.65)', borderColor: "rgba(0,0,0,0.65)"}}>
            <View style={{flexDirection: 'row'}}>
                <Avatar  size="large" rounded 
                  source={selectedRecipe.recipe.recipePhoto ? 
                    {uri : selectedRecipe.recipe.recipePhoto} : 
                    {uri : "https://www.thefrenchcookingacademy.com/wp-content/themes/neptune-by-osetin/assets/img/placeholder.jpg"}} />
            <View style={styles.recipeInfo}>
                <Card.Title style={{color: 'white'}}>{selectedRecipe.recipe.recipeName}</Card.Title>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row'}}>
                        <Button title={"-"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.button} onPress={() => decrementRecipe(selectedRecipe)}/>
                        <Text style={{fontWeight: "bold" , color: 'white', fontSize: 15, marginTop: 15 , marginLeft: 5, marginRight: 5}}>{selectedRecipe.quantity}</Text>
                        <Button title={"+"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.button} onPress={() => incrementRecipe(selectedRecipe)}/>    
                        </View>
                        <Button title={"X"} buttonStyle={{backgroundColor: "rgba(255,0,0,0.35)"}} containerStyle={styles.newRecipeButton} onPress={() => removeRecipe(selectedRecipe)}/>
                    </View>
                </View>
            </View>
        </Card>
      </TouchableOpacity>
    );
  };

  // on first render, set recipeList to match global state
  useEffect(() => {
    setRecipeList(selectedRecipes);
  }, []);

  return (
      <ImageBackground source={require('../../assets/images/boards.png')} style={styles.container}>
        <View style={styles.settingBar}>
            <Button title={"Back"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.65)", paddingLeft: 10, paddingRight: 10,}} containerStyle={styles.settingsButton} onPress={() => navigate("RecipeList")}/>
            <Button title={"Generate List"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.65)", paddingLeft: 10, paddingRight: 10,}} containerStyle={styles.settingsButton} onPress={() => navigate("GroceryList")}/>
        </View>
        {/* Render list of recipes */}
        <FlatList
            data={recipeList}
            keyExtractor={(item) => item.recipe._id}
            renderItem={({ item }) => RecipeCard(item)}
        />
      </ImageBackground>
  );
};

// Do not display screen header
SelectedRecipes.navigationOptions = {
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
  paddingLeft: 30,
 },
 button :{
  height: 40,
  minWidth: 40,
  borderRadius: 40,
  marginBottom: 10,
  marginRight: 10,
  marginLeft: 10,
  backgroundColor: "rgba(0,0,0,0.65)",
 },
 settingsButton :{
  height: 40,
  minWidth: 40,
  borderRadius: 10,
  marginBottom: 10,
  marginRight: 10,
  marginLeft: 10,
 },
 container: {
  flex: 1,
 },
settingBar: {
  flexDirection: 'row',
  borderRadius: 10,
  marginTop: 30,
  width: '95%',
  justifyContent: "space-evenly",
},
newRecipeButton :{
  height: 40,
  width: 80,
  borderRadius: 10,
  marginLeft: 20,
},
});

// Grant access to axios global states through props
function mapStateToProps(state) {
  return {
    selectedRecipes: state.recipeItems.selectedRecipes,
  };
}

// Grant access to axios global dispatch methods through props
function mapDispatchToProps(dispatch) {
  return {
    setSelectedRecipes: (newSelectedRecipes) =>
      dispatch({
        type: 'SET_SELECTED_RECIPES',
        newSelectedRecipes: newSelectedRecipes,
      }),
  };
}
// Export with connection to axios globally stateful methods
export default connect(mapStateToProps, mapDispatchToProps)(SelectedRecipes);