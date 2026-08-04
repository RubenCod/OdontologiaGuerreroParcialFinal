// Yo creo una navegación inferior sencilla para facilitar el acceso a las pantallas principales.
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Ruta = "home" | "pacientes" | "terminos" | "perfil";

type Props = {
  active: Ruta;
};

const items: {
  key: Ruta;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
}[] = [
  { key: "home", label: "Inicio", icon: "grid-outline", href: "/home" },
  {
    key: "pacientes",
    label: "Pacientes",
    icon: "people-outline",
    href: "/pacientes",
  },
  {
    key: "terminos",
    label: "Términos",
    icon: "document-text-outline",
    href: "/terminos",
  },
  {
    key: "perfil",
    label: "Perfil",
    icon: "person-circle-outline",
    href: "/perfil",
  },
];

export function AppBottomNav({ active }: Props) {
  const router = useRouter();

  return (
    <View className="flex-row border-t border-slate-200 bg-white px-3 pb-2 pt-2">
      {items.map((item) => {
        const selected = active === item.key;

        return (
          <TouchableOpacity
            key={item.key}
            className="flex-1 items-center py-2"
            onPress={() => router.replace(item.href)}
          >
            <View
              className={`rounded-2xl px-4 py-1.5 ${selected ? "bg-cyan-50" : "bg-transparent"}`}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={selected ? "#0891b2" : "#94a3b8"}
              />
            </View>
            <Text
              className={`mt-1 text-[11px] font-bold ${selected ? "text-cyan-700" : "text-slate-400"}`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
