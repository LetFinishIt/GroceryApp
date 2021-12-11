import React from "react";
import renderer from 'react-test-renderer';
import AuthForm from "../../components/AuthForm";
import RecipeForm from "../../components/RecipeForm";

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

