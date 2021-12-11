import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, ImageBackground, Modal, TouchableOpacity , Alert} from 'react-native';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import { Image, Button, Icon } from 'react-native-elements'
import { navigate } from '../navigationRef';
import SmallSpacer from '../components/SmallSpacer';
import EditRecipeForm from '../components/EditRecipeForm';

// display details of recipe, e.g. title, ingredients, description, photo, etc.
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
    const [recipeOwnerEmail, setRecipeOwnerEmail] = useState([]);
    const [recipeOwnerId, setRecipeOwnerId] = useState([]);
    const [currentUserEmail,setCurrentUserEmail]= useState(); 
    const [modalVisible, setModalVisible] = useState(false);

    // set current user email for evaluating whether user can delete recipe
    const getCurrentUserEmail =  async() => {
        setCurrentUserEmail(await SecureStore.getItemAsync("email"));
    } 

    useEffect(() => {
    //get current user's email address
    getCurrentUserEmail();
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
        setName(response.data.recipe.recipeName);
        setImageUrl(response.data.recipe.recipePhoto);
        setDescription(response.data.recipe.description);
        setPrice(response.data.recipe.price);
        setIngredients(response.data.ingredients);
        setRecipeItems(response.data.recipe.recipeItem);
        setRecipeOwnerId(response.data.recipe.user);
        setRecipeOwnerEmail(response.data.recipe.userEmail);
    })
    .catch((e) => {
    });
    }, [])
 
    // send backend request to delete recipe - only allowed if owner id and email match requestor's information
    const deleteRecipe = (recipeId) =>{
        Api()
        .delete(
            'recipe/?recipeId=' + recipeId,
            {
                headers: {
                    authorization: "Bearer " + token
                },
            }
        )
        .catch((e) => {
        });
    }

    // confirmation alert for deleting a recipe
    const createTwoButtonAlert = () =>
    Alert.alert('Delete Recipe', 'Are you sure to delete this recipe', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => {
        deleteRecipe(recipeId);
        navigate("RecipeList")
      } },
    ]);

  return (
    <ImageBackground
        source={require('../../assets/images/boards.png')}
        resizeMode="cover"
        style={styles.container}
    >
        {/* Modal for edit recipe form. Shows on top of details screen so the user can resume after closing */}
        <Modal visible={modalVisible} style={{flex: 1}}>
            <ImageBackground 
             source={require('../../assets/images/wood.jpeg')}
             resizeMode="cover"
             style={styles.modalContainer}>
            <EditRecipeForm 
            recipeName={name}
            description={description}
            photo={imageUrl}
            price={price}
            onClose={() => { setModalVisible(false) }}
            recipeItem={recipeItems}
            recipeId={recipeId}
            />
            <View style ={{alignItems: 'center'}}>
            <Button 
            onPress={() => {
            setModalVisible(false);
            console.log('navigation works');
            }} 
            title={"Close"}
            containerStyle={styles.closeButton}
            />
            </View>
            </ImageBackground>
        </Modal>
        <View style={styles.cardContainer}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
            >
                <SmallSpacer />
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={styles.header}>{name}</Text>
                {currentUserEmail === recipeOwnerEmail &&
                <TouchableOpacity onPress={createTwoButtonAlert}>
                <Icon name='trash-outline' type='ionicon' color='red' style={{marginTop: 8, marginLeft: 10}} />
                </TouchableOpacity>
                }
                </View>
                <SmallSpacer />
                <View style={{alignItems: "center"}}>
                    <Image
                        style={styles.recipeImage}
                        resizeMode="contain"
                        source={imageUrl
                            ? {uri: imageUrl}
                            : {uri : "https://www.thefrenchcookingacademy.com/wp-content/themes/neptune-by-osetin/assets/img/placeholder.jpg"}
                        }
                    />
                    <SmallSpacer />
                    <View style={styles.ingredientContainer}>
                    {
                        // map recipe items, matching ingredient to each recipe item to get normalized data about title and unit type
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
                        onPress={() => {
                            setModalVisible(true);
                        }
                    } 
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

// Do not show screen header
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
        color: "white",
    },
    closeButton : {
        alignContent: 'center',
        height: 40,
        width: 200,
        minWidth: 40,
        borderRadius: 40,
        backgroundColor: "rgba(0,0,0,0.65)",
    }
});

export default RecipeDetails;
