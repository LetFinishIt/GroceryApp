import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal"; 
import { NavigationEvents } from "react-navigation";
import { ListItem } from "react-native-elements";
import RecipeDetails from "../components/RecipeDetails";
//import { Context as TrackContext } from "../context/TrackContext";
import {navigate} from "../navigationRef";

const RecipeList = ({ navigation }) => {
  //const { state, fetchTracks } = useContext(TrackContext);

  let recipes =[
      {_id : 1 ,  name: 'Chicken Curry'},
      {_id : 2 ,  name: 'Beef Curry'},
  ]

  return (
    <>
      {/* <NavigationEvents onWillFocus={fetchTracks} /> */}
      <FlatList
        data={recipes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() =>
                //navigation.navigate("TrackDetail", { _id: item._id })
                // console.log('button pressed'),
                navigate("RecipeDetails", {recipeId: "6184781d533568e45cdbc19c"})
              }
            >
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
};

RecipeList.navigationOptions = {
  title: "Recipes",
};

const styles = StyleSheet.create({});

export default RecipeList;
