// ---------------------------------------------
// PART 1 — IMPORTS + SAFETY CHECK + BASE SETUP
// ---------------------------------------------

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Optional metadata for descriptions + videos
const exerciseMeta = {
  "Shoulder Press": {
    bodyPart: "Shoulders",
    description: "Overhead dumbbell press targeting deltoids.",
    video: "https://www.youtube.com/watch?v=B-aVuyhvLHU",
  },
  Squats: {
    bodyPart: "Legs",
    description: "Lower body movement targeting quads and glutes.",
    video: "https://www.youtube.com/watch?v=aclHkVaku9U",
  },
  // Add more as needed...
};

export default function WorkoutPlayerScreen({ route, navigation }) {

  // SAFETY CHECK — prevents crashes if workout is missing
  if (!route || !route.params || !route.params.workout) {
    return (
      <View style={styles.safeContainer}>
        <Text style={styles.safeText}>No workout loaded.</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("StartWorkout")}
          style={styles.safeButton}
        >
          <Text style={styles.safeButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // SAFE TO USE NOW
  const { workout } = route.params;

  // Track which exercise we are on
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const currentExercise = workout[exerciseIndex];

  // Extract exercise info
  const totalSets = currentExercise.sets || 1;
  const defaultReps = currentExercise.reps || 10;
  const defaultKg = currentExercise.kg || 0;
  const restTime = currentExercise.rest || 30;

  // Per-set state
  const [setStates, setSetStates] = useState(
    Array.from({ length: totalSets }).map(() => ({
      reps: String(defaultReps),
      kg: String(defaultKg),
      notes: "",
      status: "pending", // pending | resting | done
    }))
  );

  // Rest timer state
  const [activeRestSet, setActiveRestSet] = useState(null);
  const [restRemaining, setRestRemaining] = useState(0);
  const restIntervalRef = useRef(null);

// ---------------------------------------------
// PART 2 — REST TIMER + SET COMPLETION LOGIC
// ---------------------------------------------

// Handle rest countdown
useEffect(() => {
  if (activeRestSet === null || restRemaining <= 0) return;

  restIntervalRef.current = setInterval(() => {
    setRestRemaining((prev) => {
      if (prev <= 1) {
        clearInterval(restIntervalRef.current);

        // Mark set as done when rest finishes
        setSetStates((prevStates) => {
          const copy = [...prevStates];
          if (copy[activeRestSet]) {
            copy[activeRestSet] = {
              ...copy[activeRestSet],
              status: "done",
            };
          }
          return copy;
        });

        setActiveRestSet(null);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(restIntervalRef.current);
}, [activeRestSet, restRemaining]);

// When exercise changes, reset sets
useEffect(() => {
  const newExercise = workout[exerciseIndex];
  const newTotalSets = newExercise.sets || 1;
  const newDefaultReps = newExercise.reps || 10;
  const newDefaultKg = newExercise.kg || 0;

  setSetStates(
    Array.from({ length: newTotalSets }).map(() => ({
      reps: String(newDefaultReps),
      kg: String(newDefaultKg),
      notes: "",
      status: "pending",
    }))
  );

  setActiveRestSet(null);
  setRestRemaining(0);
}, [exerciseIndex]);

// Update a field inside a specific set
const handleChangeSetField = (index, field, value) => {
  setSetStates((prev) => {
    const copy = [...prev];
    copy[index] = { ...copy[index], [field]: value };
    return copy;
  });
};

// When user taps "Complete Set"
const handleCompleteSet = (setIndex) => {
  setSetStates((prev) => {
    const copy = [...prev];
    copy[setIndex] = { ...copy[setIndex], status: "resting" };
    return copy;
  });

  setActiveRestSet(setIndex);
  setRestRemaining(restTime);
};

// Check if all sets are done
const allSetsDone = setStates.every((s) => s.status === "done");

// Check if this is the last exercise
const isLastExercise = exerciseIndex === workout.length - 1;

  // ---------------------------------------------
// PART 3 — SAVE WORKOUT + NAVIGATION LOGIC
// ---------------------------------------------

// Save workout to history
const saveWorkoutToHistory = async () => {
  const timestamp = new Date().toISOString();

  const entry = {
    id: timestamp,
    date: timestamp,
    workout: workout,
  };

  try {
    const stored = await AsyncStorage.getItem("workoutHistory");
    const history = stored ? JSON.parse(stored) : [];

    history.push(entry);

    await AsyncStorage.setItem("workoutHistory", JSON.stringify(history));

    navigation.navigate("WorkoutHistory");
  } catch (error) {
    console.log("Error saving workout:", error);
  }
};

// Cancel workout
const handleCancel = () => {
  navigation.goBack();
};

// Move to next exercise
const handleNextExercise = () => {
  if (exerciseIndex + 1 < workout.length) {
    setExerciseIndex(exerciseIndex + 1);
  }
};

// ---------------------------------------------
// PART 4 — FULL UI LAYOUT
// ---------------------------------------------

// Metadata for header
const meta = exerciseMeta[currentExercise.name] || {};
const bodyPart = meta.bodyPart || "Unknown";
const description = meta.description || "No description available.";
const videoUrl = meta.video || null;

// Next 3 exercises preview
const nextExercises = workout.slice(exerciseIndex + 1, exerciseIndex + 4);

return (
  <View style={styles.mainContainer}>
    <ScrollView contentContainerStyle={styles.scrollContent}>

      {/* ---------------- HEADER ---------------- */}
      <View style={styles.headerCard}>
        <Text style={styles.exerciseTitle}>{currentExercise.name}</Text>

        <Text style={styles.exerciseMeta}>
          Target: {bodyPart} • Sets: {totalSets} • Reps: {defaultReps} • Rest: {restTime}s
        </Text>

        <Text style={styles.description}>{description}</Text>

        <Text style={styles.lastWeight}>
          Last workout weight: {defaultKg} kg
        </Text>

        {videoUrl && (
          <TouchableOpacity
            onPress={() => Linking.openURL(videoUrl)}
            style={styles.videoButton}
          >
            <Text style={styles.videoButtonText}>Watch Video</Text>
          </TouchableOpacity>
        )}

        {nextExercises.length > 0 && (
          <View style={styles.nextExercisesBox}>
            <Text style={styles.nextExercisesTitle}>Next exercises:</Text>
            {nextExercises.map((ex, idx) => (
              <Text key={idx} style={styles.nextExerciseItem}>
                • {ex.name}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* ---------------- SETS ---------------- */}
      {setStates.map((setState, i) => {
        const isResting = activeRestSet === i && setState.status === "resting";
        const isDone = setState.status === "done";

        return (
          <View
            key={i}
            style={[
              styles.setCard,
              isDone && styles.setCardDone
            ]}
          >
            <Text style={styles.setTitle}>Set {i + 1}</Text>

            {/* Reps + Weight */}
            <View style={styles.row}>
              <View style={styles.fieldBox}>
                <Text style={styles.fieldLabel}>Reps</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={setState.reps}
                  onChangeText={(text) =>
                    handleChangeSetField(i, "reps", text)
                  }
                />
              </View>

              <View style={styles.fieldBox}>
                <Text style={styles.fieldLabel}>Weight (kg)</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  value={setState.kg}
                  onChangeText={(text) =>
                    handleChangeSetField(i, "kg", text)
                  }
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.notesBox}>
              <Text style={styles.fieldLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                multiline
                value={setState.notes}
                onChangeText={(text) =>
                  handleChangeSetField(i, "notes", text)
                }
              />
            </View>

            {/* Complete Set / Rest Timer / Done */}
            {!isDone && !isResting && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleCompleteSet(i)}
              >
                <Text style={styles.completeButtonText}>Complete Set</Text>
              </TouchableOpacity>
            )}

            {isResting && (
              <View style={styles.restBox}>
                <Text style={styles.restText}>Rest: {restRemaining}s</Text>
              </View>
            )}

            {isDone && (
              <View style={styles.doneBox}>
                <Text style={styles.doneText}>Set Finished</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* ---------------- BOTTOM BUTTONS ---------------- */}
      <View style={styles.bottomButtonsRow}>

        {/* CANCEL */}
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        {/* NEXT EXERCISE OR SAVE & FINISH */}
        {isLastExercise ? (
          <TouchableOpacity
            style={[
              styles.finishButton,
              !allSetsDone && { opacity: 0.5 }
            ]}
            disabled={!allSetsDone}
            onPress={saveWorkoutToHistory}
          >
            <Text style={styles.finishText}>Save & Finish</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.nextExerciseButton,
              !allSetsDone && { opacity: 0.5 }
            ]}
            disabled={!allSetsDone}
            onPress={handleNextExercise}
          >
            <Text style={styles.nextExerciseText}>Next Exercise</Text>
          </TouchableOpacity>
        )}

      </View>
    </ScrollView>
  </View>
);
}   // ← ADD THIS BRACE RIGHT HERE

// ---------------------------------------------
// PART 5 — DARK MODE STYLES
// ---------------------------------------------
const styles = StyleSheet.create({

  // SAFETY SCREEN
  safeContainer: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  safeText: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
  },
  safeButton: {
    backgroundColor: "#ff6600",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  safeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  // MAIN LAYOUT
  mainContainer: {
    flex: 1,
    backgroundColor: "#111",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // HEADER
  headerCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6,
  },
  exerciseMeta: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 10,
  },
  lastWeight: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 12,
  },
  videoButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  videoButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  nextExercisesBox: {
    marginTop: 8,
  },
  nextExercisesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  nextExerciseItem: {
    fontSize: 14,
    color: "#ccc",
  },

  // SET CARDS
  setCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  setCardDone: {
    backgroundColor: "#0f3317",
    borderColor: "#28a745",
  },
  setTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  fieldBox: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#bbb",
    marginBottom: 4,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    color: "white",
    backgroundColor: "#222",
  },
  notesBox: {
    marginBottom: 12,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "white",
        backgroundColor: "#222",
    minHeight: 50,
  },

  // BUTTONS INSIDE SETS
  completeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  restBox: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#332b00",
  },
  restText: {
    color: "#ffcc00",
    fontSize: 16,
    fontWeight: "bold",
  },
  doneBox: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0f3317",
  },
  doneText: {
    color: "#28a745",
    fontSize: 16,
    fontWeight: "bold",
  },

  // BOTTOM BUTTONS
  bottomButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff0000",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  cancelText: {
    color: "#ff0000",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextExerciseButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#ff6600",
  },
  nextExerciseText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  finishButton: {
  flex: 1,
  borderRadius: 8,
  paddingVertical: 12,
  alignItems: "center",
  backgroundColor: "#28a745",
},

finishText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
},
});

