import React from 'react';
import { Text, Button } from 'react-native-elements';
import { KeyboardAvoidingView, StyleSheet, View, Dimensions, ImageBackground} from 'react-native';
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

const DeleteIngredientModal = ({isVisible, ingredientId, ingredientTitle, onCancel, reloadOptions}) => {

    const deleteIngredient = async () => {
        Api()
        .delete(`ingredients/?ingredientId=${ingredientId}`)
        .then((response) => {
            reloadOptions();
            onCancel();
        })
        .catch((err) => {
        })
    }

    return (
        <>
        {isVisible !== "" && 
            <View style={styles.absoluteContainer}>
                <KeyboardAvoidingView style={styles.container}>
                    <Text style={styles.header}>
                       Delete this ingredient?
                    </Text>
                    <View
                    style={{margin: 10}}/>
                    <Text style={styles.header}>
                       {ingredientTitle}
                    </Text>
                    <View
                    style={{margin: 10}}/>
                    <View style={styles.buttonDiv}>
                        <Button
                        onPress={() => onCancel()}
                        containerStyle={styles.cancelButton}
                        title={"Cancel"}
                        />
                        <Button
                        onPress={() => deleteIngredient()}
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

export default DeleteIngredientModal;