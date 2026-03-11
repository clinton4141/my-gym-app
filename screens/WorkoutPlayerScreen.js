import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useThemeColors from "../hooks/useThemeColors";

export default function WorkoutPlayerScreen({ route, navigation }) {
  const colors = useThemeColors();
  const workout = route.params;

  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.bg }]}
      >
        <Text style={[styles.header, { color: colors.text }]}>
          No workout loaded
        </Text>
        <TouchableOpacity
          style={[styles.orangeButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.orangeButtonText, { color: colors.text }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { exercises, restTime } = workout;

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setStates, setSetStates] = useState({});
  const [timerValues, setTimerValues] = useState({});
  const [activeTimers, setActiveTimers] = useState({});

  const beepSound = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/beep.mp3")
      );
      beepSound.current = sound;
    };

    loadSound();

    return () => {
      if (beepSound.current) {
        beepSound.current.unloadAsync();
      }
    };
  }, []);

  const playBeep = async () => {
    try {
      if (beepSound.current) {
        await beepSound.current.replayAsync();
      }
    } catch (error) {
      console.log("Beep error:", error);
    }
  };

  const currentExercise = exercises[exerciseIndex];
  if (!currentExercise) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.bg }]}
      >
        <Text style={[styles.header, { color: colors.text }]}>
          Invalid exercise
        </Text>
        <TouchableOpacity
          style={[styles.orangeButton, { backgroundColor: colors.accent }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.orangeButtonText, { color: colors.text }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const totalSets = currentExercise.sets || 1;

  useEffect(() => {
    if (!setStates[exerciseIndex]) {
      const initial = {};
      for (let i = 1; i <= totalSets; i++) {
        initial[i] = {
          reps: currentExercise.reps || 10,
          weight: "",
          notes: "",
          completed: false,
          timerRunning: false,
        };
      }
      setSetStates((prev) => ({ ...prev, [exerciseIndex]: initial }));
    }
  }, [exerciseIndex]);

  const updateField = (setNum, field, value) => {
    setSetStates((prev) => ({
      ...prev,
      [exerciseIndex]: {
        ...prev[exerciseIndex],
        [setNum]: {
          ...prev[exerciseIndex][setNum],
          [field]: value,
        },
      },
    }));
  };

  const startTimer = (setNum) => {
    const seconds = parseInt(restTime) || 30;

    setActiveTimers((prev) => ({ ...prev, [setNum]: true }));
    setTimerValues((prev) => ({ ...prev, [setNum]: seconds }));

    const interval = setInterval(() => {
      setTimerValues((prev) => {
        const newVal = prev[setNum] - 1;

        if (newVal === 3) playBeep();
        if (newVal === 2) playBeep();
        if (newVal === 1) playBeep();

        if (newVal <= 0) {
          clearInterval(interval);
          setActiveTimers((prev) => ({ ...prev, [setNum]: false }));

          playBeep();

          updateField(setNum, "completed", true);
          updateField(setNum, "timerRunning", false);
        }

        return { ...prev, [setNum]: newVal };
      });
    }, 1000);
  };

  const completeSet = (setNum) => {
    updateField(setNum, "timerRunning", true);
    startTimer(setNum);
  };

  const saveWorkoutToHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem("workout_history");
      const history = stored ? JSON.parse(stored) : [];

      const summary = {
        date: new Date().toISOString().split("T")[0],
        timestamp: Date.now(),
        exercises: exercises.map((ex, idx) => {
          const setsForExercise = setStates[idx]
            ? Object.values(setStates[idx]).map((s) => ({
                reps: Number(s.reps) || 0,
                weight: Number(s.weight) || 0,
              }))
            : [];

          return {
            name: ex.name,
            sets: setsForExercise,
          };
        }),
      };

      history.push(summary);
      await AsyncStorage.setItem("workout_history", JSON.stringify(history));
    } catch (e) {
      console.log("Error saving workout history:", e);
    }
  };

  const goNextExercise = async () => {
    if (exerciseIndex < exercises.length - 1) {
      setExerciseIndex(exerciseIndex + 1);
    } else {
      await saveWorkoutToHistory();
      navigation.navigate("MainTabs", { screen: "Home" });
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bg }]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: colors.text }]}>
          {currentExercise.name}
        </Text>
        <Text style={[styles.infoText, { color: colors.subtext }]}>
          Targets: {currentExercise.target || "N/A"}
        </Text>
        <Text style={[styles.infoText, { color: colors.subtext }]}>
          {totalSets} sets × {currentExercise.reps || 10} reps × {restTime}s
          {" "}rest
        </Text>
        <Text style={[styles.infoText, { color: colors.subtext }]}>
          Last weight: {currentExercise.lastWeight || "N/A"}
        </Text>

        {setStates[exerciseIndex] &&
          Object.keys(setStates[exerciseIndex]).map((setNum) => {
            const s = setStates[exerciseIndex][setNum];
            const timer = timerValues[setNum] || restTime;

            return (
              <View
                key={setNum}
                style={[
                  styles.card,
                  {
                    backgroundColor: s.completed
                      ? "#00cc00"
                      : colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Set {setNum}
                </Text>

                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.subtext }]}>
                      Reps
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.bg,
                          color: colors.text,
                        },
                      ]}
                      keyboardType="numeric"
                      value={String(s.reps)}
                      onChangeText={(v) => updateField(setNum, "reps", v)}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.subtext }]}>
                      Weight
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.bg,
                          color: colors.text,
                        },
                      ]}
                      keyboardType="numeric"
                      value={String(s.weight)}
                      onChangeText={(v) => updateField(setNum, "weight", v)}
                    />
                  </View>
                </View>

                <Text style={[styles.label, { color: colors.subtext }]}>
                  Notes
                </Text>
                <TextInput
                  style={[
                    styles.notes,
                    {
                      backgroundColor: colors.bg,
                      color: colors.text,
                    },
                  ]}
                  multiline
                  value={s.notes}
                  onChangeText={(v) => updateField(setNum, "notes", v)}
                />

                {!s.completed && !s.timerRunning && (
                  <TouchableOpacity
                    style={[
                      styles.orangeButton,
                      { backgroundColor: colors.accent },
                    ]}
                    onPress={() => completeSet(setNum)}
                  >
                    <Text
                      style={[styles.orangeButtonText, { color: colors.text }]}
                    >
                      Complete Set
                    </Text>
                  </TouchableOpacity>
                )}

                {s.timerRunning && (
                  <View
                    style={[
                      styles.timerButton,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <Text
                      style={[styles.timerText, { color: colors.accent }]}
                    >
                      Rest: {timer}s
                    </Text>
                  </View>
                )}
              </View>
            );
          })}

        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.cancelButton,
              { backgroundColor: colors.accent },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text
              style={[styles.cancelButtonText, { color: colors.text }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.orangeButtonBottom,
              { backgroundColor: colors.accent },
            ]}
            onPress={goNextExercise}
          >
            <Text
              style={[styles.orangeButtonText, { color: colors.text }]}
            >
              {exerciseIndex === exercises.length - 1
                ? "Save & Finish"
                : "Next Exercise"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  infoText: {
    fontSize: 16,
    marginBottom: 4,
  },

  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  inputGroup: {
    width: "48%",
  },

  label: {
    marginBottom: 4,
  },

  input: {
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },

  notes: {
    padding: 10,
    borderRadius: 8,
    height: 60,
    marginBottom: 10,
  },

  orangeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  orangeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  timerButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  timerText: {
    fontSize: 18,
  },

  bottomButtonsContainer: {
    marginTop: 30,
    marginBottom: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  cancelButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  orangeButtonBottom: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});




