import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WaterScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Tracker</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff7f00',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  },
});
