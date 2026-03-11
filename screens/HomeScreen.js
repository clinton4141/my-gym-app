import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useThemeColors from "../hooks/useThemeColors";

export default function HomeScreen({ navigation }) {
  const colors = useThemeColors();

  const [history, setHistory] = useState([]);
  const [bestLifts, setBestLifts] = useState({});
  const [volumeByDate, setVolumeByDate] = useState({});
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [weeklyVolume, setWeeklyVolume] = useState({});
  const [exerciseTrends, setExerciseTrends] = useState({});

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProgression();
    });
    return unsubscribe;
  }, [navigation]);

  const loadProgression = async () => {
    try {
      const stored = await AsyncStorage.getItem("workout_history");
      const parsed = stored ? JSON.parse(stored) : [];
      setHistory(parsed);

      computeBestLifts(parsed);
      computeVolume(parsed);
      computeRecent(parsed);

      const weekly = computeWeeklyVolume(parsed);
      setWeeklyVolume(weekly);

      const trends = computeExerciseTrends(parsed);
      setExerciseTrends(trends);
    } catch (e) {
      console.log("Error loading history:", e);
    }
  };

  const computeBestLifts = (data) => {
    const best = {};

    data.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        const maxWeight = Math.max(
          0,
          ...ex.sets.map((s) => Number(s.weight) || 0)
        );
        if (!best[ex.name] || maxWeight > best[ex.name]) {
          best[ex.name] = maxWeight;
        }
      });
    });

    setBestLifts(best);
  };

  const computeVolume = (data) => {
    const volume = {};

    data.forEach((workout) => {
      let total = 0;
      workout.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          total += (Number(s.reps) || 0) * (Number(s.weight) || 0);
        });
      });
      volume[workout.date] = (volume[workout.date] || 0) + total;
    });

    setVolumeByDate(volume);
  };

  const computeRecent = (data) => {
    const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
    setRecentWorkouts(sorted.slice(0, 3));
  };

  const computeWeeklyVolume = (data) => {
    const weekly = {};

    data.forEach((workout) => {
      const date = new Date(workout.timestamp);
      const year = date.getFullYear();
      const week = Math.ceil(
        ((date - new Date(year, 0, 1)) / 86400000 + date.getDay() + 1) / 7
      );
      const key = `${year}-W${week}`;

      let total = 0;
      workout.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          total += (Number(s.reps) || 0) * (Number(s.weight) || 0);
        });
      });

      weekly[key] = (weekly[key] || 0) + total;
    });

    return weekly;
  };

  const computeExerciseTrends = (data) => {
    const trends = {};

    data.forEach((workout) => {
      workout.exercises.forEach((ex) => {
        if (!trends[ex.name]) trends[ex.name] = [];

        const maxWeight = Math.max(
          0,
          ...ex.sets.map((s) => Number(s.weight) || 0)
        );

        trends[ex.name].push({
          date: workout.date,
          weight: maxWeight,
        });
      });
    });

    Object.keys(trends).forEach((name) => {
      trends[name].sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return trends;
  };

  const totalVolumeToday = () => {
    const today = new Date().toISOString().split("T")[0];
    return volumeByDate[today] || 0;
  };

  const totalVolumeAllTime = () => {
    return Object.values(volumeByDate).reduce((sum, v) => sum + v, 0);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Your Progression
        </Text>

        {/* SUMMARY CARD */}
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Overview
          </Text>
          <Text style={[styles.summaryText, { color: colors.subtext }]}>
            Workouts logged: {history.length}
          </Text>
          <Text style={[styles.summaryText, { color: colors.subtext }]}>
            Volume today: {totalVolumeToday().toLocaleString()} kg
          </Text>
          <Text style={[styles.summaryText, { color: colors.subtext }]}>
            Volume all time: {totalVolumeAllTime().toLocaleString()} kg
          </Text>
        </View>

        {/* BEST LIFTS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Best Lifts
        </Text>
        {Object.keys(bestLifts).length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No lifts recorded yet.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 20 }}
          >
            {Object.keys(bestLifts).map((name) => (
              <View
                key={name}
                style={[
                  styles.bestCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.bestName, { color: colors.subtext }]}>
                  {name}
                </Text>
                <Text style={[styles.bestValue, { color: colors.accent }]}>
                  {bestLifts[name]} kg
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* RECENT WORKOUTS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recent Workouts
        </Text>
        {recentWorkouts.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No workouts logged yet.
          </Text>
        ) : (
          recentWorkouts.map((w) => {
            const volume =
              w.exercises?.reduce((sum, ex) => {
                const exVol = ex.sets?.reduce(
                  (s, set) =>
                    s +
                    (Number(set.reps) || 0) * (Number(set.weight) || 0),
                  0
                );
                return sum + (exVol || 0);
              }, 0) || 0;

            return (
              <TouchableOpacity
                key={w.timestamp}
                style={[
                  styles.workoutCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() =>
                  navigation.navigate("WorkoutFlow", {
                    screen: "WorkoutDetail",
                    params: { workout: w },
                  })
                }
              >
                <Text style={[styles.workoutDate, { color: colors.text }]}>
                  {w.date}
                </Text>
                <Text style={[styles.workoutText, { color: colors.subtext }]}>
                  Exercises: {w.exercises.length}
                </Text>
                <Text style={[styles.workoutText, { color: colors.subtext }]}>
                  Volume: {volume.toLocaleString()} kg
                </Text>
              </TouchableOpacity>
            );
          })
        )}

        {/* WEEKLY VOLUME */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Weekly Volume
        </Text>
        {Object.keys(weeklyVolume).length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No weekly data yet.
          </Text>
        ) : (
          <View style={styles.chartContainer}>
            {Object.keys(weeklyVolume)
              .sort()
              .slice(-6)
              .map((weekKey) => {
                const value = weeklyVolume[weekKey];
                const max = Math.max(...Object.values(weeklyVolume));
                const height = max > 0 ? (value / max) * 120 : 0;

                return (
                  <View key={weekKey} style={styles.chartBarWrapper}>
                    <View
                      style={[
                        styles.chartBar,
                        { height, backgroundColor: colors.accent },
                      ]}
                    />
                    <Text style={[styles.chartLabel, { color: colors.subtext }]}>
                      {weekKey.split("-W")[1]}
                    </Text>
                  </View>
                );
              })}
          </View>
        )}

        {/* EXERCISE TRENDS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Exercise Trends
        </Text>

        {Object.keys(exerciseTrends).length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No trend data yet.
          </Text>
        ) : (
          Object.keys(exerciseTrends).map((name) => {
            const points = exerciseTrends[name].slice(-6);
            const max = Math.max(...points.map((p) => p.weight), 1);

            return (
              <View
                key={name}
                style={[
                  styles.trendCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.trendTitle, { color: colors.text }]}>
                  {name}
                </Text>

                <View style={styles.trendGraph}>
                  {points.map((p, idx) => {
                    const height = (p.weight / max) * 120;

                    return (
                      <View key={idx} style={styles.trendBarWrapper}>
                        <View
                          style={[
                            styles.trendBar,
                            { height, backgroundColor: colors.accent },
                          ]}
                        />
                        <Text
                          style={[styles.trendLabel, { color: colors.subtext }]}
                        >
                          {p.weight}kg
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        {/* QUICK ACTIONS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Actions
        </Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.accent },
            ]}
            onPress={() =>
              navigation.navigate("WorkoutFlow", {
                screen: "StartWorkout",
              })
            }
          >
            <Text style={[styles.actionText, { color: colors.text }]}>
              Start Workout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.accent },
            ]}
            onPress={() =>
              navigation.navigate("MainTabs", { screen: "History" })
            }
          >
            <Text style={[styles.actionText, { color: colors.text }]}>
              View History
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },

  title: { fontSize: 26, fontWeight: "bold", marginBottom: 16 },

  summaryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  summaryTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  summaryText: { fontSize: 14, marginBottom: 4 },

  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },

  emptyText: { fontSize: 14, marginBottom: 10 },

  bestCard: {
    padding: 14,
    borderRadius: 12,
    marginRight: 10,
    width: 140,
    borderWidth: 1,
  },
  bestName: { fontSize: 14, marginBottom: 6 },
  bestValue: { fontSize: 20, fontWeight: "bold" },

  workoutCard: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  workoutDate: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  workoutText: { fontSize: 14 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  actionText: { fontSize: 16, fontWeight: "bold" },

  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  chartBarWrapper: { alignItems: "center", width: 40 },
  chartBar: { width: 30, borderRadius: 6 },
  chartLabel: { marginTop: 6, fontSize: 12 },

  trendCard: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  trendTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  trendGraph: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 150,
  },
  trendBarWrapper: { alignItems: "center", width: 40 },
  trendBar: { width: 30, borderRadius: 6 },
  trendLabel: { fontSize: 12, marginTop: 4 },
});























