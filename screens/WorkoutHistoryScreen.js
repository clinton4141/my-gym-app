import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useThemeColors from "../hooks/useThemeColors";

export default function WorkoutHistoryScreen({ navigation }) {
  const colors = useThemeColors();

  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exerciseFilter, setExerciseFilter] = useState("");

  const [csvModalVisible, setCsvModalVisible] = useState(false);
  const [csvText, setCsvText] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem("workout_history");
      const parsed = stored ? JSON.parse(stored) : [];

      parsed.sort((a, b) => b.timestamp - a.timestamp);
      setHistory(parsed);
    } catch (e) {
      console.log("Error loading history:", e);
    }
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const deleteWorkout = (index) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const updated = [...history];
              updated.splice(index, 1);
              setHistory(updated);
              await AsyncStorage.setItem(
                "workout_history",
                JSON.stringify(updated)
              );
            } catch (e) {
              console.log("Error deleting workout:", e);
            }
          },
        },
      ]
    );
  };

  const calculateVolume = (workout) => {
    return workout.exercises.reduce((sum, ex) => {
      const exVol = ex.sets.reduce(
        (s, set) =>
          s + (Number(set.reps) || 0) * (Number(set.weight) || 0),
        0
      );
      return sum + exVol;
    }, 0);
  };

  const allExercises = Array.from(
    new Set(history.flatMap((w) => w.exercises.map((ex) => ex.name)))
  );

  const filteredHistory = history.filter((workout) => {
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchesSearch = workout.exercises.some((ex) =>
        ex.name.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    if (startDate && new Date(workout.date) < new Date(startDate)) return false;
    if (endDate && new Date(workout.date) > new Date(endDate)) return false;

    if (exerciseFilter) {
      const matchesExercise = workout.exercises.some(
        (ex) => ex.name === exerciseFilter
      );
      if (!matchesExercise) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setExerciseFilter("");
  };

  const generateCSV = () => {
    let csv = "Date,Exercise,Set #,Reps,Weight\n";

    history.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        ex.sets.forEach((set, index) => {
          csv += `${workout.date},${ex.name},${index + 1},${set.reps},${set.weight}\n`;
        });
      });
    });

    setCsvText(csv);
    setCsvModalVisible(true);
  };

  const copyCSV = () => {
    Alert.alert(
      "Clipboard Not Available",
      "Copying CSV requires a development build. You can still scroll and manually copy the text."
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Workout History
        </Text>

        <TouchableOpacity
          style={[styles.exportButton, { backgroundColor: colors.accent }]}
          onPress={generateCSV}
        >
          <Text style={[styles.exportButtonText, { color: colors.text }]}>
            Export CSV
          </Text>
        </TouchableOpacity>

        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Search by exercise name..."
          placeholderTextColor={colors.subtext}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setFilterOpen(!filterOpen)}
        >
          <Text style={[styles.filterToggleText, { color: colors.accent }]}>
            {filterOpen ? "Hide Filters ▲" : "Show Filters ▼"}
          </Text>
        </TouchableOpacity>

        {filterOpen && (
          <View
            style={[
              styles.filterPanel,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.filterLabel, { color: colors.subtext }]}>
              Start Date (YYYY-MM-DD)
            </Text>
            <TextInput
              style={[
                styles.filterInput,
                {
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="2026-01-01"
              placeholderTextColor={colors.subtext}
            />

            <Text style={[styles.filterLabel, { color: colors.subtext }]}>
              End Date (YYYY-MM-DD)
            </Text>
            <TextInput
              style={[
                styles.filterInput,
                {
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="2026-12-31"
              placeholderTextColor={colors.subtext}
            />

            <Text style={[styles.filterLabel, { color: colors.subtext }]}>
              Filter by Exercise
            </Text>

            <View style={styles.dropdown}>
              {allExercises.map((name) => (
                <TouchableOpacity
                  key={name}
                  style={[
                    styles.dropdownItem,
                    {
                      backgroundColor:
                        exerciseFilter === name ? colors.accent : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() =>
                    setExerciseFilter(exerciseFilter === name ? "" : name)
                  }
                >
                  <Text style={[styles.dropdownText, { color: colors.text }]}>
                    {name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.clearButton,
                { backgroundColor: colors.accent },
              ]}
              onPress={clearFilters}
            >
              <Text style={[styles.clearButtonText, { color: colors.text }]}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {filteredHistory.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No workouts found.
          </Text>
        ) : (
          filteredHistory.map((workout, index) => {
            const volume = calculateVolume(workout);
            const isOpen = expanded[index];

            return (
              <View
                key={workout.timestamp}
                style={[
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() =>
                    navigation.navigate("WorkoutDetail", { workout })
                  }
                >
                  <View>
                    <Text style={[styles.cardDate, { color: colors.text }]}>
                      {workout.date}
                    </Text>
                    <Text style={[styles.cardSub, { color: colors.subtext }]}>
                      Volume: {volume.toLocaleString()} kg
                    </Text>
                    <Text style={[styles.cardSub, { color: colors.subtext }]}>
                      Exercises: {workout.exercises.length}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleExpand(index)}
                    style={{ padding: 4 }}
                  >
                    <Text style={[styles.expandIcon, { color: colors.accent }]}>
                      {isOpen ? "▲" : "▼"}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deleteButton,
                    { backgroundColor: colors.accent },
                  ]}
                  onPress={() => deleteWorkout(index)}
                >
                  <Text style={[styles.deleteText, { color: colors.text }]}>
                    Delete
                  </Text>
                </TouchableOpacity>

                {isOpen && (
                  <View
                    style={[
                      styles.detailsContainer,
                      { borderTopColor: colors.border },
                    ]}
                  >
                    {workout.exercises.map((ex, i) => (
                      <View key={i} style={styles.exerciseBlock}>
                        <Text
                          style={[styles.exerciseName, { color: colors.accent }]}
                        >
                          {ex.name}
                        </Text>

                        {ex.sets.map((s, j) => (
                          <Text
                            key={j}
                            style={[styles.setText, { color: colors.subtext }]}
                          >
                            • {s.reps} reps × {s.weight} kg
                          </Text>
                        ))}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal visible={csvModalVisible} animationType="slide">
        <View
          style={[styles.modalContainer, { backgroundColor: colors.bg }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            CSV Export
          </Text>

          <View
            style={[
              styles.csvBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <ScrollView>
              <Text style={[styles.csvText, { color: colors.subtext }]}>
                {csvText}
              </Text>
            </ScrollView>
          </View>

          <TouchableOpacity
            style={[
              styles.copyButton,
              { backgroundColor: colors.accent },
            ]}
            onPress={copyCSV}
          >
            <Text style={[styles.copyButtonText, { color: colors.text }]}>
              Copy CSV
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.closeButton,
              { backgroundColor: colors.card },
            ]}
            onPress={() => setCsvModalVisible(false)}
          >
            <Text style={[styles.closeButtonText, { color: colors.text }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },

  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },

  exportButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  exportButtonText: { fontSize: 16, fontWeight: "bold" },

  searchInput: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    fontSize: 16,
  },

  filterToggle: { marginBottom: 10 },
  filterToggleText: { fontSize: 16, fontWeight: "bold" },

  filterPanel: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },

  filterLabel: { marginBottom: 6, fontSize: 14 },
  filterInput: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },

  dropdown: { marginBottom: 12 },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  dropdownText: { fontSize: 14 },

  clearButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  clearButtonText: { fontSize: 16, fontWeight: "bold" },

  emptyText: { fontSize: 16, marginTop: 20 },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardDate: { fontSize: 18, fontWeight: "bold" },
  cardSub: { fontSize: 14 },

  expandIcon: { fontSize: 20, fontWeight: "bold" },

  deleteButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: { fontSize: 14, fontWeight: "bold" },

  detailsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 12,
  },

  exerciseBlock: { marginBottom: 16 },
  exerciseName: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  setText: { fontSize: 14, marginLeft: 10 },

  modalContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "flex-start",
  },

  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

  csvBox: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    maxHeight: 400,
    marginBottom: 20,
  },

  csvText: { fontSize: 14 },

  copyButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  copyButtonText: { fontSize: 16, fontWeight: "bold" },

  closeButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: { fontSize: 16, fontWeight: "bold" },
});



