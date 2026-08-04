// Yo configuro la base de datos local y la navegación principal de EF_OdontologiaGuerrero.
import "../global.css";

import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

import { inicializarBaseDatos } from "@/infrastructure/database/database";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="ef_odontologia_guerrero.db"
      onInit={inicializarBaseDatos}
    >
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </SQLiteProvider>
  );
}
