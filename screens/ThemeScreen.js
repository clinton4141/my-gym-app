import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../context/ThemeContext";
import useThemeColors from "../hooks/useThemeColors";

export default function ThemeScreen() {
  const { setTheme } = useContext(ThemeContext);
  const colors = useThemeColors();

  // Dark yellow text for all buttons
  const BUTTON_TEXT_COLOR = "#CCAA00";

  const themeButtons = [
    { key: "dark", label: "Dark Mode", color: "#111" },
    { key: "light", label: "Light Mode", color: "#ffffff" },
    { key: "lightOrange", label: "Light Orange", color: "#ffe8cc" },
    { key: "lightBlue", label: "Light Blue", color: "#d9e8ff" },
    { key: "lightGreen", label: "Light Green", color: "#d6f5d6" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Text style={[styles.title, { color: colors.text }]}>Choose Theme</Text>

      {themeButtons.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={[
            styles.button,
            {
              backgroundColor: t.color,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setTheme(t.key)}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: BUTTON_TEXT_COLOR, // 🔥 ALWAYS dark yellow
              },
            ]}
          >
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  button: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});




