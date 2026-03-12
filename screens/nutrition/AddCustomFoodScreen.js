import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function AddCustomFoodScreen({ route, navigation }) {
  const { barcode } = route.params || {};

  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    if (barcode) {
      console.log('Scanned barcode:', barcode);

      // 🔥 This is where auto‑lookup will go later
      // fetchNutritionFromBarcode(barcode);
    }
  }, [barcode]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Custom Food</Text>

      {barcode && (
        <Text style={styles.barcodeText}>Scanned Barcode: {barcode}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Food Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Calories"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />

      <TextInput
        style={styles.input}
        placeholder="Carbs (g)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={carbs}
        onChangeText={setCarbs}
      />

      <TextInput
        style={styles.input}
        placeholder="Fat (g)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={fat}
        onChangeText={setFat}
      />

      <TextInput
        style={styles.input}
        placeholder="Serving Size"
        placeholderTextColor="#888"
        value={servingSize}
        onChangeText={setServingSize}
      />

      <TextInput
        style={styles.input}
        placeholder="Unit (g, ml, cup, etc.)"
        placeholderTextColor="#888"
        value={unit}
        onChangeText={setUnit}
      />

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveText}>Save Food</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  barcodeText: {
    color: '#ff7f00',
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#333',
    borderWidth: 1,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#ff7f00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
