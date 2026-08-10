// Yo configuro SQLite, la sesión Firebase y la protección de las rutas principales.
import "../global.css";

import { Stack, usePathname, useRouter } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { inicializarBaseDatos } from "@/infrastructure/database/database";
import { AuthProvider, useAuth } from "@/presentation/context/AuthContext";

function NavegacionProtegida() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const rutaPublica =
      pathname === "/login" || pathname === "/registro-doctor";

    // Yo impido acceder a las pantallas clínicas cuando no existe una sesión Firebase.
    if (!user && !rutaPublica) {
      router.replace("/login");
      return;
    }

    // Yo evito volver al login mientras el doctor ya tiene una sesión activa.
    if (user && pathname === "/login") {
      router.replace("/home");
    }
  }, [loading, pathname, router, user]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SQLiteProvider
        databaseName="ef_odontologia_guerrero.db"
        onInit={inicializarBaseDatos}
      >
        <StatusBar style="dark" />
        <NavegacionProtegida />
      </SQLiteProvider>
    </AuthProvider>
  );
}
