import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddEquipmentScreen({ navigation }) {
  const [name, setName] = useState('');

  const saveEquipment = async () => {
    if (!name.trim()) return;

    const newItem = { name: name.trim() };

    const stored = await AsyncStorage.getItem('equipment');
    const parsed = stored ? JSON.parse(stored) : [];

    parsed.push(newItem);

    await AsyncStorage.setItem('equipment', JSON.stringify(parsed));

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Equipment</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Dumbbells"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveEquipment}>
        <Text style={styles.saveButtonText}>Save Equipment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 8
  },
  input: {
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#ff6600',
    borderRadius: 10,
    padding: 12,
    color: 'white',
    fontSize: 16
  },
  saveButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});


