import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
import Api from "../api/apiInstance";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return { errorMessage: "", token: action.payload };
    case "clear_error_message":
      return { ...state, errorMessage: "" };
    case "signout":
      return { token: null, errorMessage: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({ type: "signin", payload: token });
    navigate("RecipeList");
  } else {
    navigate("Signup");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const signup = (dispatch) => async ({ email, password, firstName , lastName }) => {
  try {
    console.log('sign up got call ');
    const body = {
      email: email,
      password: password,
      first_name: firstName,
      last_name: lastName,
      role: "admin",
      securityQuestion: "What is your first car",
      securityAnswer: "Honda"
    }
    Api()
    .post("/register", body, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((response) => {
      navigate("Signin");
    });
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign up",
    });
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  try {
    const body = {
      email: email,
      password: password
    }

    Api()
    .post("login", body, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      navigate("RecipeList");
    })
    await AsyncStorage.setItem("token", response.data.accessToken);
    dispatch({ type: "signin", payload: response.data.accessToken});
    navigate("RecipeList");
  } catch (err) {
    dispatch({
      type: "add_error",
      payload: "Something went wrong with sign in",
    });
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("loginFlow");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, clearErrorMessage, tryLocalSignin },
  { token: null, errorMessage: "" }
);
