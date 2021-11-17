import React, { useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity,View, ImageBackground, Switch} from "react-native";
import { Card, Icon, Avatar, Button, SearchBar , FAB} from "react-native-elements";
import Api from '../api/apiInstance';
import {navigate} from "../navigationRef";
import { connect } from 'react-redux';

const SelectedRecipes = ({ selectedRecipes, setSelectedRecipes }) => {
  const [recipeList, setRecipeList] = useState([]);

  const decrementRecipe = (clickedRecipe) => {
    let updatedSelectedRecipes = selectedRecipes;
    let updatedRecipe = updatedSelectedRecipes.find(selectedRecipe => selectedRecipe.recipe._id === clickedRecipe.recipe._id);
    if (updatedRecipe.quantity > 0) {
        updatedRecipe.quantity --;
        setSelectedRecipes([...updatedSelectedRecipes]);
        setRecipeList([...updatedSelectedRecipes]);
    }
  }

  const incrementRecipe = (clickedRecipe) => {
    let updatedSelectedRecipes = selectedRecipes;
    let updatedRecipe = updatedSelectedRecipes.find(selectedRecipe => selectedRecipe.recipe._id === clickedRecipe.recipe._id);
    updatedRecipe.quantity ++;
    setSelectedRecipes([...updatedSelectedRecipes]);
    setRecipeList([...updatedSelectedRecipes]);
  }

  const removeRecipe = (clickedRecipe) => {
    let otherSelectedRecipes = selectedRecipes.filter(selectedRecipe => selectedRecipe.recipe._id !== clickedRecipe.recipe._id);
    setSelectedRecipes([...otherSelectedRecipes]);
    setRecipeList([...otherSelectedRecipes]);
  }

  const RecipeCard = (selectedRecipe) => {
    return (
      <TouchableOpacity  
      onPress={() =>
        navigate("RecipeDetails", {recipeId: selectedRecipe.recipe._id})
      }>
        <Card containerStyle={{borderRadius: 10, backgroundColor:'rgba(0,0,0,0.65)', borderColor: "rgba(0,0,0,0.65)"}}>
            <View style={{flexDirection: 'row'}}>
                <Avatar  size="large" rounded source={{uri : selectedRecipe.recipe.recipePhoto}} />
            <View style={styles.recipeInfo}>
                <Card.Title style={{color: 'white'}}>{selectedRecipe.recipe.recipeName}</Card.Title>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row'}}>
                        <Button title={"-"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.button} onPress={() => decrementRecipe(selectedRecipe)}/>
                        <Text style={{fontWeight: "bold" , color: 'white', fontSize: 15, marginTop: 15 , marginLeft: 5, marginRight: 5}}>{selectedRecipe.quantity}</Text>
                        <Button title={"+"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.button} onPress={() => incrementRecipe(selectedRecipe)}/>    
                        </View>
                        <Button title={"Remove"} buttonStyle={{backgroundColor: "rgba(255,0,0,0.35)"}} containerStyle={styles.newRecipeButton} onPress={() => removeRecipe(selectedRecipe)}/>
                    </View>
                </View>
            </View>
        </Card>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    setRecipeList(selectedRecipes);
  }, []);

  return (
      <ImageBackground source={require('../../assets/images/boards.png')} style={styles.container}>
        <View style={styles.settingBar}>
            <Button title={"Back"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.65)", paddingLeft: 10, paddingRight: 10,}} containerStyle={styles.settingsButton} onPress={() => navigate("RecipeList")}/>
            <Button title={"Generate List"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.65)", paddingLeft: 10, paddingRight: 10,}} containerStyle={styles.settingsButton} onPress={() => navigate("GroceryList")}/>
        </View>
        <FlatList
            data={recipeList}
            keyExtractor={(item) => item.recipe._id}
            renderItem={({ item }) => RecipeCard(item)}
        />
      </ImageBackground>
  );
};

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
export default connect(mapStateToProps, mapDispatchToProps)(SelectedRecipes);