import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function WorkoutHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout History</Text>
      <Text style={styles.subtitle}>Your past workouts will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#ff6600",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
});
