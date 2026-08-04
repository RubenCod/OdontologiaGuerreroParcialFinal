// Yo reutilizo este botón para mantener una apariencia consistente en toda la aplicación.
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  loading?: boolean;
};

const estilos = {
  primary: { fondo: "bg-cyan-600", texto: "text-white", icono: "#ffffff" },
  secondary: {
    fondo: "bg-slate-100",
    texto: "text-slate-700",
    icono: "#334155",
  },
  danger: { fondo: "bg-red-500", texto: "text-white", icono: "#ffffff" },
};

export function AppButton({
  title,
  onPress,
  iconName,
  variant = "primary",
  disabled = false,
  loading = false,
}: Props) {
  const estilo = estilos[variant];
  const bloqueado = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      className={`h-14 flex-row items-center justify-center rounded-2xl px-5 ${
        bloqueado ? "bg-slate-300" : estilo.fondo
      }`}
      disabled={bloqueado}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <>
          {iconName ? (
            <Ionicons name={iconName} size={21} color={estilo.icono} />
          ) : null}
          <Text
            className={`${iconName ? "ml-2" : ""} text-base font-extrabold ${estilo.texto}`}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
