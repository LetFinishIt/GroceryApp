import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import Spacer from './Spacer';

const AuthForm = ({ headerText, errorMessage, onSubmit, submitButtonText, isSignUp = false }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
    style={styles.form}
    >
      <Spacer />
      {isSignUp &&
      <>
        <Input
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="none"
          autoCorrect={false}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />
        <Input
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="none"
          autoCorrect={false}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />
      </>}
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
      <Input
        secureTextEntry
        label="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        labelStyle={styles.label}
        inputStyle={styles.input}
      />
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => onSubmit(email, password, firstName, lastName)}
        />
      </Spacer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginLeft: 15,
    marginTop: 15
  },
  form: {
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 15,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 10
  },
  label: {
    color: "white",
  },
  input: {
    color: "white",
  },
});

export default AuthForm;
