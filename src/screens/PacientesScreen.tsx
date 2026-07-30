import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FiltroChip from "@/components/pacientes/FiltroChip";
import PacienteCard from "@/components/pacientes/PacienteCard";
import EmptyState from "@/components/shared/EmptyState";
import ScreenHeader from "@/components/shared/ScreenHeader";
import { usePacientes } from "@/context/PacientesContext";
import { EstadoAtencion } from "@/models/Paciente";

type FiltroEstado = "TODOS" | EstadoAtencion;

export default function PacientesScreen() {
  const router = useRouter();
  const { pacientes } = usePacientes();
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("TODOS");

  const termino = busqueda.trim().toLowerCase();
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const coincideBusqueda =
      !termino ||
      paciente.pacienteNombre.toLowerCase().includes(termino) ||
      paciente.telefono.includes(termino) ||
      paciente.tratamiento.toLowerCase().includes(termino);
    const coincideEstado = filtroEstado === "TODOS" || paciente.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  const filtros: { value: FiltroEstado; label: string }[] = [
    { value: "TODOS", label: "Todos" },
    { value: "PENDIENTE", label: "Pendientes" },
    { value: "EN_ATENCION", label: "En atención" },
    { value: "FINALIZADO", label: "Finalizados" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 px-6 pt-4">
        <ScreenHeader title="Pacientes" subtitle={`${pacientes.length} registros en atención`} />
        <View className="h-14 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4">
          <Ionicons name="search-outline" size={21} color="#64748b" />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar por paciente, teléfono o tratamiento"
            placeholderTextColor="#94a3b8"
            className="ml-3 flex-1 text-base text-slate-800"
          />
          {busqueda ? (
            <TouchableOpacity onPress={() => setBusqueda("")}><Ionicons name="close-circle" size={21} color="#94a3b8" /></TouchableOpacity>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="my-4 max-h-11">
          {filtros.map((filtro) => (
            <FiltroChip key={filtro.value} label={filtro.label} selected={filtroEstado === filtro.value} onPress={() => setFiltroEstado(filtro.value)} />
          ))}
        </ScrollView>
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-slate-500">{pacientesFiltrados.length} resultado(s)</Text>
          <TouchableOpacity onPress={() => router.push("/pacientes/nuevo")} className="flex-row items-center rounded-full bg-cyan-600 px-4 py-2.5">
            <Ionicons name="add" size={19} color="#fff" /><Text className="ml-1 font-bold text-white">Nuevo</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={pacientesFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PacienteCard paciente={item} onPress={() => router.push({ pathname: "/pacientes/[id]", params: { id: item.id } })} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={<EmptyState title="Sin resultados" message="No encontramos pacientes con los criterios seleccionados." />}
        />
      </View>
    </SafeAreaView>
  );
}
