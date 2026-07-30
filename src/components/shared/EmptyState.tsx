import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-8 py-16">
      <View className="h-20 w-20 items-center justify-center rounded-3xl bg-cyan-50">
        <Ionicons name="file-tray-outline" size={38} color="#0891b2" />
      </View>
      <Text className="mt-5 text-center text-xl font-bold text-slate-700">{title}</Text>
      <Text className="mt-2 text-center leading-5 text-slate-500">{message}</Text>
    </View>
  );
}
