import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text , ImageBackground, Modal } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import NavLink from '../components/NavLink';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import { Card, Image, ListItem, Button, Icon } from 'react-native-elements'

function RecipeDetails() {
    const token = SecureStore.getItemAsync("accessToken");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [recipeItems, setRecipeItems] = useState([]);

    useEffect(() => {
    Api()
    .get(
        'recipes/?recipeId='+'6184781d533568e45cdbc19c',
        {
            headers: {
                authorization: "Bearer " + token,
                accept: "application/json"
            },
        }
    )
    .then((response) => {
        console.log("response.data: ", response.data);
        setName(response.data.recipe.recipeName);
        setImageUrl(response.data.recipe.recipePhoto);
        setDescription(response.data.recipe.description);
        setPrice(response.data.recipe.price);
        setIngredients(response.data.ingredients);
        setRecipeItems(response.data.recipe.recipeItem);
    })
    .catch((e) => {
        
    });
    }, [])

  return (
    <Card style={styles.container}>
        <Card.Title>{name}</Card.Title>
        <Card.Divider/>
            <View>
            <Image
                style={styles.recipeImage}
                resizeMode="cover"
                source={{uri: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"}}
            />
            {
                recipeItems.map((recipeItem, index) => {
                    let ingredient = ingredients.find(ingredient => ingredient._id === recipeItem.ingredients)
                    return (
                        <Text key={index} style={styles.name}>
                            {recipeItem.itemQuantity}
                            {" "}{ingredient?.unitType}
                            {" "}{ingredient?.name}
                        </Text>
                        );
                })
            }
        </View>
    </Card>
  );
};

RecipeDetails.navigationOptions = {
    header: () => false,
  };

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "90%",
    height: "50%",
    justifyContent: 'center',
    },
    recipeImage: {
            height: 200,
            width: 200,
            alignSelf: 'center',
            marginTop: 50,
            //backgroundColor: 'black',
    },
});

export default RecipeDetails;
