// Yo consulto SQLite para listar, buscar y filtrar las atenciones guardadas localmente.
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EstadoAtencion, PacienteLocal } from "@/domain/models/PacienteLocal";
import { pacienteRepository } from "@/infrastructure/repositories/pacienteRepository";
import { AppBottomNav } from "@/presentation/components/AppBottomNav";
import { AppHeader } from "@/presentation/components/AppHeader";
import { AppToast } from "@/presentation/components/AppToast";
import { EmptyState } from "@/presentation/components/EmptyState";
import { LoadingState } from "@/presentation/components/LoadingState";
import { PacienteCard } from "@/presentation/components/PacienteCard";
import { StateMessage } from "@/presentation/components/StateMessage";
import { ETIQUETAS_ESTADO } from "@/presentation/utils/constants";

type FiltroEstado = "TODOS" | EstadoAtencion;

export function PacientesScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const params = useLocalSearchParams<{ feedback?: string }>();
  const [pacientes, setPacientes] = useState<PacienteLocal[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroEstado>("TODOS");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeletedToast, setShowDeletedToast] = useState(
    params.feedback === "deleted",
  );
  const cerrarToast = useCallback(() => setShowDeletedToast(false), []);

  useEffect(() => {
    if (params.feedback === "deleted") {
      setShowDeletedToast(true);
    }
  }, [params.feedback]);

  const cargarPacientes = useCallback(
    async (mostrarCarga = true) => {
      try {
        if (mostrarCarga) setLoading(true);
        setError(null);
        const data = await pacienteRepository.listar(db);
        setPacientes(data);
      } catch (e) {
        console.log("[APP ERROR] Yo no pude listar los pacientes", e);
        setError("No se pudieron cargar los registros.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [db],
  );

  useFocusEffect(
    useCallback(() => {
      cargarPacientes();
    }, [cargarPacientes]),
  );

  const actualizarLista = () => {
    // Yo permito recargar manualmente para brindar feedback visual al usuario.
    setRefreshing(true);
    cargarPacientes(false);
  };

  const termino = busqueda.trim().toLowerCase();
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const coincideTexto =
      !termino ||
      paciente.pacienteNombre.toLowerCase().includes(termino) ||
      paciente.telefono.includes(termino) ||
      paciente.tratamiento.toLowerCase().includes(termino);
    const coincideEstado = filtro === "TODOS" || paciente.estado === filtro;
    return coincideTexto && coincideEstado;
  });

  const filtros: FiltroEstado[] = [
    "TODOS",
    "PENDIENTE",
    "EN_PROCESO",
    "FINALIZADO",
    "CANCELADO",
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppToast
        message="La atención fue eliminada correctamente."
        onClose={cerrarToast}
        title="Registro eliminado"
        type="success"
        visible={showDeletedToast}
      />

      <View className="flex-1 px-5 pt-4">
        <AppHeader
          showBack={false}
          subtitle={`${pacientes.length} registro(s)`}
          title="Pacientes"
        />

        <View className="h-14 flex-row items-center rounded-2xl border border-slate-200 bg-white px-4">
          <Ionicons name="search-outline" size={20} color="#64748b" />
          <TextInput
            className="ml-3 flex-1 text-base text-slate-900"
            onChangeText={setBusqueda}
            placeholder="Buscar paciente, teléfono o tratamiento"
            placeholderTextColor="#94a3b8"
            value={busqueda}
          />
          {busqueda ? (
            <TouchableOpacity onPress={() => setBusqueda("")}>
              <Ionicons name="close-circle" size={21} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="my-4 max-h-11"
        >
          {filtros.map((item) => {
            const selected = filtro === item;
            const label = item === "TODOS" ? "Todos" : ETIQUETAS_ESTADO[item];
            return (
              <TouchableOpacity
                key={item}
                className={`mr-2 rounded-full border px-4 py-2.5 ${
                  selected
                    ? "border-cyan-600 bg-cyan-600"
                    : "border-slate-200 bg-white"
                }`}
                onPress={() => setFiltro(item)}
              >
                <Text
                  className={`text-sm font-bold ${selected ? "text-white" : "text-slate-600"}`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-bold text-slate-500">
            {pacientesFiltrados.length} resultado(s)
          </Text>
          <TouchableOpacity
            className="flex-row items-center rounded-full bg-cyan-600 px-4 py-2.5"
            onPress={() => router.push("/pacientes/nuevo")}
          >
            <Ionicons name="add" size={19} color="#ffffff" />
            <Text className="ml-1 font-extrabold text-white">Nuevo</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View className="mb-4">
            <StateMessage message={error} type="error" />
          </View>
        ) : null}

        {loading ? (
          <LoadingState message="Cargando pacientes..." />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingBottom: 24 }}
            data={pacientesFiltrados}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
              <EmptyState
                message="Registra una nueva atención o cambia los criterios de búsqueda."
                title="No hay resultados"
              />
            }
            refreshControl={
              <RefreshControl
                onRefresh={actualizarLista}
                refreshing={refreshing}
              />
            }
            renderItem={({ item }) => (
              <PacienteCard
                onPress={() =>
                  router.push({
                    pathname: "/pacientes/[id]",
                    params: { id: String(item.id) },
                  })
                }
                paciente={item}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <AppBottomNav active="pacientes" />
    </SafeAreaView>
  );
}