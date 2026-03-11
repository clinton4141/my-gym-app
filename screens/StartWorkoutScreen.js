import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import useThemeColors from "../hooks/useThemeColors";

export default function StartWorkoutScreen() {
  const navigation = useNavigation();
  const colors = useThemeColors();

  const [mode, setMode] = useState("automatic");

  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [warmupOpen, setWarmupOpen] = useState(false);
  const [cooldownOpen, setCooldownOpen] = useState(false);
  const [restOpen, setRestOpen] = useState(false);
  const [dayOpen, setDayOpen] = useState(false);

  const equipmentAnim = useRef(new Animated.Value(0)).current;
  const exerciseAnim = useRef(new Animated.Value(0)).current;
  const warmupAnim = useRef(new Animated.Value(0)).current;
  const cooldownAnim = useRef(new Animated.Value(0)).current;
  const restAnim = useRef(new Animated.Value(0)).current;
  const dayAnim = useRef(new Animated.Value(0)).current;

  const animateDropdown = (anim, open) => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: 220,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exerciseDetails, setExerciseDetails] = useState({});

  const warmupOptions = ["None", "3 Minutes", "5 Minutes", "Stretching"];
  const cooldownOptions = ["None", "3 Minutes", "5 Minutes", "Stretching"];

  const [selectedWarmup, setSelectedWarmup] = useState("None");
  const [selectedCooldown, setSelectedCooldown] = useState("None");

  const restOptions = ["30 Seconds", "45 Seconds", "60 Seconds", "90 Seconds"];
  const [selectedRest, setSelectedRest] = useState("60 Seconds");

  const dayOptions = [
    "Today",
    "Tomorrow",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [selectedDay, setSelectedDay] = useState("Today");

  const equipmentList = ["Dumbbells", "Barbell", "Bench", "Bodyweight"];

  const exerciseList = [
    { name: "Push Ups", equipment: "Bodyweight" },
    { name: "Squats", equipment: "Bodyweight" },
    { name: "Bench Press", equipment: "Barbell" },
    { name: "Deadlift", equipment: "Barbell" },
    { name: "Shoulder Press", equipment: "Dumbbells" },
  ];

  const filteredExercises =
    selectedEquipment.length === 0
      ? exerciseList
      : exerciseList.filter((ex) =>
          selectedEquipment.includes(ex.equipment)
        );

  const toggleEquipment = (item) => {
    setSelectedEquipment((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleExercise = (item) => {
    setSelectedExercises((prev) => {
      const updated = prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item];

      if (!exerciseDetails[item]) {
        setExerciseDetails((d) => ({
          ...d,
          [item]: { sets: 3, reps: 10 },
        }));
      }

      return updated;
    });
  };

  const adjustValue = (exercise, field, amount) => {
    setExerciseDetails((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: Math.max(1, prev[exercise][field] + amount),
      },
    }));
  };

  const generateAutomaticWorkout = () => {
    const shuffled = [...exerciseList].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const autoExercises = selected.map((ex) => ({
      name: ex.name,
      sets: 3,
      reps: 12,
    }));

    navigation.navigate("WorkoutPreview", {
      mode: "automatic",
      equipment: ["Auto"],
      warmup: "None",
      cooldown: "None",
      restTime: "60 Seconds",
      scheduledDay: "Today",
      exercises: autoExercises,
    });
  };

  const renderDropdown = (anim, open, items) => {
    const height = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, items.length * 45],
    });

    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View style={{ height, opacity, overflow: "visible" }}>
        {items}
      </Animated.View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 250 }}
    >
      <Text style={[styles.header, { color: colors.text }]}>Start Workout</Text>

      {/* MODE TOGGLE */}
      <View style={styles.toggleContainer}>
        <Text
          style={[
            styles.toggleLabel,
            { color: mode === "automatic" ? colors.accent : colors.subtext },
          ]}
        >
          Automatic
        </Text>

        <TouchableOpacity
          style={[styles.toggleSwitch, { backgroundColor: colors.card }]}
          onPress={() => setMode(mode === "automatic" ? "manual" : "automatic")}
        >
          <View
            style={[
              styles.toggleCircle,
              {
                marginLeft: mode === "manual" ? 28 : 0,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.toggleLabel,
            { color: mode === "manual" ? colors.accent : colors.subtext },
          ]}
        >
          Manual
        </Text>
      </View>

      {/* AUTOMATIC MODE */}
      {mode === "automatic" && (
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Automatic Mode
          </Text>
          <Text style={[styles.placeholder, { color: colors.subtext }]}>
            Tap below to generate a workout automatically.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={generateAutomaticWorkout}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Generate Workout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MANUAL MODE */}
      {mode === "manual" && (
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Manual Mode
          </Text>

          {/* EQUIPMENT */}
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => {
              setEquipmentOpen(!equipmentOpen);
              animateDropdown(equipmentAnim, !equipmentOpen);
            }}
          >
            <Text
              style={[styles.dropdownHeaderText, { color: colors.text }]}
            >
              Equipment
            </Text>
          </TouchableOpacity>

          {renderDropdown(
            equipmentAnim,
            equipmentOpen,
            equipmentList.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => toggleEquipment(item)}
              >
                <Text
                  style={[styles.dropdownItemText, { color: colors.text }]}
                >
                  {selectedEquipment.includes(item) ? "✓ " : "○ "}
                  {item}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* EXERCISES */}
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => {
              setExerciseOpen(!exerciseOpen);
              animateDropdown(exerciseAnim, !exerciseOpen);
            }}
          >
            <Text
              style={[styles.dropdownHeaderText, { color: colors.text }]}
            >
              Exercises
            </Text>
          </TouchableOpacity>

          {renderDropdown(
            exerciseAnim,
            exerciseOpen,
            filteredExercises.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => toggleExercise(item.name)}
              >
                <Text
                  style={[styles.dropdownItemText, { color: colors.text }]}
                >
                  {selectedExercises.includes(item.name) ? "✓ " : "○ "}
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* SETS & REPS */}
          {selectedExercises.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Sets & Reps
              </Text>

              {selectedExercises.map((exercise, index) => (
                <View
                  key={index}
                  style={[
                    styles.setsRepsRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.exerciseName, { color: colors.text }]}
                  >
                    {exercise}
                  </Text>

                  <View style={styles.counterGroup}>
                    <Text
                      style={[styles.counterLabel, { color: colors.subtext }]}
                    >
                      Sets
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.counterButton,
                        { backgroundColor: colors.border },
                      ]}
                      onPress={() => adjustValue(exercise, "sets", -1)}
                    >
                      <Text
                        style={[
                          styles.counterButtonText,
                          { color: colors.text },
                        ]}
                      >
                        -
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.counterValue,
                        { color: colors.text },
                      ]}
                    >
                      {exerciseDetails[exercise]?.sets}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.counterButton,
                        { backgroundColor: colors.border },
                      ]}
                      onPress={() => adjustValue(exercise, "sets", 1)}
                    >
                      <Text
                        style={[
                          styles.counterButtonText,
                          { color: colors.text },
                        ]}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.counterGroup}>
                    <Text
                      style={[styles.counterLabel, { color: colors.subtext }]}
                    >
                      Reps
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.counterButton,
                        { backgroundColor: colors.border },
                      ]}
                      onPress={() => adjustValue(exercise, "reps", -1)}
                    >
                      <Text
                        style={[
                          styles.counterButtonText,
                          { color: colors.text },
                        ]}
                      >
                        -
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.counterValue,
                        { color: colors.text },
                      ]}
                    >
                      {exerciseDetails[exercise]?.reps}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.counterButton,
                        { backgroundColor: colors.border },
                      ]}
                      onPress={() => adjustValue(exercise, "reps", 1)}
                    >
                      <Text
                        style={[
                          styles.counterButtonText,
                          { color: colors.text },
                        ]}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* WARM-UP */}
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => {
              setWarmupOpen(!warmupOpen);
              animateDropdown(warmupAnim, !warmupOpen);
            }}
          >
            <Text
              style={[styles.dropdownHeaderText, { color: colors.text }]}
            >
              Warm-up: {selectedWarmup}
            </Text>
          </TouchableOpacity>

          {renderDropdown(
            warmupAnim,
            warmupOpen,
            warmupOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedWarmup(item);
                  setWarmupOpen(false);
                  animateDropdown(warmupAnim, false);
                }}
              >
                <Text
                  style={[styles.dropdownItemText, { color: colors.text }]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* COOLDOWN */}
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => {
              setCooldownOpen(!cooldownOpen);
              animateDropdown(cooldownAnim, !cooldownOpen);
            }}
          >
            <Text
              style={[styles.dropdownHeaderText, { color: colors.text }]}
            >
              Cooldown: {selectedCooldown}
            </Text>
          </TouchableOpacity>

          {renderDropdown(
            cooldownAnim,
            cooldownOpen,
            cooldownOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedCooldown(item);
                  setCooldownOpen(false);
                  animateDropdown(cooldownAnim, false);
                }}
              >
                <Text
                  style={[styles.dropdownItemText, { color: colors.text }]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* REST TIME */}
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => {
              setRestOpen(!restOpen);
              animateDropdown(restAnim, !restOpen);
            }}
          >
            <Text
              style={[styles.dropdownHeaderText, { color: colors.text }]}
            >
              Rest Time: {selectedRest}
            </Text>
          </TouchableOpacity>

          {renderDropdown(
            restAnim,
            restOpen,
            restOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedRest(item);
                  setRestOpen(false);
                  animateDropdown(restAnim, false);
                }}
              >
                <Text
                  style={[styles.dropdownItemText, { color: colors.text }]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* SCHEDULED DAY */}
          <TouchableOpacity
            style={[
              styles.dropdownHeader,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() => {
              setDayOpen(!dayOpen);
              animateDropdown(dayAnim, !dayOpen);
            }}
          >
            <Text
              style={[styles.dropdownHeaderText, { color: colors.text }]}
            >
              Scheduled Day: {selectedDay}
            </Text>
          </TouchableOpacity>

          {renderDropdown(
            dayAnim,
            dayOpen,
            dayOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedDay(item);
                  setDayOpen(false);
                  animateDropdown(dayAnim, false);
                }}
              >
                <Text
                  style={[styles.dropdownItemText, { color: colors.text }]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* PREVIEW WORKOUT */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.accent }]}
            onPress={() =>
              navigation.navigate("WorkoutPreview", {
                mode,
                equipment: selectedEquipment,
                warmup: selectedWarmup,
                cooldown: selectedCooldown,
                restTime: selectedRest,
                scheduledDay: selectedDay,
                exercises: selectedExercises.map((ex) => ({
                  name: ex,
                  sets: exerciseDetails[ex]?.sets || 3,
                  reps: exerciseDetails[ex]?.reps || 10,
                })),
              })
            }
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Preview Workout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  toggleSwitch: {
    width: 50,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  placeholder: {
    marginBottom: 20,
  },

  dropdownHeader: {
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
  },
  dropdownHeaderText: {
    fontSize: 18,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 16,
  },

  setsRepsRow: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
  },

  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  counterGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  counterLabel: {
    width: 50,
  },

  counterButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },

  counterButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  counterValue: {
    fontSize: 18,
    width: 30,
    textAlign: "center",
  },

  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});











