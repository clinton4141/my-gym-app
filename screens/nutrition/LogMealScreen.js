import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LogMealScreen({ route }) {
  const mealType = route?.params?.mealType || "Meal";

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Recent");

  const tabs = ["Recent", "Favorites", "Templates", "All Foods"];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Recent":
        return ["Chicken Breast", "Oats", "Greek Yogurt"];
      case "Favorites":
        return ["Protein Shake", "Rice Bowl"];
      case "Templates":
        return ["Chicken + Rice", "Oats + Berries"];
      case "All Foods":
        return ["Banana", "Eggs", "Salmon", "Almonds", "Pasta"];
      default:
        return [];
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Text style={styles.title}>Log {mealType}</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={22} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor="#777"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabButton,
                activeTab === tab && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={{ marginTop: 15 }}>
          {renderTabContent().map((item) => (
            <TouchableOpacity key={item} style={styles.foodItem}>
              <Text style={styles.foodName}>{item}</Text>
              <Ionicons name="add-circle" size={28} color="#ff6600" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Manual Entry */}
        <TouchableOpacity style={styles.manualButton}>
          <Ionicons name="create" size={22} color="white" />
          <Text style={styles.manualText}>Add Custom Food</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },

  searchInput: {
    color: "white",
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#222",
  },

  tabButtonActive: {
    backgroundColor: "#ff6600",
  },

  tabText: {
    color: "#aaa",
    fontSize: 14,
  },

  tabTextActive: {
    color: "white",
    fontWeight: "bold",
  },

  foodItem: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  foodName: {
    color: "white",
    fontSize: 16,
  },

  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6600",
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
    justifyContent: "center",
  },

  manualText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
