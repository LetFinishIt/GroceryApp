import React from "react";
import renderer from 'react-test-renderer';
import AuthForm from "../../components/AuthForm";
import RecipeForm from "../../components/RecipeForm";
import EditRecipeForm from "../../components/EditRecipeForm";

// hide warnings for tests to make results easier to see
const originalWarn = console.error.bind(console.error)
beforeAll(() => {
  console.error = (msg) => 
    !msg.toString().includes('') && originalWarn(msg)
});
// test the style of the sign in form 
describe('<SignInForm />', () => {
    it('check for view style', () => {
      const tree = renderer.create(<AuthForm />).toJSON();
      expect(tree.props.style.justifyContent).toContain('center');
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
