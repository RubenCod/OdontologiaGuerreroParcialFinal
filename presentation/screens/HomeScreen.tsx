// Yo cargo el resumen local y muestro los datos del doctor autenticado en Firebase.
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PacienteLocal } from "@/domain/models/PacienteLocal";
import { pacienteRepository } from "@/infrastructure/repositories/pacienteRepository";
import { AppBottomNav } from "@/presentation/components/AppBottomNav";
import { useAuth } from "@/presentation/context/AuthContext";

export function HomeScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { doctor, cerrarSesion } = useAuth();
  const [pacientes, setPacientes] = useState<PacienteLocal[]>([]);

  const cargarResumen = useCallback(async () => {
    try {
      const data = await pacienteRepository.listar(db);
      setPacientes(data);
    } catch (error) {
      console.log("[APP ERROR] Yo no pude cargar el resumen", error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      cargarResumen();
    }, [cargarResumen]),
  );

  const salir = async () => {
    try {
      await cerrarSesion();
      router.replace("/login");
    } catch (error) {
      console.log("[AUTH ERROR] Yo no pude cerrar la sesión", error);
    }
  };

  const resumen = [
    {
      label: "Pacientes",
      value: pacientes.length,
      icon: "people-outline" as const,
    },
    {
      label: "Pendientes",
      value: pacientes.filter((item) => item.estado === "PENDIENTE").length,
      icon: "time-outline" as const,
    },
    {
      label: "En proceso",
      value: pacientes.filter((item) => item.estado === "EN_PROCESO").length,
      icon: "pulse-outline" as const,
    },
    {
      label: "Finalizados",
      value: pacientes.filter((item) => item.estado === "FINALIZADO").length,
      icon: "checkmark-circle-outline" as const,
    },
  ];

  const nombreDoctor = doctor
    ? `Dr. ${doctor.nombres} ${doctor.apellidos}`
    : "Doctor";

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-500">
              Bienvenido,
            </Text>
            <Text className="text-2xl font-black text-slate-900">
              {nombreDoctor}
            </Text>
            <Text className="mt-1 text-sm font-semibold text-cyan-700">
              {doctor?.especialidad ?? "Odontología"}
            </Text>
          </View>
          <TouchableOpacity
            accessibilityLabel="Cerrar sesión"
            className="h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white"
            onPress={() => void salir()}
          >
            <Ionicons name="log-out-outline" size={21} color="#475569" />
          </TouchableOpacity>
        </View>

        <View className="mt-6 overflow-hidden rounded-[32px] bg-slate-950 p-6">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500">
            <Ionicons name="medical" size={29} color="#ffffff" />
          </View>
          <Text className="mt-6 text-xs font-extrabold uppercase tracking-[2px] text-cyan-400">
            Odontología Guerrero
          </Text>
          <Text className="mt-2 text-3xl font-black leading-9 text-white">
            Gestión de pacientes y atenciones.
          </Text>
          <Text className="mt-3 leading-6 text-slate-400">
            Consulta y administra el seguimiento odontológico desde un solo
            lugar.
          </Text>
        </View>

        <Text className="mb-3 mt-7 text-lg font-black text-slate-900">
          Resumen de atención
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {resumen.map((item) => (
            <View
              key={item.label}
              className="mb-3 w-[48%] rounded-3xl border border-slate-200 bg-white p-5"
            >
              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50">
                <Ionicons name={item.icon} size={21} color="#0891b2" />
              </View>
              <Text className="mt-4 text-3xl font-black text-slate-900">
                {item.value}
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-500">
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <Text className="mb-3 mt-4 text-lg font-black text-slate-900">
          Acciones rápidas
        </Text>
        <ActionCard
          icon="person-add-outline"
          onPress={() => router.push("/pacientes/nuevo")}
          subtitle="Registra un paciente y su atención"
          title="Nueva atención"
        />
        <ActionCard
          icon="people-outline"
          onPress={() => router.push("/pacientes")}
          subtitle="Consulta, edita o elimina registros"
          title="Gestionar pacientes"
        />
        <ActionCard
          icon="document-text-outline"
          onPress={() => router.push("/terminos")}
          subtitle="Consulta la información legal de la clínica"
          title="Términos y condiciones"
        />
      </ScrollView>
      <AppBottomNav active="home" />
    </SafeAreaView>
  );
}

function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      className="mb-3 flex-row items-center rounded-3xl border border-slate-200 bg-white p-5"
      onPress={onPress}
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600">
        <Ionicons name={icon} size={23} color="#ffffff" />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-base font-black text-slate-900">{title}</Text>
        <Text className="mt-1 text-sm leading-5 text-slate-500">
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={21} color="#94a3b8" />
    </TouchableOpacity>
  );
}
