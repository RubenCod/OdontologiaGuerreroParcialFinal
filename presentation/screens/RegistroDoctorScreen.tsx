// Yo permito registrar doctores y guardar sus credenciales de forma persistente en SQLite.
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { doctorRepository } from "@/infrastructure/repositories/doctorRepository";
import { AppButton } from "@/presentation/components/AppButton";
import { AppHeader } from "@/presentation/components/AppHeader";
import { AppInput } from "@/presentation/components/AppInput";
import { StateMessage } from "@/presentation/components/StateMessage";
import { useDoctorForm } from "@/presentation/hooks/useDoctorForm";
import { convertirDoctorADto } from "@/presentation/utils/validations";

export function RegistroDoctorScreen() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { form, errors, setErrors, actualizarCampo, validarFormulario } =
    useDoctorForm();
  const [saving, setSaving] = useState(false);

  const registrarDoctor = async () => {
    if (!validarFormulario()) return;

    try {
      setSaving(true);
      setErrors({});

      // Yo verifico los identificadores únicos antes de registrar al doctor.
      if (await doctorRepository.dniExiste(db, form.dni)) {
        setErrors({ dni: "Este DNI ya está registrado." });
        return;
      }

      if (await doctorRepository.correoExiste(db, form.email)) {
        setErrors({ email: "Este correo ya está registrado." });
        return;
      }

      if (await doctorRepository.colegiaturaExiste(db, form.colegiatura)) {
        setErrors({
          colegiatura: "Esta colegiatura ya pertenece a otro doctor.",
        });
        return;
      }

      await doctorRepository.crear(db, convertirDoctorADto(form));

      router.replace({
        pathname: "/login",
        params: { registro: "success", email: form.email.trim().toLowerCase() },
      });
    } catch (error) {
      console.log("[APP ERROR] Yo no pude registrar al doctor", error);
      setErrors({
        general:
          "No se pudo crear la cuenta. Verifica que el DNI, correo y colegiatura no estén registrados.",
      });
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
          <AppHeader title="Registrar Nuevo Usuario" />

          <View className="mb-4 rounded-[28px] bg-slate-950 p-5">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500">
                <Ionicons
                  name="shield-checkmark-outline"
                  size={25}
                  color="#ffffff"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-black text-white">
                  Registro de doctor
                </Text>
              </View>
            </View>
          </View>

          <View className="rounded-[28px] border border-slate-200 bg-white p-5">
            <Text className="mb-5 text-lg font-black text-slate-900">
              Información profesional
            </Text>

            <AppInput
              error={errors.dni}
              iconName="card-outline"
              keyboardType="number-pad"
              label="DNI"
              maxLength={8}
              onChangeText={(value) =>
                actualizarCampo("dni", value.replace(/\D/g, ""))
              }
              placeholder="8 dígitos"
              value={form.dni}
            />

            <AppInput
              autoCapitalize="words"
              error={errors.nombres}
              iconName="person-outline"
              label="Nombres"
              maxLength={40}
              onChangeText={(value) => actualizarCampo("nombres", value)}
              placeholder="Ej. Juan Carlos"
              value={form.nombres}
            />

            <AppInput
              autoCapitalize="words"
              error={errors.apellidos}
              iconName="people-outline"
              label="Apellidos"
              maxLength={50}
              onChangeText={(value) => actualizarCampo("apellidos", value)}
              placeholder="Ej. Guerrero Pérez"
              value={form.apellidos}
            />

            <AppInput
              autoCapitalize="characters"
              error={errors.colegiatura}
              iconName="ribbon-outline"
              label="Número de colegiatura"
              maxLength={20}
              onChangeText={(value) =>
                actualizarCampo(
                  "colegiatura",
                  value.replace(/[^A-Za-z0-9-]/g, ""),
                )
              }
              placeholder="Ej. COP-12345"
              value={form.colegiatura}
            />

            <AppInput
              autoCapitalize="sentences"
              error={errors.especialidad}
              iconName="medical-outline"
              label="Especialidad"
              maxLength={60}
              onChangeText={(value) => actualizarCampo("especialidad", value)}
              placeholder="Ej. Ortodoncia"
              value={form.especialidad}
            />

            <Text className="mb-5 mt-2 text-lg font-black text-slate-900">
              Credenciales de acceso
            </Text>

            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              iconName="mail-outline"
              keyboardType="email-address"
              label="Correo electrónico"
              onChangeText={(value) => actualizarCampo("email", value)}
              placeholder="doctor@correo.com"
              value={form.email}
            />

            <AppInput
              autoCapitalize="none"
              error={errors.password}
              iconName="lock-closed-outline"
              isPassword
              label="Contraseña"
              maxLength={20}
              onChangeText={(value) => actualizarCampo("password", value)}
              placeholder="Mínimo 6 caracteres"
              value={form.password}
            />

            <AppInput
              autoCapitalize="none"
              error={errors.confirmarPassword}
              iconName="shield-checkmark-outline"
              isPassword
              label="Confirmar contraseña"
              maxLength={20}
              onChangeText={(value) =>
                actualizarCampo("confirmarPassword", value)
              }
              onSubmitEditing={registrarDoctor}
              placeholder="Repite la contraseña"
              returnKeyType="done"
              value={form.confirmarPassword}
            />

            {errors.general ? (
              <View className="mb-4">
                <StateMessage message={errors.general} type="error" />
              </View>
            ) : null}

            <AppButton
              iconName="person-add-outline"
              loading={saving}
              onPress={registrarDoctor}
              title="Guardar Usuario"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
