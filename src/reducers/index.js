import { combineReducers } from 'redux';
import RecipeReducer from './RecipeReducer';

// root reducer for axios, currently used for recipe reducer but allows scaling into other reducers while maintaining organization
export default rootReducer = combineReducers({
  recipeItems: RecipeReducer,
});
