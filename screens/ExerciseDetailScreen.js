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
      <Text style={styles.title}>{exercise.name}</Text>

      <Text style={styles.info}>Sets: {exercise.sets}</Text>
      <Text style={styles.info}>Reps: {exercise.reps}</Text>

      {/* 🔥 CHANGED: Removed work, added KG */}
      <Text style={styles.info}>Weight: {exercise.kg ? exercise.kg : 0} kg</Text>

      <Text style={styles.info}>Rest: {exercise.rest}s</Text>

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
    paddingHorizontal: 20
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  info: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 10
  },
  backButton: {
    marginTop: 40,
    backgroundColor: '#ff6600',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  backText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

