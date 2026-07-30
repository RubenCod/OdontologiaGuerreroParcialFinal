import { Text, View } from "react-native";
import { EstadoAtencion } from "@/models/Paciente";

const estilos: Record<EstadoAtencion, { contenedor: string; texto: string; label: string }> = {
  PENDIENTE: { contenedor: "bg-amber-100", texto: "text-amber-700", label: "Pendiente" },
  EN_ATENCION: { contenedor: "bg-sky-100", texto: "text-sky-700", label: "En atención" },
  FINALIZADO: { contenedor: "bg-emerald-100", texto: "text-emerald-700", label: "Finalizado" },
};

export default function EstadoChip({ estado }: { estado: EstadoAtencion }) {
  const estilo = estilos[estado];
  return (
    <View className={`rounded-full px-3 py-1.5 ${estilo.contenedor}`}>
      <Text className={`text-xs font-bold ${estilo.texto}`}>{estilo.label}</Text>
    </View>
  );
}
