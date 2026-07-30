import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { PacientesProvider } from "@/context/PacientesContext";

export default function RootLayout() {
  return (
    <PacientesProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </PacientesProvider>
  );
}
