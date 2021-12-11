import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import Api from '../api/apiInstance';
import { Text, Button, Input, Card } from 'react-native-elements';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import CreateIngredientModal from './CreateIngredientModal';
import DeleteIngredientModal from './DeleteIngredientModal';

// Form for editing recipe information, accessible from recipe details
const EditRecipeForm = props => {
  const [recipeName, setRecipeName] = useState(props.recipeName);
  const [description, setDescription] = useState(props.description);
  const [price, setPrice] = useState(props.price);
  const [photo, setPhoto] = useState(props.photo);
  const recipeId = props.recipeId;
  const dropdownController = useRef(null)
  const searchRef = useRef(null)
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [openIngredientModal, setOpenIngredientModal] = useState(false);
  const [deleteIngId, setDeleteIngId] = useState("");
  const [deleteIngTitle, setDeleteIngTitle] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [recipeItem, setRecipeItem] = useState(props.recipeItem);

    // Decrease Quantity for ingredients
    const decrementQuantity = (clickedIngredients) => {
      let updatedSelectedingredient = recipeItem.filter(i => i !== null);
      let updatedIngredients = updatedSelectedingredient.find(selectedIngredient => selectedIngredient.ingredients === clickedIngredients.ingredients);
      updatedIngredients.itemQuantity --;
      setRecipeItem([...updatedSelectedingredient]);
    }
  
    // Increase Quantity for ingredients
    const incrementQuantity = (clickedIngredients) => {
      let updatedSelectedingredient = recipeItem.filter(i => i !== null);
      let updatedIngredients = updatedSelectedingredient.find(selectedIngredient => selectedIngredient.ingredients === clickedIngredients.ingredients);
      updatedIngredients.itemQuantity ++;
      setRecipeItem([...updatedSelectedingredient]);
    }
  
    // Remove ingredients
    const removeSelectedIngredients = (clickedIngredients) => {
      let updatedSelectedingredient = recipeItem.filter(i => i !== null);
      let otherSelectedIngredients = updatedSelectedingredient.filter(selectedIngredient => selectedIngredient.ingredients !== clickedIngredients.ingredients);
      setRecipeItem([...otherSelectedIngredients ]);
    }

  // make api call for first render
  useEffect(() => {
    loadOptions();
  }, [])

  // loading ingredients from backend
  const loadOptions = () => {
    Api()
    .get("ingredients")
    .then((response) => {
      const items = response.data.ingredients;
      const ingredients = items.map((item) => ({
        ingredients: item._id,
        title: item.ingredientName + " - " + item.unitType,
        itemQuantity : 0,
      }))
      const ingred = recipeItem.map((item) => ({
        ingredients: item.ingredients,
        title: items.find(selectedIngredient => selectedIngredient._id === item.ingredients).ingredientName + " - " + items.find(selectedIngredient => selectedIngredient._id === item.ingredients).unitType,
        itemQuantity : item.itemQuantity,
      }))
      setRecipeItem([...ingred]);
      setIngredientOptions(ingredients);
    })
  }
  // set information used by delete confirmation modal, triggering the modal to render
  const onClickDelete = (itemTitle, itemId) => {
    setDeleteIngTitle(itemTitle)
    setDeleteIngId(itemId)
  }
  // handle selected within dropdown
  const handleSelectIngredient = (item) => {
    setRecipeItem([...recipeItem,item]);
    setSearchValue("");
  }

  // Create card for loading item
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

  const body = {
    recipeName: recipeName,
    description: description,
    price: price,
    recipePhoto : photo, 
    isPrivate: false,
    recipeItem: recipeItem
  }

  // submit to backend
  const updateRecipe = () => {
    Api()
    .put("editRecipe/?recipeId="+ recipeId, body )
    .then((response) => {
      props.onClose();
    })
  }

  return(
    <View style={styles.ModalView}>  
      {/* Modal for creating ingredient */}
      <CreateIngredientModal
        onCancel={() => { setOpenIngredientModal(false) }}
        isVisible={openIngredientModal}
        reloadOptions={() => loadOptions()}
      />
      {/* Modal to confirm deleting ingredient */}
      <DeleteIngredientModal
        onCancel={() => { (setDeleteIngId(""), setDeleteIngTitle("")) }}
        isVisible={deleteIngId}
        ingredientId={deleteIngId}
        ingredientTitle={deleteIngTitle}
        reloadOptions={() => loadOptions()}
      />
      {/* Input fields for form */}
      <Input
        label="Recipe Name"
        value={recipeName}
        onChangeText={input=> setRecipeName(input)}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
        <Input
        label="Description"
        value={description}
        onChangeText={input=> setDescription(input)}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
      <Input
        label="Photo"
        value={photo}
        onChangeText={input=> setPhoto(input)}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
      <Input
        label="Price"
        value={price}
        onChangeText={input => setPrice(input)}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
      <View style={{width: "90%", marginLeft: "auto", marginRight: "auto", display: "flex", flexDirection: "row", alignItems: "center"}}>
        <View style={{width: "90%"}}>
        {deleteIngId === "" && !openIngredientModal &&
          // autocomplete dropdown search field for selecting ingredients
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
              handleSelectIngredient(item);
            }}
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
            inputContainerStyle={{
              backgroundColor: "transparent"
            }}
            suggestionsListContainerStyle={{
              backgroundColor: "#383b42",
            }}
            // optional parameter, overrides how each item is rendered
            renderItem={(item) => (
              <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              {item.title.toLowerCase().includes(searchValue.toLowerCase()) && // Checks if current search parameters match item title
              <>
                <Text style={{ color: "#fff", padding: 15 }}>{item.title}</Text>
                <Button title={"X"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.deleteIngredientButton} 
                onPress={() => onClickDelete(item.title, item.ingredients)}
                />
              </>
              }
                </View>
            )}
            inputHeight={50}
            showClear={false}
            rightTextExtractor={"test"}
            />}
            </View>
            <Button title={"+"} buttonStyle={{backgroundColor: "rgba(0,0,0,0.15)"}} containerStyle={styles.newIngredientButton} 
              onPress={() => setOpenIngredientModal(true)}
              />
      </View>
      {/* Render each selected ingredient */}
      <FlatList
      style={styles.flatList}
      data={recipeItem.filter(i => i !== null )}
      keyExtractor={(item) => item.ingredients}
      renderItem={({ item }) => IngredientCard(item)}
      />
      <Button 
      onPress={() => {
        updateRecipe();
        props.onClose();
      }} 
      title={"Submit"}
      containerStyle={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ModalView:{
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
    height: '90%',
  },
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
    height: 300,
  },
  input: {
    color: "white",
  },
  cardContainer: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 20,
    borderColor: "rgba(0,0,0,0.65)",
  },
  cardSubContainer: {
    textAlignVertical: "center",
    textAlign: "center",
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
 submitButton :{
  height: 40,
  width: 200,
  minWidth: 40,
  borderRadius: 40,
  marginBottom: 10,
  marginTop: 10,
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
export default EditRecipeForm;