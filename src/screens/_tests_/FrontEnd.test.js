import React from "react";
import renderer from 'react-test-renderer';
import AuthForm from "../../components/AuthForm";
import RecipeForm from "../../components/RecipeForm";
import SignInScreen from '../SigninScreen';


// test the style of the sign in form 
describe('<SignInForm />', () => {
    it('check for view style', () => {
      const tree = renderer.create(<AuthForm />).toJSON();
      // console.log('pay attention',tree);
      expect(tree.props.style.justifyContent).toContain('center');
    });
  });

  // Test the modal visibility 
describe('<RecipeForm />', () => {
    it('check for if the modal is close by default', () => {
        const testingObj = renderer.create(<RecipeForm />).toTree();
        console.log('print object',testingObj.rendered[0].props.isVisible);
        // expect(testingObj.rendered[0].props).toContain('center');
        //testingObj.findAllByType(type)
        expect(testingObj.rendered[0].props.isVisible).toEqual(false);
      });
});

// test('delete recipe', () => {
//     expect(deleteRecipe()).toBe('202');
//   });


