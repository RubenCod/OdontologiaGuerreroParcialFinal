// Yo resumo los datos más importantes para facilitar la consulta del listado.
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { PacienteLocal } from "@/domain/models/PacienteLocal";
import { EstadoBadge } from "@/presentation/components/EstadoBadge";
import { ETIQUETAS_TRATAMIENTO } from "@/presentation/utils/constants";
import {
  formatearCodigoPaciente,
  formatearFecha,
  formatearPrecio,
} from "@/presentation/utils/formatters";

export function PacienteCard({
  paciente,
  onPress,
}: {
  paciente: PacienteLocal;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      className="mb-4 rounded-3xl border border-slate-200 bg-white p-5"
      onPress={onPress}
    >
      <View className="flex-row items-start">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50">
          <Ionicons name="medical-outline" size={24} color="#0891b2" />
        </View>
        <View className="ml-4 flex-1">
          <Text className="text-xs font-extrabold tracking-wider text-cyan-700">
            {formatearCodigoPaciente(paciente.id)}
          </Text>
          <Text
            className="mt-1 text-lg font-black text-slate-900"
            numberOfLines={1}
          >
            {paciente.pacienteNombre}
          </Text>
          <Text className="mt-1 font-semibold text-slate-500">
            {ETIQUETAS_TRATAMIENTO[paciente.tratamiento]}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
      </View>

      <View className="mt-4 flex-row items-center justify-between border-t border-slate-100 pt-4">
        <EstadoBadge estado={paciente.estado} />
        <Text className="font-black text-slate-800">
          {formatearPrecio(paciente.precio)}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center">
        <Ionicons name="layers-outline" size={16} color="#64748b" />
        <Text className="ml-1.5 text-sm text-slate-500">
          {paciente.sesiones} sesión(es)
        </Text>
        <View className="mx-3 h-1 w-1 rounded-full bg-slate-300" />
        <Ionicons name="calendar-outline" size={16} color="#64748b" />
        <Text
          className="ml-1.5 flex-1 text-sm text-slate-500"
          numberOfLines={1}
        >
          {formatearFecha(paciente.fechaRegistro)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
