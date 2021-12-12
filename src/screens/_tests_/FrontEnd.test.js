import React from "react";
import renderer from 'react-test-renderer';
import RecipeForm from "../../components/RecipeForm";
import EditRecipeForm from "../../components/EditRecipeForm";
import DeleteIngredientForm from "../../components/DeleteIngredientModal";

// hide warnings for tests to make results easier to see
const originalWarn = console.error.bind(console.error)
beforeAll(() => {
  console.error = (msg) => 
    !msg.toString().includes('') && originalWarn(msg)
});
// test the style of the delete ingredient form 
describe('<DeleteIngredientForm />', () => {     
  it('check for view style', () => {       
    const tree = renderer.create(<DeleteIngredientForm />).toJSON();       
    expect(tree.props.style.alignItems).toContain('center');     
  });   
});

// Test the modal visibility 
describe('<RecipeForm />', () => {
    it('check for if the modal is close by default', () => {
        const testingObj = renderer.create(<RecipeForm />).toTree();
        expect(testingObj.rendered[0].props.isVisible).toEqual(false);
      });
});

// Test Data Passing for Editing Form 
describe('<EditRecipeForm />', () => {
  it('check if the recipe data get render correctly inside the edit form', () => {
      const arrayItem = [{ingredients: "12345678", itemQuantity: 12}];
      const testingObj1 = renderer.create(<EditRecipeForm recipeItem={arrayItem}/>).toTree();
      expect(testingObj1.props.recipeItem[0].itemQuantity).toEqual(12);
    });
});
