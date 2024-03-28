// composants/Selecteur.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Selecteur = ({ selectedValue, onValueChange, items }) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}>
        {items.map((item, index) => (
          <Picker.Item key={index} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default Selecteur;
