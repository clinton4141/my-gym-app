import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutOverviewScreen({ navigation, route }) {
  const workout = route.params?.workout || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Workout</Text>

      <ScrollView style={{ marginBottom: 20 }}>
        {workout.map((ex, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate('ExerciseDetail', { exercise: ex })}
            activeOpacity={0.7}
          >
            <Text style={styles.exerciseName}>{ex.name}</Text>

            <Text style={styles.exerciseDetails}>
              {ex.sets} sets • {ex.reps} reps
            </Text>

            <Text style={styles.exerciseDetails}>
              {ex.kg ? `${ex.kg} kg` : '0 kg'} • {ex.rest}s rest
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* START WORKOUT BUTTON — moved up so it doesn't touch phone nav bar */}
      <TouchableOpacity
        style={styles.startButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('WorkoutPlayer', { workout })}
      >
        <Ionicons name="play-circle-outline" size={28} color="white" />
        <Text style={styles.startText}>Start Workout</Text>
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
    marginBottom: 20,
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },
  exerciseName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  exerciseDetails: {
    color: '#aaa',
    marginTop: 4
  },

  // 🔥 FIXED BUTTON — moved up so it’s fully clickable
  startButton: {
    backgroundColor: '#ff6600',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 60,   // ← moves button UP away from Android gesture bar
    marginTop: 10
  },
  startText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});



