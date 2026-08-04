// Yo presento un centro legal profesional y demuestro el consumo REST GET con carga, éxito y error.
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TerminosResponse } from "@/domain/models/Termino";
import {
  TERMINOS_API_URL,
  terminosService,
} from "@/infrastructure/services/terminosService";
import { AppBottomNav } from "@/presentation/components/AppBottomNav";
import { AppButton } from "@/presentation/components/AppButton";
import { AppHeader } from "@/presentation/components/AppHeader";
import { AppToast, ToastType } from "@/presentation/components/AppToast";
import { LoadingState } from "@/presentation/components/LoadingState";
import { StateMessage } from "@/presentation/components/StateMessage";

type ToastState = {
  visible: boolean;
  type: ToastType;
  title: string;
  message: string;
};

const toastInicial: ToastState = {
  visible: false,
  type: "info",
  title: "",
  message: "",
};

export function TerminosScreen() {
  const [data, setData] = useState<TerminosResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(toastInicial);
  const cerrarToast = useCallback(
    () => setToast((actual) => ({ ...actual, visible: false })),
    [],
  );

  const cargarTerminos = async () => {
    try {
      setLoading(true);
      setError(null);
      const respuesta = await terminosService.obtener();
      setData(respuesta);
      setToast({
        visible: true,
        type: "success",
        title: "Consulta completada",
        message: respuesta.message,
      });
    } catch (e) {
      console.log("[APP ERROR] Yo no pude consumir la API", e);
      setData(null);
      const mensaje =
        "No se pudo conectar con la API. Verifica el servidor, la red y la URL configurada.";
      setError(mensaje);
      setToast({
        visible: true,
        type: "error",
        title: "Error de conexión",
        message: mensaje,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppToast
        message={toast.message}
        onClose={cerrarToast}
        title={toast.title}
        type={toast.type}
        visible={toast.visible}
      />

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
          subtitle=""
          title="Centro legal"
        />

        <View className="overflow-hidden rounded-[30px] bg-slate-950 p-6">
          <View className="flex-row items-start justify-between">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500">
              <Ionicons
                name="document-lock-outline"
                size={28}
                color="#ffffff"
              />
            </View>
            
          </View>

          <Text className="mt-6 text-xs font-extrabold uppercase tracking-[2px] text-cyan-400">
            API
          </Text>
          <Text className="mt-2 text-2xl font-black text-white">
            Términos y condiciones
          </Text>
          

          <View className="mt-5 flex-row items-center rounded-2xl border border-white/10 bg-white/5 p-4">
            <View className="rounded-lg bg-cyan-500 px-2.5 py-1.5">
              <Text className="text-xs font-black text-white">GET</Text>
            </View>
            <Text className="ml-3 flex-1 text-xs font-semibold leading-5 text-slate-300">
              /api/terminos-condiciones
            </Text>
          </View>

          <Text className="mt-3 text-xs leading-5 text-slate-500">
            {TERMINOS_API_URL}
          </Text>

          <View className="mt-5">
            <AppButton
              iconName="cloud-download-outline"
              loading={loading}
              onPress={cargarTerminos}
              title={data ? "Actualizar documento" : "Consultar"}
            />
          </View>
        </View>

        {loading ? (
          <LoadingState message="Consultando la API mediante GET..." />
        ) : null}

        {!loading && error ? (
          <View className="mt-5">
            <StateMessage message={error} type="error" />
          </View>
        ) : null}

        {!loading && !error && !data ? (
          <View className="mt-5">
            <StateMessage
              message="Trae la informacion de la api "
              type="info"
            />
          </View>
        ) : null}

        {!loading && data ? (
          <View className="mt-5">
            <View className="rounded-3xl border border-slate-200 bg-white p-5">
              <Text className="text-xs font-extrabold uppercase tracking-[1.5px] text-cyan-700">
                Documento vigente
              </Text>
              <Text className="mt-2 text-xl font-black text-slate-900">
                {data.documento.nombre}
              </Text>
              <View className="mt-5 flex-row flex-wrap justify-between">
                <Metadata
                  icon="git-branch-outline"
                  label="Versión"
                  value={data.documento.version}
                />
                <Metadata
                  icon="calendar-outline"
                  label="Actualización"
                  value={data.documento.fechaActualizacion}
                />
                <Metadata
                  icon="cloud-download-outline"
                  label="Método"
                  value="GET"
                />
                <Metadata
                  icon="layers-outline"
                  label="Secciones"
                  value={String(data.terminos.length)}
                />
              </View>
              <Text className="mt-3 text-xs font-semibold text-slate-400">
                Responsable: {data.documento.responsable}
              </Text>
            </View>

            <Text className="mb-3 mt-6 text-lg font-black text-slate-900">
              Condiciones de uso
            </Text>

            {data.terminos.map((termino) => (
              <View
                key={termino.id}
                className="mb-3 rounded-3xl border border-slate-200 bg-white p-5"
              >
                <View className="flex-row items-start">
                  <View className="h-10 min-w-14 items-center justify-center rounded-xl bg-cyan-50 px-2">
                    <Text className="text-xs font-black text-cyan-700">
                      {termino.codigo}
                    </Text>
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-base font-black text-slate-900">
                      {termino.titulo}
                    </Text>
                    <Text className="mt-2 leading-6 text-slate-600">
                      {termino.contenido}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
      <AppBottomNav active="terminos" />
    </SafeAreaView>
  );
}

function Metadata({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="mb-3 w-[48%] rounded-2xl bg-slate-50 p-3">
      <Ionicons name={icon} size={18} color="#0891b2" />
      <Text className="mt-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
        {label}
      </Text>
      <Text className="mt-1 font-black text-slate-800">{value}</Text>
    </View>
  );
}
