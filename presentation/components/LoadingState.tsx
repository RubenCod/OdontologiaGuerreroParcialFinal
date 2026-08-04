// Yo presento un indicador visible mientras se ejecuta una operación asíncrona.
import { ActivityIndicator, Text, View } from "react-native";

export function LoadingState({
  message = "Cargando información...",
}: {
  message?: string;
}) {
  return (
    <View className="items-center justify-center px-6 py-14">
      <ActivityIndicator color="#0891b2" size="large" />
      <Text className="mt-4 text-center font-semibold text-slate-500">
        {message}
      </Text>
    </View>
  );
}
