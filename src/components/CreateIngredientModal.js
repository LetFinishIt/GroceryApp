import React, { useState } from 'react';
import { Text, Button, Input, Card } from 'react-native-elements';
import { KeyboardAvoidingView, StyleSheet, View, Dimensions, ImageBackground} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Api from '../api/apiInstance';

const styles = StyleSheet.create({
    absoluteContainer: {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        width: Dimensions.get("window").width,
        zIndex: 10,
    },
    container: {
        width: "90%",
        borderRadius: 20,
        borderColor: "black",
        borderWidth: 3,
        backgroundColor: "white",
        padding: 20,
    },
    hidden: {
        display: "none",
    },
    visible: {

    },
    buttonDiv: {
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    button: {
        width: "80%",
        minWidth: 100,
        maxWidth: 150,
    },
    description: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
        marginBottom: 40,
    },
    header: {
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
        fontWeight: "500",
    },
    label: {
        color: "black",
        fontWeight: "500",
        fontSize: 16
    },
    input: {
        color: "black",
        fontWeight: "500",
        fontSize: 16
    }
})

// Modal to pop up on screen when adding a new ingredient
const CreateIngredientModal = ({isVisible, onCancel, reloadOptions}) => {
    const [ingredientName, setIngredientName] = useState("");
    const [unitType, setUnitType] = useState("");
    const [calorie, setCalorie] = useState("");

    // Submit to backend - validates that user is signed in and form is completed before submitting
    const submitNewIngredient = async () => {
        let email = await SecureStore.getItemAsync("email");
        let userId = await SecureStore.getItemAsync("userId");
        if (email && userId && ingredientName && unitType && calorie) {
            let body = {
                ingredientName: ingredientName,
                unitType: unitType,
                calorie: calorie.toString(),
                user: userId,
                userEmail: email,
            }

            Api()
            .post("ingredient", body)
            .then((response) => {
                setIngredientName("");
                setUnitType("");
                setCalorie("");
                reloadOptions();
            })
            .then((response) => {
                onCancel();
            })
            .catch((err) => {
            })
        }
    }

    return (
        <>
        {/* Only render when modal is triggered */}
        {isVisible && 
            <View style={styles.absoluteContainer}>
                <KeyboardAvoidingView style={styles.container}>
                    <Text style={styles.header}>
                       Create New Ingredient
                    </Text>
                    <View
                    style={{margin: 10}}/>
                    {/* Form fields for name, unit type, and calories per unit */}
                    <Input
                    label="Ingredient Name"
                    value={ingredientName}
                    onChangeText={setIngredientName}
                    autoCapitalize="none"
                    autoCorrect={false}
                    labelStyle={styles.label}
                    inputStyle={styles.input}
                    maxLength={20}
                    />
                    <Input
                    label="Unit Type"
                    value={unitType}
                    onChangeText={setUnitType}
                    autoCapitalize="none"
                    autoCorrect={false}
                    labelStyle={styles.label}
                    inputStyle={styles.input}
                    maxLength={15}
                    />
                    <Input
                    label="Calories"
                    value={calorie}
                    keyboardType = 'numeric'
                    onChangeText={setCalorie}
                    autoCapitalize="none"
                    autoCorrect={false}
                    labelStyle={styles.label}
                    inputStyle={styles.input}
                    maxLength={5}
                    />
                    {/* Cancel and confirm buttons */}
                    <View style={styles.buttonDiv}>
                        <Button
                        onPress={() => onCancel()}
                        containerStyle={styles.cancelButton}
                        title={"Cancel"}
                        />
                        <Button
                        onPress={() => submitNewIngredient()}
                        containerStyle={styles.confirmButton}
                        title={"Confirm"}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        }
        </>
    )
}

export default CreateIngredientModal;