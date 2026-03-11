import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import useThemeColors from "../hooks/useThemeColors";

export default function WorkoutDetailScreen({ route, navigation }) {
  const colors = useThemeColors();
  const workout = route?.params?.workout;

  if (!workout) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.bg }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={[styles.backText, { color: colors.accent }]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 20 }}>
          No workout data provided.
        </Text>
      </View>
    );
  }

  const totalSets = workout.exercises.reduce(
    (sum, ex) => sum + ex.sets.length,
    0
  );

  const exerciseVolumes = workout.exercises.map((ex) => {
    const vol = ex.sets.reduce(
      (s, set) =>
        s + (Number(set.reps) || 0) * (Number(set.weight) || 0),
      0
    );
    return { name: ex.name, volume: vol };
  });

  const totalVolume = exerciseVolumes.reduce((s, ex) => s + ex.volume, 0);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bg }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text
            style={[styles.backText, { color: colors.accent }]}
          >
            ← Back
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[styles.summaryTitle, { color: colors.text }]}
          >
            {workout.date}
          </Text>
          <Text
            style={[styles.summaryText, { color: colors.subtext }]}
          >
            Total Volume: {totalVolume.toLocaleString()} kg
          </Text>
          <Text
            style={[styles.summaryText, { color: colors.subtext }]}
          >
            Exercises: {workout.exercises.length}
          </Text>
          <Text
            style={[styles.summaryText, { color: colors.subtext }]}
          >
            Total Sets: {totalSets}
          </Text>
        </View>

        {workout.exercises.map((ex, index) => (
          <View
            key={index}
            style={[
              styles.exerciseCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.exerciseName, { color: colors.accent }]}
            >
              {ex.name}
            </Text>

            {ex.sets.map((set, i) => (
              <Text
                key={i}
                style={[styles.setText, { color: colors.subtext }]}
              >
                Set {i + 1}: {set.reps} reps × {set.weight} kg
              </Text>
            ))}
          </View>
        ))}

        <View
          style={[
            styles.volumeCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[styles.volumeTitle, { color: colors.text }]}
          >
            Volume Breakdown
          </Text>

          {exerciseVolumes.map((ex, i) => (
            <Text
              key={i}
              style={[styles.volumeText, { color: colors.subtext }]}
            >
              {ex.name}: {ex.volume.toLocaleString()} kg
            </Text>
          ))}
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

  backText: {
    fontSize: 18,
    marginBottom: 20,
  },

  summaryCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },

  summaryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  summaryText: {
    fontSize: 16,
    marginBottom: 4,
  },

  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },

  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  setText: {
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 4,
  },

  volumeCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 40,
  },

  volumeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  volumeText: {
    fontSize: 16,
    marginBottom: 6,
  },
});


