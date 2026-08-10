// Yo muestro el perfil del doctor obtenido desde Firestore y permito cerrar su sesión Firebase.
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBottomNav } from "@/presentation/components/AppBottomNav";
import { AppButton } from "@/presentation/components/AppButton";
import { AppHeader } from "@/presentation/components/AppHeader";
import { useAuth } from "@/presentation/context/AuthContext";

export function PerfilScreen() {
  const router = useRouter();
  const { doctor, user, cerrarSesion } = useAuth();

  const salir = async () => {
    await cerrarSesion();
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 22,
          paddingBottom: 30,
          paddingTop: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader showBack={false} title="Mi perfil" />

        <View className="items-center rounded-[32px] bg-slate-950 p-7">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500">
            <Ionicons name="person" size={40} color="#ffffff" />
          </View>
          <Text className="mt-5 text-center text-2xl font-black text-white">
            {doctor ? `${doctor.nombres} ${doctor.apellidos}` : "Doctor"}
          </Text>
          <Text className="mt-2 text-center font-semibold text-cyan-300">
            {doctor?.especialidad ?? "Odontología"}
          </Text>
        </View>

        <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
          <InfoRow icon="card-outline" label="DNI" value={doctor?.dni ?? "-"} />
          <InfoRow
            icon="ribbon-outline"
            label="Colegiatura"
            value={doctor?.colegiatura ?? "-"}
          />
          <InfoRow
            icon="mail-outline"
            label="Correo"
            value={doctor?.email ?? user?.email ?? "-"}
          />
          <InfoRow
            icon="finger-print-outline"
            label="UID Firebase"
            value={user?.uid ?? "-"}
          />
        </View>

        <View className="mt-5">
          <AppButton
            iconName="log-out-outline"
            onPress={() => void salir()}
            title="Cerrar sesión"
            variant="danger"
          />
        </View>
      </ScrollView>
      <AppBottomNav active="perfil" />
    </SafeAreaView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-4">
      <Ionicons name={icon} size={21} color="#0891b2" />
      <View className="ml-3 flex-1">
        <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </Text>
        <Text className="mt-1 font-bold text-slate-800" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}
