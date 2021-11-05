import React, { useContext } from "react";
import { StyleSheet, Text, FlatList, TouchableOpacity } from "react-native";
import { NavigationEvents } from "react-navigation";
import { ListItem } from "react-native-elements";
//import { Context as TrackContext } from "../context/TrackContext";

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
                console.log('button pressed')
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
