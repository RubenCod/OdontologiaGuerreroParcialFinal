import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { TipoTratamiento } from "@/models/Paciente";

const iconos: Record<TipoTratamiento, keyof typeof Ionicons.glyphMap> = {
  CONSULTA: "medkit-outline",
  LIMPIEZA: "sparkles-outline",
  ORTODONCIA: "git-compare-outline",
  ENDODONCIA: "pulse-outline",
  EXTRACCION: "medical-outline",
  BLANQUEAMIENTO: "sunny-outline",
};

export default function TratamientoIcon({ tratamiento }: { tratamiento: TipoTratamiento }) {
  return (
    <View className="h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50">
      <Ionicons name={iconos[tratamiento]} size={24} color="#0891b2" />
    </View>
  );
}
