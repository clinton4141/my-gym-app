import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getMealsByDate } from "../../database/database";

export default function NutritionTodayScreen({ navigation }) {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    getMealsByDate(today, (data) => setMeals(data));
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 140,
        flexGrow: 1,
      }}
    >
      <Text style={styles.title}>Nutrition</Text>
      <Text style={styles.dateText}>{new Date().toDateString()}</Text>

      {/* Calorie Summary */}
      <View style={styles.calorieBox}>
        <Text style={styles.caloriesRemaining}>1850</Text>
        <Text style={styles.caloriesLabel}>Calories Remaining</Text>

        <View style={styles.calorieRow}>
          <Text style={styles.calorieDetail}>Consumed: 650</Text>
          <Text style={styles.calorieDetail}>Target: 2500</Text>
        </View>
      </View>

      {/* Meals */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Meals</Text>
      </View>

      {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal) => {
        const items = meals.filter((m) => m.mealType === meal);

        return (
          <TouchableOpacity
            key={meal}
            style={styles.mealCard}
            onPress={() => navigation.navigate("AddMeal", { mealType: meal })}
          >
            <View>
              <Text style={styles.mealTitle}>{meal}</Text>

              {items.length === 0 ? (
                <Text style={styles.mealSubtitle}>No items logged</Text>
              ) : (
                items.map((i) => (
                  <Text key={i.id} style={styles.mealSubtitle}>
                    {i.foodName} — {i.calories} cal
                  </Text>
                ))
              )}
            </View>

            <Ionicons name="add-circle" size={32} color="#ff6600" />
          </TouchableOpacity>
        );
      })}

      {/* 4‑option grey bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate("AddMeal")}
        >
          <Ionicons name="add" size={22} color="white" />
          <Text style={styles.bottomText}>Add Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate("Water")}
        >
          <Ionicons name="water" size={22} color="white" />
          <Text style={styles.bottomText}>Water</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate("BarcodeScanner")}
        >
          <Ionicons name="barcode" size={22} color="white" />
          <Text style={styles.bottomText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => navigation.navigate("AddCustomFood")}
        >
          <Ionicons name="fast-food" size={22} color="white" />
          <Text style={styles.bottomText}>Custom</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },

  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },

  dateText: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 20,
  },

  calorieBox: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  caloriesRemaining: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },

  caloriesLabel: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 10,
  },

  calorieRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  calorieDetail: {
    color: "#aaa",
    fontSize: 14,
  },

  sectionHeader: {
    marginBottom: 10,
  },

  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },

  mealCard: {
    backgroundColor: "#222",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  mealTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  mealSubtitle: {
    color: "#aaa",
    fontSize: 14,
  },

  bottomBar: {
    backgroundColor: "#222",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  bottomItem: {
    alignItems: "center",
    flex: 1,
  },

  bottomText: {
    color: "white",
    fontSize: 14,
    marginTop: 6,
  },
});
