import { NavigationActions } from 'react-navigation';

let navigator;

// Method for updating navigator
export const setNavigator = nav => {
  navigator = nav;
};

// Navigator to route changes
export const navigate = (routeName, params) => {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
};
