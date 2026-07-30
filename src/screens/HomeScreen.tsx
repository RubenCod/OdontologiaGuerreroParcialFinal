import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePacientes } from "@/context/PacientesContext";

export default function HomeScreen() {
  const router = useRouter();
  const { nombre } = useLocalSearchParams<{ nombre?: string }>();
  const { pacientes } = usePacientes();

  const pendientes = pacientes.filter((item) => item.estado === "PENDIENTE").length;
  const enAtencion = pacientes.filter((item) => item.estado === "EN_ATENCION").length;
  const finalizados = pacientes.filter((item) => item.estado === "FINALIZADO").length;

  const resumen = [
    { label: "Pacientes", value: pacientes.length, icon: "people-outline" as const },
    { label: "Pendientes", value: pendientes, icon: "time-outline" as const },
    { label: "En atención", value: enAtencion, icon: "pulse-outline" as const },
    { label: "Finalizados", value: finalizados, icon: "checkmark-circle-outline" as const },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-sm text-slate-500">Hola,</Text>
            <Text className="text-2xl font-bold text-slate-800">{nombre ?? "Odontología Guerrero"}</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace("/login")} className="h-11 w-11 items-center justify-center rounded-2xl bg-white">
            <Ionicons name="log-out-outline" size={22} color="#475569" />
          </TouchableOpacity>
        </View>

        <View className="mt-6 overflow-hidden rounded-3xl bg-cyan-600 p-6">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Ionicons name="medical" size={30} color="#ffffff" />
          </View>
          <Text className="mt-5 text-xs font-bold uppercase tracking-widest text-cyan-100">Odontología Guerrero</Text>
          <Text className="mt-2 text-3xl font-bold leading-9 text-white">Gestiona tus pacientes de forma rápida y organizada.</Text>
          <Text className="mt-3 leading-6 text-cyan-50">Controla tratamientos, prioridades y el estado de cada atención odontológica.</Text>
        </View>

        <Text className="mb-3 mt-7 text-lg font-bold text-slate-800">Resumen de atención</Text>
        <View className="flex-row flex-wrap justify-between">
          {resumen.map((item) => (
            <View key={item.label} className="mb-3 w-[48%] rounded-3xl bg-white p-5">
              <View className="h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50">
                <Ionicons name={item.icon} size={21} color="#0891b2" />
              </View>
              <Text className="mt-4 text-3xl font-bold text-slate-800">{item.value}</Text>
              <Text className="mt-1 text-sm text-slate-500">{item.label}</Text>
            </View>
          ))}
        </View>

        <Text className="mb-3 mt-4 text-lg font-bold text-slate-800">Acciones rápidas</Text>
        <TouchableOpacity onPress={() => router.push("/pacientes/nuevo")} activeOpacity={0.85} className="mb-3 flex-row items-center rounded-3xl bg-white p-5">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600"><Ionicons name="person-add-outline" size={24} color="#fff" /></View>
          <View className="ml-4 flex-1"><Text className="text-base font-bold text-slate-800">Registrar paciente</Text><Text className="mt-1 text-sm text-slate-500">Nueva atención odontológica</Text></View>
          <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/pacientes")} activeOpacity={0.85} className="flex-row items-center rounded-3xl bg-white p-5">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-slate-100"><Ionicons name="search-outline" size={24} color="#475569" /></View>
          <View className="ml-4 flex-1"><Text className="text-base font-bold text-slate-800">Gestionar pacientes</Text><Text className="mt-1 text-sm text-slate-500">Buscar, filtrar y actualizar</Text></View>
          <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
