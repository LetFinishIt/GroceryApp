import { SET_SELECTED_RECIPES } from '../actions/ActionTypes';

const initialState = {
    selectedRecipes: [],
};
// axios recipe reducer, used for updating global state, sorted by action type
const RecipeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_RECIPES:
            return { ...state, selectedRecipes: action.newSelectedRecipes };

        default:
            return state;
    }
};

export default RecipeReducer;