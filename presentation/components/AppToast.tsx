// Yo muestro notificaciones breves y profesionales sin depender de librerías externas.
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type ToastType = "success" | "error" | "info";

type Props = {
  visible: boolean;
  type: ToastType;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
};

const estilos = {
  success: {
    caja: "border-emerald-200 bg-emerald-50",
    titulo: "text-emerald-900",
    mensaje: "text-emerald-700",
    icono: "checkmark-circle" as const,
    color: "#059669",
  },
  error: {
    caja: "border-red-200 bg-red-50",
    titulo: "text-red-900",
    mensaje: "text-red-700",
    icono: "alert-circle" as const,
    color: "#dc2626",
  },
  info: {
    caja: "border-cyan-200 bg-cyan-50",
    titulo: "text-cyan-900",
    mensaje: "text-cyan-700",
    icono: "information-circle" as const,
    color: "#0891b2",
  },
};

export function AppToast({
  visible,
  type,
  title,
  message,
  onClose,
  duration = 3200,
}: Props) {
  useEffect(() => {
    if (!visible) return;

    // Yo cierro automáticamente la notificación para no interrumpir el flujo del usuario.
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose, visible]);

  if (!visible) return null;

  const estilo = estilos[type];

  return (
    <View className="absolute left-4 right-4 top-4 z-50">
      <View
        className={`flex-row items-start rounded-3xl border p-4 shadow-lg ${estilo.caja}`}
      >
        <Ionicons name={estilo.icono} size={25} color={estilo.color} />
        <View className="ml-3 flex-1">
          <Text className={`font-black ${estilo.titulo}`}>{title}</Text>
          <Text className={`mt-1 text-sm leading-5 ${estilo.mensaje}`}>
            {message}
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel="Cerrar notificación"
          className="ml-2 p-1"
          onPress={onClose}
        >
          <Ionicons name="close" size={20} color={estilo.color} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
