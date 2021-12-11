import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, FlatList, View, ImageBackground,   RefreshControl} from "react-native";
import { Card, Button, } from "react-native-elements";
import Api from '../api/apiInstance';
import {navigate} from "../navigationRef";
import { connect } from 'react-redux';
import CheckBox from 'expo-checkbox';

// Grocery checklist showing ingredients required to make all recipes the specified number of times
const GroceryList = ({ selectedRecipes }) => {
    const [ingredientList, setIngredientList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // One ingredient item, showing the checkbox, ingredient name, quantity, and ingredient unit type
    const IngredientCard = (ingredient) => {
        return (
            <Card containerStyle={styles.cardContainer}>
                <View style={styles.cardSubContainer}>
                <CheckBox 
                    value={ingredient.isChecked}
                    onValueChange={() => checkIngredient(ingredient._id)}
                    style={styles.checkbox}
                />
                <Text style={styles.cardText}>{ingredient.ingredientName}</Text>
                <Text style={styles.cardText}> - </Text>
                <Text style={styles.cardText}>{ingredient.quantity}</Text>
                <Text style={styles.cardText}>{ingredient.unitType}</Text>
                </View>
            </Card>
        );
    };

    // check or uncheck ingredient
    const checkIngredient = (_id) => {
        let updatedIngredientList = ingredientList;
        let updatedIngredient = updatedIngredientList.find(ingredient => ingredient._id === _id);
        updatedIngredient.isChecked = !updatedIngredient.isChecked;
        setIngredientList([...updatedIngredientList]);
    }

  // call api on first render
  useEffect(() => {
      loadAllIngredients();
  }, []);

  // load all ingredients
  const loadAllIngredients = () => {
    Api()
    .get("ingredients")
    .then((response) => {
        loadIngredientList(response.data.ingredients);
    })
    .catch((e) => {
    });
  }

  // iterate through selected recipes stored in global state, matching ingredient IDs to the names and unit types from the backend, then setting the selected quantity
  const loadIngredientList = (allIngredients) => {
    selectedRecipes.map(selectedRecipe => {
        selectedRecipe.recipe.recipeItem.map(recipeItem => {
            let ingredient = allIngredients.find(ingredient => ingredient._id === recipeItem.ingredients);
            console.log("")
            addQuantityToIngredient(
                ingredient._id, 
                selectedRecipe.quantity * recipeItem.itemQuantity, 
                ingredient.unitType,
                ingredient.ingredientName,
            )
        })
    })
    setIsLoading(false);
  }

  // if ingredient is already in the list, add quantity, otherwise create new ingredient with the correct values
  const addQuantityToIngredient = (_id, quantity, unitType, ingredientName) => {
    let updatedIngredientList = ingredientList;
    let updatedIngredient = updatedIngredientList.find(ingredient => ingredient._id === _id);
    if (updatedIngredient) {
        updatedIngredient.quantity += quantity;
    }
    else {
        updatedIngredientList.push({
            _id: _id, 
            quantity: quantity, 
            unitType: unitType,
            ingredientName: ingredientName,
            isChecked: false,
        })
    }
    setIngredientList([...updatedIngredientList]);
  }

  return (
      <ImageBackground source={require('../../assets/images/boards.png')} style={styles.container}>
        <View style={styles.settingBar}>
            <Button title={"Back"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.65)", paddingLeft: 10, paddingRight: 10,}} containerStyle={styles.settingsButton} onPress={() => navigate("SelectedRecipes")}/>
        </View>
        <ActivityIndicator animating={isLoading} />
        {/* Render all ingredients using ingredientCard object */}
        <FlatList
            data={ingredientList}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} 
              onRefresh={() => { }} />
            }
            renderItem={({ item }) => IngredientCard(item)}
        />
      </ImageBackground>
  );
};

// Do not display navigation header
GroceryList.navigationOptions = {
  header: () => false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
 cardContainer: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 20,
    borderColor: "rgba(0,0,0,0.65)",
    flex: 1,
    flexDirection: 'row',
 },
 cardSubContainer: {
    paddingLeft: 20,
    textAlignVertical: "center",
    textAlign: "center",
    width: "100%",
    height: "100%",
    flex: 1,
    flexDirection: 'row',
 },
 cardText: {
    color: 'white', 
    fontSize: 18, 
    marginLeft: 5, 
    marginRight: 5,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
 },
 checkbox: {
    alignSelf: "center",
    marginRight: 20,
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
  paddingBottom: 20
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
export default connect(mapStateToProps, mapDispatchToProps)(GroceryList);