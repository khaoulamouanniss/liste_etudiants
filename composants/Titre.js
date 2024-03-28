// composants/Titre.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Titre = ({ children }) => (
  <Text style={styles.titre}>{children}</Text>
);

const styles = StyleSheet.create({
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
    padding: 20,
  },
});

export default Titre;
