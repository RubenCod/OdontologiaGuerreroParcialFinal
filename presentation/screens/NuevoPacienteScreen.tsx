// Yo registro una atención nueva en SQLite y redirijo con un mensaje profesional de confirmación.
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { pacienteRepository } from "@/infrastructure/repositories/pacienteRepository";
import { AppButton } from "@/presentation/components/AppButton";
import { AppHeader } from "@/presentation/components/AppHeader";
import { PacienteForm } from "@/presentation/components/PacienteForm";
import { StateMessage } from "@/presentation/components/StateMessage";
import { usePacienteForm } from "@/presentation/hooks/usePacienteForm";
import { convertirFormularioADto } from "@/presentation/utils/validations";

export function NuevoPacienteScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { form, errors, setErrors, actualizarCampo, validarFormulario } =
    usePacienteForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardarPaciente = async () => {
    if (!validarFormulario()) return;

    try {
      setSaving(true);
      setError(null);
      const dto = convertirFormularioADto(form);

      // Yo uso el DNI como control principal para impedir pacientes duplicados.
      if (await pacienteRepository.dniExiste(db, dto.dni)) {
        setErrors({ dni: "Ya existe un paciente registrado con este DNI." });
        return;
      }

      // Yo agrego una segunda comprobación para detectar registros repetidos por error.
      if (
        await pacienteRepository.nombreTelefonoExiste(
          db,
          dto.pacienteNombre,
          dto.telefono,
        )
      ) {
        setErrors({
          pacienteNombre: "Ya existe un paciente con este nombre y teléfono.",
          telefono: "Este teléfono ya coincide con el mismo paciente.",
        });
        return;
      }

      const id = await pacienteRepository.crear(db, dto);

      router.replace({
        pathname: "/pacientes/[id]",
        params: { id: String(id), feedback: "created" },
      });
    } catch (e) {
      console.log("[APP ERROR] Yo no pude registrar el paciente", e);
      setError("No se pudo guardar la atención. Revisa los datos ingresados.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
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
          <AppHeader title="Nueva atención" />

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
              onPress={guardarPaciente}
              title="Guardar atención"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
