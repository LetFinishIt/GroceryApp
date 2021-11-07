import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal"; 
import { NavigationEvents } from "react-navigation";
import { ListItem } from "react-native-elements";
//import { Context as TrackContext } from "../context/TrackContext";
import {navigate} from "../navigationRef";

const RecipeList = ({ navigation }) => {
  //const { state, fetchTracks } = useContext(TrackContext);

  let recipes =[
      {_id : "6184781d533568e45cdbc19c" ,  name: 'Pizza'},
      {_id : "6185a6a7d65b901a1224a26c" ,  name: 'Beef and Broccoli'},
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
                navigate("RecipeDetails", {recipeId: item._id})
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
  header: () => false,
};

const styles = StyleSheet.create({});

export default RecipeList;
