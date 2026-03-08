import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <Text style={styles.header}>Clinton's Gym App</Text>

      {/* GRID */}
      <View style={styles.grid}>

        {/* Row 1 */}
        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate("StartWorkout")}
        >
          <Ionicons name="barbell-outline" size={32} color="white" />
          <Text style={styles.tileText}>Start Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate("Equipment")}
        >
          <Ionicons name="fitness-outline" size={32} color="white" />
          <Text style={styles.tileText}>Equipment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate("WorkoutHistory")}
        >
          <Ionicons name="time-outline" size={32} color="white" />
          <Text style={styles.tileText}>History</Text>
        </TouchableOpacity>

        {/* Row 2 — SETTINGS under Start Workout */}
        <TouchableOpacity
          style={styles.tile}
          onPress={() => navigation.navigate("Settings")}
        >
          <Ionicons name="settings-outline" size={32} color="white" />
          <Text style={styles.tileText}>Settings</Text>
        </TouchableOpacity>

        {/* Empty placeholders to keep grid alignment */}
        <View style={styles.placeholder} />
        <View style={styles.placeholder} />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  header: {
    color: "#ff6600",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  tile: {
    backgroundColor: "#ff6600",
    width: "28%",
    aspectRatio: 1, // perfect square
    borderRadius: 14,
    margin: "2%",
    alignItems: "center",
    justifyContent: "center",
  },

  tileText: {
    color: "white",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  placeholder: {
    width: "28%",
    aspectRatio: 1,
    margin: "2%",
  },
});

















