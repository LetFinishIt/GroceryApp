import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity, View, ImageBackground, Image , Switch,  RefreshControl} from "react-native";
import Modal from "react-native-modal"; 
import { NavigationEvents } from "react-navigation";
import { Card, Icon, Avatar, Button, SearchBar , FAB} from "react-native-elements";
import Api from '../api/apiInstance';
import { ScrollView } from "react-native-gesture-handler";
import {navigate} from "../navigationRef";
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { FontAwesome5 } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';

const RecipeList = ({ navigation, selectedRecipes, setSelectedRecipes }) => {
  //const { state, fetchTracks } = useContext(TrackContext);
  const [recipeList, setRecipeList] = useState([]);
  const [viewGlobalRecipes, setViewGlobalRecipes] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleSwitchReact = () => setIsEnabled(previousState => !previousState);
  const toggleSwitchElement = () => {
    setViewGlobalRecipes(!viewGlobalRecipes);
  };
  
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

  const RecipeCard = recipe => {
    return (
      <TouchableOpacity  
      onPress={() =>
        //navigation.navigate("TrackDetail", { _id: item._id })
        // console.log('button pressed'),
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
        {/* <Text>{recipe.description}</Text> */}
      </Card>
      </TouchableOpacity>
    );
  };

  const displayRecipes = async () => {
    if (viewGlobalRecipes) {
      displayGlobalRecipes();
    }
    else {
      displayPersonalRecipes();
    }
  }

  const displayGlobalRecipes = async () => {
    Api()
    .get("allRecipes")
    .then((response) => {
      setRecipeList(response.data.recipes);
    })
    .catch((e) => {
      console.log("e.response: ", e.response);
      console.log("e.message: ", e.message);
    });
  }

  const displayPersonalRecipes = async () => {
    const email = await SecureStore.getItemAsync("email")
    Api()
    .get(`userRecipes/?email=${email}`)
    .then((response) => {
      console.log("response.data.recipes: ", response.data.recipes)
      setRecipeList([...response.data.recipes[0]]);
    })
    .catch((e) => {
      console.log("e.response: ", e.response);
      console.log("e.message: ", e.message);
    });
  }

  useEffect(() =>{
    displayRecipes();
  },[]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    displayRecipes();
    setRefreshing(false);
  }, []);

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
        //onChangeText={this.updateSearch}
        //value={search}
      />
      <View style={styles.settingBar}>
        <View  style={{flexDirection: 'row'}}>
        <Text style={{fontWeight: "bold" , color: '#ed288e', fontSize: 15, marginTop: 15 , marginLeft: 15}}>View Global Recipes</Text>
        <Switch
        value={viewGlobalRecipes}
        onValueChange={(value) => setViewGlobalRecipes(value)}
        />
        </View>
        {/* <Button title={"Cart"} buttonStyle={{backgroundColor: '#ed288e'}} containerStyle={styles.button} onPress={() => navigate("SelectedRecipes")}/> */}
        <TouchableOpacity 
          onPress={() => navigate("SelectedRecipes")}
          style={styles.cartButton}
        >
          <FontAwesome5 name="shopping-cart" size={18} color="white" />
        </TouchableOpacity>
        <Button title={"+"} buttonStyle={{backgroundColor: '#ed288e'}} containerStyle={styles.button} onPress={() => navigate("AddRecipes")}/>
      </View>
      <FlatList
        data={recipeList}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} 
          onRefresh={() => {
            //fetch data here
            onRefresh();      
           }} />
        }
        renderItem={({ item }) => RecipeCard(item)}
      />
      </ImageBackground>
  );
};

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
  //flexDirection: 'column',
  paddingLeft: 50,
  // flexShrink: 1,
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
  // justifyContent: 'center',
  // alignItems: "center",
  //paddingTop: 20,
  //paddingBottom: 20,
 },
//  floatingBtn :{
//   //borderWidth: 1,
//   //borderColor: 'rgba(0,0,0,0.2)',
//   alignItems: 'center',
//   justifyContent: 'center',
//   //width: 70,
//   position: 'absolute',
//   bottom: 40,
//   right: 40,
//   //height: 70,
//   //backgroundColor: '#fff',
//   //borderRadius: 100,
//  },
settingBar: {
  flexDirection: 'row',
  //backgroundColor: '#dce2e3',
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

