import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Text, ImageBackground, Modal } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import NavLink from '../components/NavLink';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import { Card, Image, ListItem, Button, Icon } from 'react-native-elements'
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { navigate } from '../navigationRef';
import Spacer from '../components/Spacer';
import SmallSpacer from '../components/SmallSpacer';

function RecipeDetails({recipeId}) {
    const token = SecureStore.getItemAsync("accessToken");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [recipeItems, setRecipeItems] = useState([]);

    useEffect(() => {
    console.log("recipeId: ", recipeId);
    Api()
    .get(
        'recipes/?recipeId=' + "6185a6a7d65b901a1224a26c",
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
        console.log("e: ", e.message)
    });
    }, [])

  return (
    <ImageBackground
        source={require('../../assets/images/boards.png')}
        resizeMode="cover"
        style={styles.container}
    >
        <View
            // wrapperStyle={styles.card} 
            style={styles.cardContainer}
        >
                <SmallSpacer />
            <Text style={styles.header}>{name}</Text>
            <SmallSpacer />
            {/* <Card.Divider/> */}
            <View style={{alignItems: "center"}}>
                <Image
                    style={styles.recipeImage}
                    resizeMode="contain"
                    source={{uri: imageUrl}}
                />
                <SmallSpacer />
                <View style={styles.ingredientContainer}>
                {
                    recipeItems.map((recipeItem, index) => {
                        let ingredient = ingredients.find(ingredient => ingredient._id === recipeItem.ingredients)
                        return (
                            <Text key={index} style={styles.text}>
                                {recipeItem.itemQuantity}
                                {/* {" "}{ingredient?.unitType} */}
                                {" "}LB
                                {/* {" "}{ingredient?.name} */}
                                {" "}{index == 1 ? "Flour" : "Tomato Sauce"}
                            </Text>
                            );
                    })
                }
            </View>
            </View>
            <SmallSpacer />
            <Text style={styles.text}>
                {description}
            </Text>
            <SmallSpacer />
            <View style={styles.buttonContainer}>
                <Button 
                    onPress={() => navigate("RecipeList")} 
                    title={"Edit"}
                    style={styles.button}
                />
                <SmallSpacer />
                <Button 
                    onPress={() => navigate("RecipeList")} 
                    title={"Close"}
                    style={styles.button}
                />
            </View>
            <SmallSpacer />
        </View>
    </ImageBackground>
  );
};

RecipeDetails.navigationOptions = {
    header: () => false,
  };

const styles = StyleSheet.create({
    buttonContainer: {
        width: "80%",
    },
    cardContainer: {
        backgroundColor: 'rgba(0,0,0,0.65)',
        width: "90%",
        borderRadius: 10,
        alignItems: "center",
        padding: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        textAlign: "center",
        color: "white",
    },
    ingredientContainer: {
        // width: "100%",
        alignItems: "flex-start",
        textAlign: 'left',
    },
    recipeImage: {
        height: 160,
        width: 400,
        alignSelf: 'center',
    },
    text: {
        fontSize: 18,
        // textAlign: "center",
        color: "white",
    },
});

export default RecipeDetails;
