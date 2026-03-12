import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getMealsByDate,
  getDailySummary,
  saveDailySummary,
} from "../../database/nutritionDb";

export default function NutritionTodayScreen({ navigation }) {
  const today = new Date().toISOString().split("T")[0];

  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    weight: "",
  });

  const [editVisible, setEditVisible] = useState(false);
  const [editState, setEditState] = useState(summary);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    getMealsByDate(today, (data) => setMeals(data));

    getDailySummary(today, (row) => {
      if (row) {
        setSummary({
          calories: row.calories || 0,
          protein: row.protein || 0,
          carbs: row.carbs || 0,
          fats: row.fats || 0,
          weight: row.weight ? String(row.weight) : "",
        });
      } else {
        setSummary({
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
          weight: "",
        });
      }
    });
  };

  const openEdit = () => {
    setEditState(summary);
    setEditVisible(true);
  };

  const saveEdit = () => {
    const payload = {
      date: today,
      calories: Number(editState.calories) || 0,
      protein: Number(editState.protein) || 0,
      carbs: Number(editState.carbs) || 0,
      fats: Number(editState.fats) || 0,
      weight: editState.weight ? Number(editState.weight) : null,
    };

    saveDailySummary(payload, () => {
      setEditVisible(false);
      loadData();
    });
  };

  const getFoods = (mealType) => {
    const meal = meals.find((m) => m.mealType === mealType);
    return meal?.foods || [];
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <Text style={styles.title}>Nutrition</Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>

        {/* SUMMARY BOX */}
        <View style={styles.summaryBox}>
          <Text style={styles.calories}>{summary.calories} kcal</Text>
          <Text style={styles.label}>Calories Consumed</Text>

          <View style={styles.macroRow}>
            <Text style={styles.macro}>Protein: {summary.protein} g</Text>
            <Text style={styles.macro}>Carbs: {summary.carbs} g</Text>
            <Text style={styles.macro}>Fats: {summary.fats} g</Text>
          </View>

          <Text style={styles.weight}>
            Weight: {summary.weight ? `${summary.weight} kg` : "Not set"}
          </Text>

          <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* MEALS */}
        <Text style={styles.sectionTitle}>Meals</Text>

        {["Breakfast", "Lunch", "Dinner", "Snacks"].map((mealType) => {
          const foods = getFoods(mealType);

          return (
            <TouchableOpacity
              key={mealType}
              style={styles.mealCard}
              onPress={() =>
                navigation.navigate("AddMeal", { mealType, date: today })
              }
            >
              <View>
                <Text style={styles.mealTitle}>{mealType}</Text>

                {foods.length === 0 ? (
                  <Text style={styles.mealSubtitle}>No items logged</Text>
                ) : (
                  foods.map((f) => (
                    <Text key={f.id} style={styles.mealSubtitle}>
                      {f.foodName} — {f.calories} cal
                    </Text>
                  ))
                )}
              </View>

              <Ionicons name="add-circle" size={32} color="#ff6600" />
            </TouchableOpacity>
          );
        })}

        {/* BOTTOM BAR */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => navigation.navigate("AddMeal", { date: today })}
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

      {/* EDIT SUMMARY MODAL */}
      <Modal visible={editVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Daily Summary</Text>

            {["calories", "protein", "carbs", "fats", "weight"].map((field) => (
              <TextInput
                key={field}
                style={styles.input}
                placeholder={field}
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={String(editState[field] ?? "")}
                onChangeText={(t) =>
                  setEditState((s) => ({ ...s, [field]: t }))
                }
              />
            ))}

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#444" }]}
                onPress={() => setEditVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#ff6600" }]}
                onPress={saveEdit}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  title: { color: "white", fontSize: 32, fontWeight: "bold" },
  dateText: { color: "#aaa", fontSize: 16, marginBottom: 20 },

  summaryBox: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  calories: { color: "white", fontSize: 40, fontWeight: "bold" },
  label: { color: "#ccc", fontSize: 16, marginBottom: 10 },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  macro: { color: "#aaa", fontSize: 14 },
  weight: { color: "#aaa", fontSize: 14, marginBottom: 10 },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6600",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editText: { color: "white", marginLeft: 6, fontWeight: "600" },

  sectionTitle: { color: "white", fontSize: 22, fontWeight: "bold" },

  mealCard: {
    backgroundColor: "#222",
    padding: 18,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  mealSubtitle: { color: "#aaa", fontSize: 14 },

  bottomBar: {
    backgroundColor: "#222",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  bottomItem: { alignItems: "center", flex: 1 },
  bottomText: { color: "white", fontSize: 14, marginTop: 6 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  modalBtnText: { color: "white", fontWeight: "600" },
});
