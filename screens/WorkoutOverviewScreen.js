import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useThemeColors from "../hooks/useThemeColors";

export default function WorkoutOverviewScreen({ navigation, route }) {
  const colors = useThemeColors();
  const workout = route.params?.workout;

  if (!workout) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.bg }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          No workout found.
        </Text>
      </View>
    );
  }

  const renderSection = (title, items) => (
    <View style={{ marginBottom: 25 }}>
      <Text style={[styles.sectionTitle, { color: colors.accent }]}>
        {title}
      </Text>

      {items.map((ex, index) => (
        <View
          key={index}
          style={[
            styles.card,
            { backgroundColor: colors.card },
          ]}
        >
          <Text style={[styles.exerciseName, { color: colors.text }]}>
            {ex.name}
          </Text>

          <Text style={[styles.exerciseDetails, { color: colors.subtext }]}>
            {ex.sets} sets • {ex.reps} reps
          </Text>

          <Text style={[styles.exerciseDetails, { color: colors.subtext }]}>
            Rest: {ex.restSeconds}s
          </Text>

          {ex.description && (
            <Text
              style={[
                styles.exerciseDescription,
                { color: colors.subtext },
              ]}
            >
              {ex.description}
            </Text>
          )}

          {ex.videoUrl && (
            <TouchableOpacity onPress={() => Linking.openURL(ex.videoUrl)}>
              <Text style={[styles.videoLink, { color: colors.accent }]}>
                Watch Video
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bg }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {workout.bodyPart.toUpperCase()} Workout
      </Text>

      <ScrollView style={{ marginBottom: 20 }}>
        {renderSection("Warm-Up", workout.warmup)}
        {renderSection("Main Workout", workout.main)}
        {renderSection("Cool-Down", workout.cooldown)}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.startButton,
          { backgroundColor: colors.accent },
        ]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("WorkoutPlayer", { workout })}
      >
        <Ionicons name="play-circle-outline" size={28} color={colors.text} />
        <Text style={[styles.startText, { color: colors.text }]}>
          Start Workout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseDetails: {
    marginTop: 4,
  },
  exerciseDescription: {
    marginTop: 6,
    fontStyle: "italic",
  },
  videoLink: {
    marginTop: 8,
    fontWeight: "bold",
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 60,
    marginTop: 10,
  },
  startText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});





