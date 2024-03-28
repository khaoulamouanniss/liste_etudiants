// composants/EntreeTexte.js
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const EntreeTexte = (props) => (
  <TextInput
    style={styles.input}
    {...props}  // Spread all other props to the TextInput
  />
);

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default EntreeTexte;
