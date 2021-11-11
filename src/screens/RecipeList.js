import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity,View, Image } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Card, Icon, Avatar } from "react-native-elements";
import Api from '../api/apiInstance';
import { ScrollView } from "react-native-gesture-handler";
//import { Context as TrackContext } from "../context/TrackContext";

const RecipeList = ({ navigation }) => {
  //const { state, fetchTracks } = useContext(TrackContext);
  const [recipeList, setRecipeList] = useState([]);
  
  const RecipeCard = recipe => {
    return (
      <TouchableOpacity>
      <Card containerStyle={{borderRadius: 10}}>
        <View style={{flexDirection: 'row'}}>
        <Avatar  size="xlarge" rounded source={{uri : recipe.recipePhoto}} />
        <View>
         <View style={{flexDirection: 'row'}}>
         <Icon name='reader-outline' type='ionicon' color='#517fa4'/>
        <Card.Title>{recipe.recipeName}</Card.Title>
        </View>
        <View style={{flexDirection: 'row'}}>
        <Icon name='pricetag-outline' type='ionicon' color='#517fa4'/>
        <Card.Title>{recipe.price}</Card.Title>
        </View>
        </View>
        </View>
        <Card.Title>{recipe.description}</Card.Title>
      </Card>
      </TouchableOpacity>
    );
  };

  const displayRecipe = async () => {
    Api()
    .get("allRecipes")
    .then((response) => {
      console.log("response.data: ", response.data.recipes);
      //console.log("response with recipes: ", response.data);
      setRecipeList(response.data.recipes);
      //saveAuthInfo(response.data.accessToken, response.data.refreshToken, response.data.user);
    })
    .catch((e) => {
      console.log("e.response: ", e.response);
      console.log("e.message: ", e.message);
    });
  }

  useEffect(() =>{
    displayRecipe();
  },[]);

  return (
    <>
      {/* <NavigationEvents onWillFocus={fetchTracks} /> */}
      <FlatList
        data={recipeList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => RecipeCard(item)}
      />
    </>
  );
};

RecipeList.navigationOptions = {
  title: "Recipes",
};

const styles = StyleSheet.create({
 card: {
  borderRadius: 20,
  height: 200,
 },
});

export default RecipeList;
