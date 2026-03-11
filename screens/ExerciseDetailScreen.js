import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ExerciseDetailScreen({ route, navigation }) {
  const exercise = route.params?.exercise;

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No exercise found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.title}>{exercise.name}</Text>

      {/* INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Sets</Text>
        <Text style={styles.value}>{exercise.sets}</Text>

        <Text style={styles.label}>Reps</Text>
        <Text style={styles.value}>{exercise.reps}</Text>

        <Text style={styles.label}>Weight</Text>
        <Text style={styles.value}>{exercise.kg ? exercise.kg : 0} kg</Text>

        <Text style={styles.label}>Rest</Text>
        <Text style={styles.value}>{exercise.rest}s</Text>
      </View>

      {/* BACK BUTTON */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
    marginBottom: 30,
  },

  label: {
    color: '#ff6600',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  value: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },

  backButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  backText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


