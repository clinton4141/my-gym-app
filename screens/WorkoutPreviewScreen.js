import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import useThemeColors from "../hooks/useThemeColors";

export default function WorkoutPreviewScreen({ route, navigation }) {
  const colors = useThemeColors();

  const {
    mode,
    equipment,
    warmup,
    cooldown,
    restTime,
    scheduledDay,
    exercises,
  } = route.params;

  const saveWorkout = async () => {
    const workout = {
      id: Date.now(),
      date: new Date().toISOString(),
      mode,
      equipment,
      warmup,
      cooldown,
      restTime,
      scheduledDay,
      exercises,
    };

    try {
      const existing = await AsyncStorage.getItem("workoutHistory");
      const history = existing ? JSON.parse(existing) : [];

      history.push(workout);

      await AsyncStorage.setItem("workoutHistory", JSON.stringify(history));

      alert("Workout Saved!");
      navigation.goBack();
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.bg }]}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <Text style={[styles.header, { color: colors.text }]}>
          Workout Preview
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.accent }]}>
          Scheduled Day
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {scheduledDay}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.accent }]}>
          Warm-up
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>{warmup}</Text>

        <Text style={[styles.sectionTitle, { color: colors.accent }]}>
          Exercises
        </Text>
        {exercises.map((ex, index) => (
          <View
            key={index}
            style={[
              styles.exerciseBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.exerciseName, { color: colors.text }]}>
              {ex.name}
            </Text>
            <Text style={[styles.value, { color: colors.subtext }]}>
              {ex.sets} sets × {ex.reps} reps
            </Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.accent }]}>
          Rest Time
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {restTime}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.accent }]}>
          Cooldown
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>{cooldown}</Text>

        <Text style={[styles.sectionTitle, { color: colors.accent }]}>
          Equipment
        </Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {equipment.length > 0 ? equipment.join(", ") : "None"}
        </Text>

        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.accent }]}
          onPress={() =>
            navigation.navigate("WorkoutPlayer", {
              exercises,
              restTime,
              warmup,
              cooldown,
            })
          }
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Start Workout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          onPress={saveWorkout}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Save Workout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  value: {
    fontSize: 18,
    marginTop: 4,
  },

  exerciseBox: {
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
  },

  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  startButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },

  saveButton: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
