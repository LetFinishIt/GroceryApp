import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Text, ImageBackground, Modal, TouchableOpacity , Alert} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import NavLink from '../components/NavLink';
import Api from '../api/apiInstance';
import * as SecureStore from 'expo-secure-store';
import { Card, Image, ListItem, Button, Icon } from 'react-native-elements'
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';
import { navigate } from '../navigationRef';
import Spacer from '../components/Spacer';
import SmallSpacer from '../components/SmallSpacer';
import { FontAwesome5 } from '@expo/vector-icons'; 
import EditRecipeForm from '../components/EditRecipeForm';


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
    const [recipeOwnerId, setRecipeOwnerId] = useState([]);
    const [currentUserId,setCurrentUserId]= useState(); 
    const [modalVisible, setModalVisible] = useState(false);

    const getCurrentUserId =  async() => {
        setCurrentUserId( await SecureStore.getItemAsync("userId"));
    } 

    useEffect(() => {
    console.log("recipeId: ", recipeId);
    //get current user id
    getCurrentUserId();
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
        setRecipeOwnerId(response.data.recipe.user);
    })
    .catch((e) => {
        console.log("e: ", e.message)
    });
    }, [])
 
    const deleteRecipe = (recipeId) =>{
        console.log("recipeId: ", recipeId);
        Api()
        .delete(
            'recipe/?recipeId=' + recipeId,
            {
                headers: {
                    authorization: "Bearer " + token
                },
            }
        ).then((response) => {
            console.log()
            console.log("response.data: ", response.data);
        })
        .catch((e) => {
            console.log("e: ", e.message)
        });
    }

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

    //On Change Text method for Modal


  const onChange = ({inputName, value: inputValue}) => {
    // setForm({...form, [inputName]: inputValue});

    if (inputName === 'recipeName') {
      
    }
    if (inputName === 'petType') {
      if (inputValue === null) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Pet Type cant be empty',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'username') {
      if (inputValue.length === 0) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Username cant be empty',
          };
        });
      } else if (inputValue.length > 20) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Username cant be longer than 20 words',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'petName') {
      if (inputValue.length === 0) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Pet name cant be empty',
          };
        });
      } else if (inputValue.length > 20) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Pet name cant be longer than 20 words',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'breed') {
      if (inputValue.length === 0) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Breed cant be empty',
          };
        });
      } else if (inputValue.length > 25) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Breed cant be longer than 25 words',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'biography') {
      if (inputValue.length > 500) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Biography cant be longer than 500 words',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'likes') {
      if (inputValue.length > 500) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Pet likes cant be longer than 500 words',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'dislikes') {
      if (inputValue.length > 500) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Pet dislikes cant be longer than 500 words',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'birthday') {
      if (inputValue === null) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Birthday cant be empty',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'health') {
      if (inputValue.length > 500) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Health details cant be longer than 500 characters',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'vet') {
      if (inputValue.length > 100) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Vet name cant be longer than 100 characters',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    if (inputName === 'specialSkills') {
      if (inputValue.length > 500) {
        setFormErrors(prev => {
          return {
            ...prev,
            [inputName]: 'Special Skills cant be longer than 500 characters',
          };
        });
      } else {
        // empty errors if user is filling again
        setFormErrors(prev => {
          return {...prev, [inputName]: null};
        });
      }
    }
    };
    

  return (
    <ImageBackground
        source={require('../../assets/images/boards.png')}
        resizeMode="cover"
        style={styles.container}
    >
        <Modal visible={modalVisible} style={{flex: 1}}>
            {/* <ImageBackground 
             source={require('../../assets/images/veggies.png')}
             resizeMode="cover"
             style={styles.modalContainer}> */}
            <EditRecipeForm 
            recipeName={name}
            description={description}
            photo={imageUrl}
            price={price}
            onChange={onChange}
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
            style={styles.closeButton}
            />
            </View>
        </Modal>
        <View style={styles.cardContainer}>
            <ScrollView
                // wrapperStyle={styles.card} 
                contentContainerStyle={styles.scrollViewContainer}
            >
                <SmallSpacer />
                <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                <Text style={styles.header}>{name}</Text>
                {currentUserId === recipeOwnerId &&
                <TouchableOpacity onPress={createTwoButtonAlert}>
                <Icon name='trash-outline' type='ionicon' color='red' style={{marginTop: 8, marginLeft: 10}} />
                </TouchableOpacity>
                }
                </View>
                <SmallSpacer />
                {/* <Card.Divider/> */}
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
                            console.log('navigation works');
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
    modalContainer: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: "center",
        // paddingTop: 20,
        // paddingBottom: 20,
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
    closeButton : {
        alignContent: 'center',
        height: 40,
        width: 200,
        minWidth: 40,
        borderRadius: 40,
        marginBottom: 10,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: "rgba(0,0,0,0.65)",
    }
});

export default RecipeDetails;
