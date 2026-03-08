import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ThemeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Theme</Text>

      <Text style={styles.subheader}>Choose your accent color</Text>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.colorBox, { backgroundColor: "#ff6600" }]} />
        <TouchableOpacity style={[styles.colorBox, { backgroundColor: "#00aaff" }]} />
        <TouchableOpacity style={[styles.colorBox, { backgroundColor: "#ff0066" }]} />
      </View>

      <Text style={styles.info}>
        Theme customization coming soon. You’ll be able to change the app’s accent color and style.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  header: {
    color: "#ff6600",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subheader: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  colorBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  info: {
    color: "white",
    opacity: 0.6,
    textAlign: "center",
    fontSize: 14,
  },
});
