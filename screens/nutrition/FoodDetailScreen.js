import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { addMeal } from "../../database/database";

export default function FoodDetailScreen({ route, navigation }) {
  const { foodName, mealType, baseCalories, baseProtein, baseCarbs, baseFat } =
    route.params;

  const [servings, setServings] = useState(1);
  const [servingSize, setServingSize] = useState("100");

  const [calories, setCalories] = useState(baseCalories);
  const [protein, setProtein] = useState(baseProtein);
  const [carbs, setCarbs] = useState(baseCarbs);
  const [fat, setFat] = useState(baseFat);

  useEffect(() => {
    const multiplier = servings;
    setCalories((baseCalories * multiplier).toFixed(0));
    setProtein((baseProtein * multiplier).toFixed(0));
    setCarbs((baseCarbs * multiplier).toFixed(0));
    setFat((baseFat * multiplier).toFixed(0));
  }, [servings]);

  const handleAddMeal = () => {
    const today = new Date().toISOString().split("T")[0];

    addMeal(
      {
        foodName,
        calories,
        protein,
        carbs,
        fat,
        servings,
        mealType,
        date: today,
      },
      () => navigation.goBack()
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{foodName}</Text>
      <Text style={styles.subtitle}>Logging to {mealType}</Text>

      {/* Calories */}
      <View style={styles.calorieBox}>
        <Text style={styles.calorieNumber}>{calories}</Text>
        <Text style={styles.calorieLabel}>Calories</Text>
      </View>

      {/* Serving Size */}
      <Text style={styles.sectionTitle}>Serving Size</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="100"
          placeholderTextColor="#777"
          keyboardType="numeric"
          value={servingSize}
          onChangeText={setServingSize}
        />

        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="g / ml / oz"
          placeholderTextColor="#777"
        />
      </View>

      {/* Servings Slider */}
      <Text style={styles.sectionTitle}>Servings</Text>
      <Text style={styles.servingValue}>{servings.toFixed(1)}x</Text>

      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0.5}
        maximumValue={3}
        step={0.1}
        minimumTrackTintColor="#ff6600"
        maximumTrackTintColor="#444"
        thumbTintColor="#ff6600"
        value={servings}
        onValueChange={(value) => setServings(value)}
      />

      {/* Macros */}
      <View style={styles.macroRow}>
        <View style={styles.macroBox}>
          <Text style={styles.macroLabel}>Protein</Text>
          <Text style={styles.macroValue}>{protein}g</Text>
        </View>

        <View style={styles.macroBox}>
          <Text style={styles.macroLabel}>Carbs</Text>
          <Text style={styles.macroValue}>{carbs}g</Text>
        </View>

        <View style={styles.macroBox}>
          <Text style={styles.macroLabel}>Fat</Text>
          <Text style={styles.macroValue}>{fat}g</Text>
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddMeal}>
        <Ionicons name="checkmark" size={22} color="white" />
        <Text style={styles.addText}>Add to {mealType}</Text>
      </TouchableOpacity>
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
    fontSize: 30,
    fontWeight: "bold",
  },

  subtitle: {
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

  calorieNumber: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },

  calorieLabel: {
    color: "#ccc",
    fontSize: 16,
  },

  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  servingValue: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },

  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },

  macroBox: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    width: "30%",
    alignItems: "center",
  },

  macroLabel: {
    color: "#ccc",
    fontSize: 14,
  },

  macroValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },

  addButton: {
    backgroundColor: "#ff6600",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  addText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
