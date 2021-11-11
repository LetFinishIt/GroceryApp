// import { createAppContainer } from 'react-navigation';
// import { createStackNavigator } from 'react-navigation-stack';

// import SearchScreen from './src/screens/SearchScreen';
// import ResultsShowScreen from './src/screens/ResultsShowScreen';

// const navigator = createStackNavigator(
//   {
//     SearchScreen,
//     ResultsShow: ResultsShowScreen,
//   },
// );

// export default createAppContainer(navigator);

import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
//import { createBottomTabNavigator } from 'react-navigation-tabs';

//import AccountScreen from './src/screens/AccountScreen';
import SigninScreen from './src/screens/SigninScreen';
import SignupScreen from './src/screens/SignupScreen';
import RecipeList from './src/screens/RecipeList';
import RecipeDetails from './src/screens/RecipeDetails';
import { Provider as AuthProvider } from './src/context/AuthContext';
import { setNavigator } from './src/navigationRef';
//import ResolveAuthScreen from './src/screens/ResolveAuthScreen';
//import { Provider as LocationProvider } from './src/context/LocationContext';
//import { Provider as TrackProvider } from './src/context/TrackContext';
import { FontAwesome } from '@expo/vector-icons';

const trackListFlow = createStackNavigator({
  RecipeList: RecipeList,
  //TrackDetail: TrackDetailScreen,
});

trackListFlow.navigationOptions = {
  title: 'Tracks',
  tabBarIcon: <FontAwesome name="th-list" size={20} />,
};

const switchNavigator = createSwitchNavigator({
  //ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    Signin: SigninScreen,
    Signup: SignupScreen,
    RecipeList: RecipeList,
    RecipeDetails,
  }),
  // mainFlow: createBottomTabNavigator({
  //   trackListFlow,
  //   //TrackCreate: TrackCreateScreen,
  //   //Account: AccountScreen,
  // }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    // <TrackProvider>
    //   <LocationProvider>
    <AuthProvider>
          <App
            ref={(navigator) => {
              setNavigator(navigator);
            }}
          />
    </AuthProvider>
    //   </LocationProvider>
    // </TrackProvider>
  );
};