import { Text, View } from "react-native";
import { PrioridadAtencion } from "@/models/Paciente";

const estilos: Record<PrioridadAtencion, { contenedor: string; texto: string; label: string }> = {
  BAJA: { contenedor: "bg-emerald-50", texto: "text-emerald-700", label: "Prioridad baja" },
  MEDIA: { contenedor: "bg-orange-50", texto: "text-orange-700", label: "Prioridad media" },
  ALTA: { contenedor: "bg-red-50", texto: "text-red-600", label: "Prioridad alta" },
};

export default function PrioridadChip({ prioridad }: { prioridad: PrioridadAtencion }) {
  const estilo = estilos[prioridad];
  return (
    <View className={`rounded-full px-3 py-1.5 ${estilo.contenedor}`}>
      <Text className={`text-xs font-semibold ${estilo.texto}`}>{estilo.label}</Text>
    </View>
  );
}
