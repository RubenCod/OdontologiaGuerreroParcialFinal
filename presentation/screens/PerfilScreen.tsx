// Yo reúno la información del producto, la arquitectura y las funciones implementadas hasta la Semana 9.
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppBottomNav } from "@/presentation/components/AppBottomNav";
import { AppHeader } from "@/presentation/components/AppHeader";

const tecnologias = [
  "React Native con Expo",
  "Expo Router",
  "TypeScript",
  "NativeWind",
  "SQLite local",
  "API REST GET propia",
];

const funcionalidades = [
  "Registro e ingreso local de doctores",
  "CRUD completo de atenciones",
  "Persistencia al cerrar la aplicación",
  "Búsqueda y filtros por estado",
  "Validaciones y notificaciones visuales",
  "Centro legal consumido desde API",
];

export function PerfilScreen() {
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
        <AppHeader
          showBack={false}
          subtitle="Información técnica y funcional de la evaluación final."
          title="Perfil del proyecto"
        />

        <View className="items-center rounded-[32px] bg-slate-950 p-7">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500">
            <Ionicons name="medical" size={42} color="#ffffff" />
          </View>
          <Text className="mt-5 text-center text-2xl font-black text-white">
            EF_OdontologiaGuerrero
          </Text>
          <Text className="mt-2 text-center leading-6 text-slate-400">
            Aplicación móvil para gestionar doctores, pacientes y tratamientos
            de forma local.
          </Text>
          <View className="mt-5 rounded-full bg-emerald-400/15 px-4 py-2">
            <Text className="text-xs font-extrabold text-emerald-300">
              VERSIÓN 3.0 · EVALUACIÓN FINAL
            </Text>
          </View>
        </View>

        <Section title="Objetivo">
          <Text className="leading-6 text-slate-600">
            Organizar el acceso de doctores y el registro, consulta,
            actualización y eliminación de atenciones odontológicas,
            conservando la información en SQLite incluso sin conexión.
          </Text>
        </Section>

        <Section title="Arquitectura del profesor">
          <ArchitectureRow
            description="Rutas pequeñas con Expo Router"
            folder="app/"
          />
          <ArchitectureRow
            description="Modelos y tipos de negocio"
            folder="domain/"
          />
          <ArchitectureRow
            description="SQLite, repositorios y servicios"
            folder="infrastructure/"
          />
          <ArchitectureRow
            description="Pantallas y componentes"
            folder="presentation/"
          />
        </Section>

        <Section title="Funcionalidades implementadas">
          {funcionalidades.map((item) => (
            <CheckRow key={item} value={item} />
          ))}
        </Section>

        <Section title="Tecnologías">
          {tecnologias.map((item) => (
            <CheckRow key={item} value={item} />
          ))}
        </Section>

        <Section title="Acceso inicial">
          <InfoRow
            icon="mail-outline"
            label="Correo"
            value="admin@odontologiaguerrero.com"
          />
          <InfoRow icon="key-outline" label="Contraseña" value="123456" />
          <Text className="mt-1 text-xs leading-5 text-slate-400">
            También se pueden crear nuevas cuentas desde el login o el panel
            principal.
          </Text>
        </Section>

        <Section title="Equipo">
          <InfoRow
            icon="person-outline"
            label="Integrante 1"
            value="Rubén Zúñiga"
          />
          <InfoRow
            icon="person-outline"
            label="Integrante 2"
            value="Santiago Rosado"
          />
        </Section>
      </ScrollView>
      <AppBottomNav active="perfil" />
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
      <Text className="mb-4 text-lg font-black text-slate-900">{title}</Text>
      {children}
    </View>
  );
}

function CheckRow({ value }: { value: string }) {
  return (
    <View className="mb-3 flex-row items-center">
      <Ionicons name="checkmark-circle" size={20} color="#0891b2" />
      <Text className="ml-3 flex-1 font-semibold text-slate-700">{value}</Text>
    </View>
  );
}

function ArchitectureRow({
  folder,
  description,
}: {
  folder: string;
  description: string;
}) {
  return (
    <View className="mb-3 rounded-2xl bg-slate-50 p-4">
      <Text className="font-black text-cyan-700">{folder}</Text>
      <Text className="mt-1 text-sm text-slate-600">{description}</Text>
    </View>
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
        <Text className="mt-1 font-bold text-slate-800">{value}</Text>
      </View>
    </View>
  );
}
