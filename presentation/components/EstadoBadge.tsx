// Yo represento cada estado con una etiqueta visual consistente.
import { Text, View } from "react-native";

import { EstadoAtencion } from "@/domain/models/PacienteLocal";
import { ETIQUETAS_ESTADO } from "@/presentation/utils/constants";

const estilos: Record<EstadoAtencion, { caja: string; texto: string }> = {
  PENDIENTE: { caja: "bg-amber-100", texto: "text-amber-700" },
  EN_PROCESO: { caja: "bg-sky-100", texto: "text-sky-700" },
  FINALIZADO: { caja: "bg-emerald-100", texto: "text-emerald-700" },
  CANCELADO: { caja: "bg-red-100", texto: "text-red-700" },
};

export function EstadoBadge({ estado }: { estado: EstadoAtencion }) {
  const estilo = estilos[estado];

  return (
    <View className={`rounded-full px-3 py-1.5 ${estilo.caja}`}>
      <Text className={`text-xs font-extrabold ${estilo.texto}`}>
        {ETIQUETAS_ESTADO[estado]}
      </Text>
    </View>
  );
}
