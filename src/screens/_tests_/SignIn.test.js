import React from "react";
import {render} from "@testing-library/react-native";
import SignIn from "../SigninScreen";

it("render default elements",() =>{

    const { getByPlaceholderText} = render(<SignIn />);

    //expect(getAllByText("Login"))
    getByPlaceholderText("example@gmail.com");
    getByPlaceholderText("*****");
});

// show invalid username 
// show invalid input messages 
// show invalid password error message
// handle valid input submission 

