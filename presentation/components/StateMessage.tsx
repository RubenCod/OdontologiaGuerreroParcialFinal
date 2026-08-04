// Yo muestro mensajes claros para los estados de información, éxito y error.
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  type: "info" | "error" | "success";
  message: string;
};

const estilos = {
  info: {
    caja: "border-cyan-200 bg-cyan-50",
    texto: "text-cyan-800",
    icono: "information-circle-outline" as const,
    color: "#0e7490",
  },
  error: {
    caja: "border-red-200 bg-red-50",
    texto: "text-red-700",
    icono: "alert-circle-outline" as const,
    color: "#dc2626",
  },
  success: {
    caja: "border-emerald-200 bg-emerald-50",
    texto: "text-emerald-700",
    icono: "checkmark-circle-outline" as const,
    color: "#047857",
  },
};

export function StateMessage({ type, message }: Props) {
  const estilo = estilos[type];

  return (
    <View
      className={`flex-row items-center rounded-2xl border p-4 ${estilo.caja}`}
    >
      <Ionicons name={estilo.icono} size={21} color={estilo.color} />
      <Text className={`ml-2 flex-1 font-semibold leading-5 ${estilo.texto}`}>
        {message}
      </Text>
    </View>
  );
}
