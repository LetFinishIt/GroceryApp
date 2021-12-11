import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import RecipeList from './src/screens/RecipeList';
import RecipeDetails from './src/screens/RecipeDetails';
import SelectedRecipes from './src/screens/SelectedRecipes';
import GroceryList from './src/screens/GroceryList';
import AddRecipes from './src/screens/AddRecipes';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { setNavigator } from './src/navigationRef';
import { FontAwesome } from '@expo/vector-icons';
// Tracks for nav header information
const trackListFlow = createStackNavigator({
  RecipeList: RecipeList,
});
// Map navigation options
trackListFlow.navigationOptions = {
  title: 'Tracks',
  tabBarIcon: <FontAwesome name="th-list" size={20} />,
};
// Switch navigator for changing screens
const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Signin: SigninScreen,
    Signup: SignupScreen,
    RecipeList: RecipeList,
    RecipeDetails,
    SelectedRecipes,
    GroceryList,
    AddRecipes,
  }),
});
// Create container using navigator
const App = createAppContainer(switchNavigator);

export default () => {
  return (
    // Wrap app components in auth provider
      <AuthProvider>
        {/* Wrap app components in axios global state provider */}
        <Provider store={store}>
            <App
              ref={(navigator) => {
                setNavigator(navigator);
              }}
            />
      </Provider>
    </AuthProvider>
  );
};