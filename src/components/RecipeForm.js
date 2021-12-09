import React, { useState, useRef, useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, View ,  SafeAreaView,TouchableOpacity, FlatList,Dimensions, ImageBackground} from 'react-native';
import { Text, Button, Input, Card } from 'react-native-elements';
import Spacer from './Spacer';
import {Picker} from '@react-native-picker/picker';
//import Autocomplete from 'react-native-autocomplete-input';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import { Feather } from '@expo/vector-icons';
import Api from '../api/apiInstance';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CreateIngredientModal from './CreateIngredientModal';
import DeleteIngredientModal from './DeleteIngredientModal';


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
  const [ingredientOptions, setIngredientOptions] = useState([]);
  //const [isChecked, setIsChecked] = useState(false)
  const [openIngredientModal, setOpenIngredientModal] = useState(false);
  const [deleteIngId, setDeleteIngId] = useState("");
  const [deleteIngTitle, setDeleteIngTitle] = useState("");
  const [searchValue, setSearchValue] = useState("");

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
                <Text style={{fontWeight: "bold" , color: 'white', fontSize: 15, marginTop: 10, marginLeft: 5, marginRight: 5}}>{ingredient.itemQuantity}</Text>
                <Button title={"+"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.button} 
                onPress={() => incrementQuantity(ingredient)}
                />    
                </View>
                <Button title={"X"} buttonStyle={{backgroundColor: "rgba(255,0,0,0.35)"}} containerStyle={styles.newRecipeButton}
                onPress={() => removeSelectedIngredients(ingredient)}
                  />
              </View>
            </View>
        </Card>
    );
};

  useEffect(() => {
    loadOptions();
  }, [])
  
  const loadOptions = () => {
    Api()
    .get("ingredients")
    .then((response) => {
      console.log(response.data.ingredients);
      console.log(typeof response.data.ingredients);
      const items = response.data.ingredients;
      const ingredients = items.map((item) => ({
        ingredients: item._id,
        title: item.ingredientName + " - " + item.unitType,
        itemQuantity : 0,
      }))
      setIngredientOptions(ingredients);
    })
  }

  const handleSelectIngredient = (item) => {
    if (ingredientList.length <= 1) {
      if(!ingredientList.filter(i => i !== null).some(existingItem => existingItem?._id === item?.id)) {
      console.log('print ingredient list', ingredientList);
      setIngredientList([...ingredientList,item]);
      }
    }
    else{
      console.log('running again');
      if(ingredientList.filter(i => i !== null).some(existingItem => existingItem?._id === item?.id)) {
        console.log('print ingredient list', ingredientList);
        setIngredientList([...ingredientList,item]);
        }
      // I comment out since i do not see the effect of below code toward your function but feel free to uncomment it 
      //const remainingIngredientOptions = ingredientOptions.filter(option => option._id !== item._id);
      //setIngredientOptions([...remainingIngredientOptions]);
      //console.log('print remaining Ingredient Options',remainingIngredientOptions);
    }
    setSearchValue("");
  }

  const onClickDelete = (itemTitle, itemId) => {
    setDeleteIngTitle(itemTitle)
    setDeleteIngId(itemId)
  }

  return (
    // <KeyboardAwareScrollView 
    // style={styles.form}
    // >
    <>
    <CreateIngredientModal
        onCancel={() => { setOpenIngredientModal(false) }}
        isVisible={openIngredientModal}
        reloadOptions={() => loadOptions()}
    />
    <DeleteIngredientModal
        onCancel={() => { (setDeleteIngId(""), setDeleteIngTitle("")) }}
        isVisible={deleteIngId}
        ingredientId={deleteIngId}
        ingredientTitle={deleteIngTitle}
        reloadOptions={() => loadOptions()}
    />
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
        e={setPrice}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
      <View style={{width: "90%", marginLeft: "auto", marginRight: "auto", display: "flex", flexDirection: "row", alignItems: "center"}}>
        <View style={{width: "90%"}}>
        {deleteIngId === "" && !openIngredientModal &&
          <AutocompleteDropdown
            ref={searchRef}
            controller={(controller) => {
              dropdownController.current = controller
            }}
            bottomOffset={40}
            clearOnFocus={true}
            value={searchValue}
            onChangeText={setSearchValue}
            closeOnBlur={true}
            closeOnSubmit={false}
            dataSet={ingredientOptions}
            onSelectItem={(item) => {
              //console.log('print out the select item', item);
              handleSelectIngredient(item);
            }}
            // onSubmit={(item) => {
            //   handleSelectIngredient(item);
            // }}
            suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
            textInputProps={{
              placeholder: "Type your ingredients",
              autoCorrect: true,
              autoCapitalize: "none",
              style: {
                borderRadius: 25,
                backgroundColor: "#383b42",
                color: "#fff",
                paddingLeft: 18,
              }
            }}
            rightButtonsContainerStyle={{
              borderRadius: 25,
              right: 8,
              height: 30,
              top: 10,
              paddingLeft: 7,
              alignSelfs: "center",
              backgroundColor: "#383b42"
            }}
            // inputContainerStyle={{
            //   backgroundColor: "transparent"
            // }}
            suggestionsListContainerStyle={{
              backgroundColor: "#383b42",
            }}
            // containerStyle={{ flexGrow: 1, flexShrink: 1 }}
            renderItem={(item, text) => (
              
              <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              {item.title.toLowerCase().includes(searchValue.toLowerCase()) &&
              <>
                <Text style={{ color: "#fff", padding: 15 }}>{item.title}</Text>
                <Button title={"X"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.deleteIngredientButton} 
                onPress={() => onClickDelete(item.title, item.ingredients)}
                />
              </>
              }
                </View>
            )}
            // ChevronIconComponent={
            //   <Feather name="x-circle" size={18} color="#fff" />
            // }
            // ClearIconComponent={
            //   <Feather name="chevron-down" size={20} color="#fff" />
            // }
            inputHeight={50}
            // showChevron={false}
            showClear={false}
            rightTextExtractor={"test"}
            />}
            </View>
            <Button title={"+"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.newIngredientButton} 
              onPress={() => setOpenIngredientModal(true)}
              />
        </View>
      {ingredientList && ingredientList.length > 0
        &&
        <FlatList
        style={styles.flatList}
        nestedScrollEnabled={true}
        data={ingredientList.filter(i => i !== null)}
        keyExtractor={(item) => item.ingredients}
        renderItem={({ item }) => IngredientCard(item)}
        />}
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : null}
        <Spacer>
          <Button
            title={submitButtonText}
            onPress={() => onSubmit(recipeName, price, description, photo,  ingredientList.filter(i => i !== null ))}
            style={styles.createButton}
            />
        </Spacer>
        </>
        // </KeyboardAwareScrollView>
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
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15,
    width: "90%",
    height: "100%",
  },
  label: {
    color: "white",
  },
  flatList: {
    color: "white",
    height: 200,
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
    marginBottom: 10,
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
 newIngredientButton :{
  height: 40,
  minWidth: 40,
  maxWidth: 40,
  borderRadius: 40,
  marginBottom: 10,
  marginRight: 10,
  marginLeft: 10,
  marginTop: 10,
  backgroundColor: "rgba(0,0,0,0.65)",
 },
 deleteIngredientButton :{
  height: 40,
  minWidth: 40,
  maxWidth: 40,
  borderRadius: 40,
  marginRight: 10,
  marginLeft: 10,
  backgroundColor: "rgba(255,0,0,0.65)",
 },
 newRecipeButton :{
  height: 40,
  width: 80,
  borderRadius: 10,
  marginLeft: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  subContainer: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: "90%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  createButton: {
    position: "absolute",
    bottom: 0,
  },
});

export default RecipeForm;