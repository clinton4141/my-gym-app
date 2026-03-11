import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function WorkoutGenerator({ navigation }) {
  const [generatedWorkout, setGeneratedWorkout] = useState([]);

  const exercises = [
    { name: "Push Ups", sets: 3, reps: 12 },
    { name: "Squats", sets: 4, reps: 10 },
    { name: "Dumbbell Rows", sets: 3, reps: 12 },
    { name: "Lunges", sets: 3, reps: 10 },
    { name: "Shoulder Press", sets: 3, reps: 12 },
    { name: "Plank", sets: 3, reps: 45, time: true },
  ];

  const generateWorkout = () => {
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setGeneratedWorkout(selected);
  };

  const startWorkout = () => {
    navigation.navigate('WorkoutPreview', {
      workout: generatedWorkout,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Workout Generator</Text>

      <TouchableOpacity style={styles.button} onPress={generateWorkout}>
        <Text style={styles.buttonText}>Generate Workout</Text>
      </TouchableOpacity>

      {generatedWorkout.length > 0 && (
        <>
          <Text style={styles.subtitle}>Generated Exercises</Text>

          {generatedWorkout.map((ex, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{ex.name}</Text>
              <Text style={styles.cardText}>
                {ex.time
                  ? `${ex.sets} sets • ${ex.reps} sec`
                  : `${ex.sets} sets • ${ex.reps} reps`}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </>
      )}
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    color: '#FF7A00',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 5,
  },
  startButton: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  startButtonText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
