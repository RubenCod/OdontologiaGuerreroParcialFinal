import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { Paciente } from "@/models/Paciente";
import EstadoChip from "./EstadoChip";
import PrioridadChip from "./PrioridadChip";
import TratamientoIcon from "./TratamientoIcon";

interface PacienteCardProps {
  paciente: Paciente;
  onPress: () => void;
}

export default function PacienteCard({ paciente, onPress }: PacienteCardProps) {
  const fecha = new Date(paciente.fechaRegistro).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} className="mb-4 rounded-3xl border border-slate-100 bg-white p-5">
      <View className="flex-row items-center">
        <TratamientoIcon tratamiento={paciente.tratamiento} />
        <View className="ml-4 flex-1">
          <Text className="text-lg font-bold text-slate-800" numberOfLines={1}>{paciente.pacienteNombre}</Text>
          <Text className="mt-1 text-sm font-medium text-cyan-700">{paciente.tratamiento}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
      </View>
      <View className="mt-4 flex-row flex-wrap gap-2">
        <EstadoChip estado={paciente.estado} />
        <PrioridadChip prioridad={paciente.prioridad} />
      </View>
      <View className="mt-4 border-t border-slate-100 pt-4">
        <View className="flex-row items-center">
          <Ionicons name="call-outline" size={17} color="#64748b" />
          <Text className="ml-2 text-sm text-slate-500">{paciente.telefono}</Text>
          <View className="mx-3 h-1 w-1 rounded-full bg-slate-300" />
          <Ionicons name="calendar-outline" size={17} color="#64748b" />
          <Text className="ml-2 text-sm text-slate-500">{fecha}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
