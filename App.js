import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import { ThemeProvider } from "./context/ThemeContext";
import { fullSync, pullFromCloud } from "./services/syncService";

export default function App() {
  useEffect(() => {
    const runStartupSync = async () => {
      try {
        // 1️⃣ Pull cloud → local
        await pullFromCloud();

        // 2️⃣ Optional: push local → cloud
        await fullSync();
      } catch (e) {
        console.log("Startup sync error:", e);
      }
    };

    runStartupSync();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}









