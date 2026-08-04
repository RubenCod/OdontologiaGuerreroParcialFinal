// Yo uso este encabezado para mantener jerarquía visual y navegación uniforme.
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
};

export function AppHeader({ title, subtitle, showBack = true }: Props) {
  const router = useRouter();

  return (
    <View className="mb-6 flex-row items-start">
      {showBack ? (
        <TouchableOpacity
          className="mr-3 h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={21} color="#0f172a" />
        </TouchableOpacity>
      ) : null}
      <View className="flex-1 pt-1">
        <Text className="text-2xl font-black text-slate-900">{title}</Text>
        {subtitle ? (
          <Text className="mt-1 leading-5 text-slate-500">{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}
