// Yo consulto el registro por ID para permitir ver, editar y eliminar una atención.
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PacienteLocal } from "@/domain/models/PacienteLocal";
import { pacienteRepository } from "@/infrastructure/repositories/pacienteRepository";
import { AppButton } from "@/presentation/components/AppButton";
import { AppHeader } from "@/presentation/components/AppHeader";
import { AppToast, ToastType } from "@/presentation/components/AppToast";
import { LoadingState } from "@/presentation/components/LoadingState";
import { PacienteForm } from "@/presentation/components/PacienteForm";
import { StateMessage } from "@/presentation/components/StateMessage";
import { usePacienteForm } from "@/presentation/hooks/usePacienteForm";
import {
  formatearCodigoPaciente,
  formatearFecha,
} from "@/presentation/utils/formatters";
import { convertirFormularioADto } from "@/presentation/utils/validations";

type ToastState = {
  visible: boolean;
  type: ToastType;
  title: string;
  message: string;
};

export function DetallePacienteScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; feedback?: string }>();
  const id = Number(params.id);
  const [paciente, setPaciente] = useState<PacienteLocal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    visible: params.feedback === "created",
    type: "success",
    title: "Atención registrada",
    message:
      "El paciente y su tratamiento fueron guardados correctamente en SQLite.",
  });
  const { form, errors, setErrors, actualizarCampo, validarFormulario } =
    usePacienteForm(paciente);
  const cerrarToast = useCallback(
    () => setToast((actual) => ({ ...actual, visible: false })),
    [],
  );

  useEffect(() => {
    const cargarPaciente = async () => {
      if (!Number.isInteger(id) || id <= 0) {
        setError("El identificador del registro no es válido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await pacienteRepository.obtenerPorId(db, id);
        setPaciente(data);
        if (!data) setError("El registro solicitado no existe.");
      } catch (e) {
        console.log("[APP ERROR] Yo no pude cargar el detalle", e);
        setError("No se pudo consultar el registro en SQLite.");
      } finally {
        setLoading(false);
      }
    };

    cargarPaciente();
  }, [db, id]);

  const guardarCambios = async () => {
    if (!paciente || !validarFormulario()) return;

    try {
      setSaving(true);
      setError(null);
      const datosActualizados = convertirFormularioADto(form);

      // Yo verifico que el DNI no pertenezca a otro paciente antes de actualizar.
      if (
        await pacienteRepository.dniExiste(
          db,
          datosActualizados.dni,
          paciente.id,
        )
      ) {
        setErrors({ dni: "Ya existe otro paciente registrado con este DNI." });
        return;
      }

      // Yo excluyo el registro actual al comprobar una posible duplicidad por nombre y teléfono.
      if (
        await pacienteRepository.nombreTelefonoExiste(
          db,
          datosActualizados.pacienteNombre,
          datosActualizados.telefono,
          paciente.id,
        )
      ) {
        setErrors({
          pacienteNombre: "Ya existe otro paciente con este nombre y teléfono.",
          telefono: "Este teléfono ya coincide con otro paciente.",
        });
        return;
      }

      await pacienteRepository.actualizar(db, paciente.id, datosActualizados);
      setPaciente({ ...paciente, ...datosActualizados });

      // Yo confirmo la actualización con una notificación visual propia de la aplicación.
      setToast({
        visible: true,
        type: "success",
        title: "Cambios guardados",
        message: "La atención fue actualizada correctamente en SQLite.",
      });
    } catch (e) {
      console.log("[APP ERROR] Yo no pude actualizar el paciente", e);
      setError("No se pudieron guardar los cambios.");
      setToast({
        visible: true,
        type: "error",
        title: "No se pudo actualizar",
        message: "Revisa la información e inténtalo nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmarEliminacion = () => {
    if (!paciente) return;

    Alert.alert(
      "Eliminar atención",
      `¿Deseas eliminar definitivamente la atención de ${paciente.pacienteNombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              // Yo elimino el registro únicamente después de la confirmación del usuario.
              await pacienteRepository.eliminar(db, paciente.id);
              router.replace({
                pathname: "/pacientes",
                params: { feedback: "deleted" },
              });
            } catch (e) {
              console.log("[APP ERROR] Yo no pude eliminar el paciente", e);
              setError("No se pudo eliminar el registro.");
              setToast({
                visible: true,
                type: "error",
                title: "Eliminación incompleta",
                message: "No se pudo eliminar la atención de SQLite.",
              });
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-5 pt-4">
        <AppHeader title="Detalle del paciente" />
        <LoadingState message="Consultando el registro en SQLite..." />
      </SafeAreaView>
    );
  }

  if (!paciente) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-5 pt-4">
        <AppHeader title="Paciente no encontrado" />
        <StateMessage
          message={error ?? "El registro solicitado no existe."}
          type="error"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppToast
        message={toast.message}
        onClose={cerrarToast}
        title={toast.title}
        type={toast.type}
        visible={toast.visible}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 22,
            paddingBottom: 40,
            paddingTop: 16,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AppHeader
            subtitle={formatearCodigoPaciente(paciente.id)}
            title="Detalle del paciente"
          />

          <View className="mb-4 rounded-[28px] bg-slate-950 p-5">
            <Text className="text-xs font-extrabold uppercase tracking-[2px] text-cyan-400">
              Atención odontológica
            </Text>
            <Text className="mt-2 text-2xl font-black text-white">
              {paciente.pacienteNombre}
            </Text>
            <Text className="mt-2 text-slate-400">
              Registrado el {formatearFecha(paciente.fechaRegistro)}
            </Text>
          </View>

          <View className="rounded-[28px] border border-slate-200 bg-white p-5">
            <PacienteForm
              errors={errors}
              form={form}
              onChange={actualizarCampo}
            />

            {error ? (
              <View className="mb-4">
                <StateMessage message={error} type="error" />
              </View>
            ) : null}

            <AppButton
              iconName="save-outline"
              loading={saving}
              onPress={guardarCambios}
              title="Guardar cambios"
            />
            <View className="mt-3">
              <AppButton
                iconName="trash-outline"
                onPress={confirmarEliminacion}
                title="Eliminar atención"
                variant="danger"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
