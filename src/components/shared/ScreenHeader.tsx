import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function ScreenHeader({ title, subtitle, showBack = true }: ScreenHeaderProps) {
  const router = useRouter();
  return (
    <View className="mb-6 flex-row items-start">
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-white">
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
      ) : null}
      <View className="flex-1 pt-1">
        <Text className="text-2xl font-bold text-slate-800">{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text> : null}
      </View>
    </View>
  );
}
