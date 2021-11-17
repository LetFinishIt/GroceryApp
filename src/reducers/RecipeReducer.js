import { SET_SELECTED_RECIPES } from '../actions/ActionTypes';

const initialState = {
    selectedRecipes: [],
};
const RecipeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_RECIPES:
            return { ...state, selectedRecipes: action.newSeletedRecipes };

        default:
            return state;
    }
};

export default RecipeReducer;