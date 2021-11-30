import React, { useState, useRef, useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, View ,  SafeAreaView,TouchableOpacity, FlatList,Dimensions} from 'react-native';
import { Text, Button, Input, Card } from 'react-native-elements';
import Spacer from './Spacer';
import {Picker} from '@react-native-picker/picker';
//import Autocomplete from 'react-native-autocomplete-input';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Feather } from '@expo/vector-icons';
import Api from '../api/apiInstance';
import { ScrollView } from 'react-native-gesture-handler';


const RecipeForm = ({ headerText, errorMessage, onSubmit, submitButtonText, isSignUp = false }) => {
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState('');
  const [recipeItem, setRecipeItem] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  // Autocomplete drop setting
  const [loading, setLoading] = useState(false)
  const [suggestionsList, setSuggestionsList] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const dropdownController = useRef(null)
  const searchRef = useRef(null)
  const [ingredientList, setIngredientList] = useState([]);
  //const [isChecked, setIsChecked] = useState(false)

  // Decrease Quantity for ingredients
  const decrementQuantity = (clickedIngredients) => {
    let updatedSelectedingredient = ingredientList.filter(i => i !== null);
    //console.log('print out selected ingredients List', updatedSelectedingredient)
    let updatedIngredients = updatedSelectedingredient.find(selectedIngredient => selectedIngredient.ingredients === clickedIngredients.ingredients);
    //console.log('print out selected ingredients before change', updatedSelectedingredient)
    updatedIngredients.itemQuantity --;
    console.log('print out selected ingredients after change', updatedSelectedingredient)
    //setSelectedRecipes([...updatedSelectedingredient]);
    setIngredientList([...updatedSelectedingredient]);
    //console.log('print out selected ingredients list', ingredientList);
  }

  // Increase Quantity for ingredients
  const incrementQuantity = (clickedIngredients) => {
    //console.log('print out selected ingredients before change', clickedIngredients)
    let updatedSelectedingredient = ingredientList.filter(i => i !== null);
    //console.log('print out selected ingredients List', updatedSelectedingredient)
    let updatedIngredients = updatedSelectedingredient.find(selectedIngredient => selectedIngredient.ingredients === clickedIngredients.ingredients);
    //console.log('print out selected ingredients before change', updatedSelectedingredient)
    updatedIngredients.itemQuantity ++;
    console.log('print out selected ingredients after change', updatedSelectedingredient)
    //setSelectedRecipes([...updatedSelectedingredient]);
    setIngredientList([...updatedSelectedingredient]);
    //console.log('print out selected ingredients list', ingredientList);
  }

  // Remove ingredients
  const removeSelectedIngredients = (clickedIngredients) => {
    let updatedSelectedingredient = ingredientList.filter(i => i !== null);
    let otherSelectedIngredients = updatedSelectedingredient.filter(selectedIngredient => selectedIngredient.ingredients !== clickedIngredients.ingredients);
    //setSelectedRecipes([...otherSelectedRecipes]);
    setIngredientList([...otherSelectedIngredients ]);
  }

  const IngredientCard = (ingredient) => {
    return (
        <Card containerStyle={styles.cardContainer}>
            <View style={styles.cardSubContainer}>
            <Text style={styles.cardText}>{ingredient.title}</Text>
            <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'row'}}>
                        <Button title={"-"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.button} 
                        onPress={() => decrementQuantity(ingredient)}
                        />
                        <Text style={{fontWeight: "bold" , color: 'white', fontSize: 15, marginTop: 15 , marginLeft: 5, marginRight: 5}}>{ingredient.itemQuantity}</Text>
                        <Button title={"+"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.button} 
                        onPress={() => incrementQuantity(ingredient)}
                        />    
                        </View>
                        <Button title={"Remove"} buttonStyle={{backgroundColor: "rgba(255,0,0,0.35)"}} containerStyle={styles.newRecipeButton}
                        onPress={() => removeSelectedIngredients(ingredient)}
                         />
                    </View>
            </View>
        </Card>
    );
};

  const getSuggestions = useCallback(async (q) => {
    setLoading(true)
    Api()
    .get("ingredients")
    .then((response) => {
      console.log(response.data.ingredients);
      console.log(typeof response.data.ingredients);
      const items = response.data.ingredients;
      const suggestions = items.map((item) => ({
        ingredients: item._id,
        title: item.ingredientName,
        itemQuantity : 0
      }))
      setSuggestionsList(suggestions)
      console.log('print suggestion list',suggestionsList);
      setLoading(false)
    })
}, []) 

  return (
    <KeyboardAvoidingView 
    style={styles.form}
    >
        <Input
          label="Recipe Name"
          value={recipeName}
          onChangeText={setRecipeName}
          autoCapitalize="none"
          autoCorrect={false}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />
        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          autoCapitalize="none"
          autoCorrect={false}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />
        <Input
        label="Photo"
        value={photo}
        onChangeText={setPhoto}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
      <Input
        label="Price"
        value={price}
        onChangeText={setPrice}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
      <AutocompleteDropdown
          ref={searchRef}
          controller={(controller) => {
            dropdownController.current = controller
          }}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            item && setSelectedItem(item.ingredients);
            setIngredientList([...ingredientList,item]);
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
         // onClear={onClearPress}
          //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
         // onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false} // prevent rerender twice
          textInputProps={{
            placeholder: "Type your ingredients",
            autoCorrect: false,
            autoCapitalize: "none",
            style: {
              borderRadius: 25,
              backgroundColor: "#383b42",
              color: "#fff",
              paddingLeft: 18
            }
          }}
          rightButtonsContainerStyle={{
            borderRadius: 25,
            right: 8,
            height: 30,
            top: 10,
            alignSelfs: "center",
            backgroundColor: "#383b42"
          }}
          inputContainerStyle={{
            backgroundColor: "transparent"
          }}
          suggestionsListContainerStyle={{
            backgroundColor: "#383b42"
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => (
            <Text style={{ color: "#fff", padding: 15 }}>{item.title}</Text>
          )}
          ChevronIconComponent={
            <Feather name="x-circle" size={18} color="#fff" />
          }
          ClearIconComponent={
            <Feather name="chevron-down" size={20} color="#fff" />
          }
          inputHeight={50}
          showChevron={false}
          //  showClear={false}
        />
        {
          ingredientList && ingredientList.length>1
          &&
          <FlatList
          style={styles.flatList}
          data={ingredientList.filter(i => i !== null)}
          keyExtractor={(item) => item.ingredients}
          renderItem={({ item }) => IngredientCard(item)}
          />
        }
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => onSubmit(recipeName, price, description, photo,  ingredientList.filter(i => i !== null ))}
        />
      </Spacer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
    marginTop: 15
  },
  form: {
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 10
  },
  label: {
    color: "white",
  },
  flatList: {
    color: "white",
    height: 300,
  },
  input: {
    color: "white",
  },
  cardContainer: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 20,
    borderColor: "rgba(0,0,0,0.65)",
    // flex: 1,
    //flexDirection: 'row',
  },
  cardSubContainer: {
    //paddingLeft: 20,
    textAlignVertical: "center",
    textAlign: "center",
   //width: "100%",
    //height: "100%",
    //flex: 1,
    //flexDirection: 'row',
 },
 cardText: {
    color: 'white', 
    fontSize: 18, 
    marginLeft: 5, 
    marginRight: 5,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
 },
 button :{
  height: 40,
  minWidth: 40,
  borderRadius: 40,
  marginBottom: 10,
  marginRight: 10,
  marginLeft: 10,
  backgroundColor: "rgba(0,0,0,0.65)",
 },
 newRecipeButton :{
  height: 40,
  width: 80,
  borderRadius: 10,
  marginLeft: 20,
},
});

export default RecipeForm;