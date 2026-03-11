import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function useThemeColors() {
  const { theme } = useContext(ThemeContext);

  const themes = {
    dark: {
      bg: "#111",
      card: "#1a1a1a",
      text: "#fff",
      subtext: "#ccc",
      accent: "#ff6600",
      border: "#333",
    },
    light: {
      bg: "#fff",
      card: "#f2f2f2",
      text: "#000",
      subtext: "#444",
      accent: "#ff6600",
      border: "#ddd",
    },
    lightOrange: {
      bg: "#fff7ec",
      card: "#ffe8cc",
      text: "#000",
      subtext: "#444",
      accent: "#ff8800",
      border: "#ffcc99",
    },
    lightBlue: {
      bg: "#e8f1ff",
      card: "#d9e8ff",
      text: "#000",
      subtext: "#444",
      accent: "#3399ff",
      border: "#aac8ff",
    },
    lightGreen: {
      bg: "#eaffea",
      card: "#d6f5d6",
      text: "#000",
      subtext: "#444",
      accent: "#33cc33",
      border: "#a6e6a6",
    },
  };

  return themes[theme];
}
