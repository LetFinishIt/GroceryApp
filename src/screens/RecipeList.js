import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity,View, ImageBackground, Image , Switch} from "react-native";
import Modal from "react-native-modal"; 
import { NavigationEvents } from "react-navigation";
import { Card, Icon, Avatar, Button, SearchBar , FAB} from "react-native-elements";
import Api from '../api/apiInstance';
import { ScrollView } from "react-native-gesture-handler";
//import { Context as TrackContext } from "../context/TrackContext";
import {navigate} from "../navigationRef";
import { FontAwesome } from '@expo/vector-icons';

const RecipeList = ({ navigation }) => {
  //const { state, fetchTracks } = useContext(TrackContext);
  const [recipeList, setRecipeList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitchReact = () => setIsEnabled(previousState => !previousState);
  const toggleSwitchElement = () => {
    setChecked(!checked);
  };
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
        <Avatar  size="large" rounded source={{uri : recipe.recipePhoto}} />
        <View style={styles.recipeInfo}>
        <Card.Title>{recipe.recipeName}</Card.Title>
        <View style={{flexDirection: 'row'}}>
        <Icon name='pricetag-outline' type='ionicon' color='red'/>
        <Card.Title style={{color:'red'}}>{recipe.price}</Card.Title>
        <Button title={"Add"} buttonStyle={{backgroundColor: '#ed288e'}} containerStyle={styles.newRecipeButton} onPress={() => console.log('button press',recipe._id)}/>
        </View>
        </View>
        </View>
        {/* <Text>{recipe.description}</Text> */}
      </Card>
      </TouchableOpacity>
    );
  };

  const displayRecipe = async () => {
    Api()
    .get("allRecipes")
    .then((response) => {
      //console.log("response.data: ", response.data.recipes);
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
        <Text style={{fontWeight: "bold" , color: '#ed288e', fontSize: 15, marginTop: 15 , marginLeft: 15}}>View Stock Recipes</Text>
        <Switch
        value={checked}
        onValueChange={(value) => setChecked(value)}
        />
        </View>
        <Button title={"+"} buttonStyle={{backgroundColor: '#ed288e'}} containerStyle={styles.button} onPress={() => console.log('button press')}/>
      </View>
      <FlatList
        data={recipeList}
        keyExtractor={(item) => item._id}
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
  marginLeft: 100,
  marginBottom: 10,
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

export default RecipeList;
