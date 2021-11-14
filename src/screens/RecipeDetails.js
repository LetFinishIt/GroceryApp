import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, ImageBackground, Modal } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import NavLink from '../components/NavLink';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import { Card, Image, ListItem, Button, Icon } from 'react-native-elements'
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { navigate } from '../navigationRef';
import Spacer from '../components/Spacer';
import SmallSpacer from '../components/SmallSpacer';

function RecipeDetails(props) {
    const { navigation } = props;
    const recipeId = navigation.getParam('recipeId');

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
        'recipes/?recipeId=' + recipeId,
        {
            headers: {
                authorization: "Bearer " + token,
                accept: "application/json"
            },
        }
    )
    .then((response) => {
        console.log()
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

    const logInfo = () => {
        console.log("name: ", name)
        console.log("description: ", description)
        console.log("imageUrl: ", imageUrl)
        console.log("price: ", price)
        console.log("ingredients: ", ingredients)
        console.log("recipeItems: ", recipeItems)
        recipeItems?.map((recipeItem, index) => {
            let ingredient = ingredients?.find(ingredient => ingredient._id === recipeItem.ingredients)
            console.log("")
            console.log("ingredient?.name: ", ingredient?.ingredientName)
        })
    }

  return (
    <ImageBackground
        source={require('../../assets/images/boards.png')}
        resizeMode="cover"
        style={styles.container}
    >
        <View style={styles.cardContainer}>
            <ScrollView
                // wrapperStyle={styles.card} 
                contentContainerStyle={styles.scrollViewContainer}
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
                        recipeItems?.map((recipeItem, index) => {
                            let ingredient = ingredients?.find(ingredient => ingredient._id === recipeItem.ingredients)
                            return (
                                <Text key={index} style={styles.text}>
                                    {recipeItem.itemQuantity}
                                    {" "}{ingredient?.unitType}
                                    {" "}{ingredient?.ingredientName}
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
                        onPress={() => logInfo()} 
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
            </ScrollView>
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
        marginTop: 20,
        marginBottom: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        paddingTop: 20,
        paddingBottom: 20,
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
        paddingLeft: 20,
        paddingRight: 20,
    },
    recipeImage: {
        height: 160,
        width: 300,
        alignSelf: 'center',
    },
    scrollViewContainer: {
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        // textAlign: "center",
        color: "white",
    },
});

export default RecipeDetails;
