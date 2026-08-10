// Yo permito registrar doctores con Firebase Authentication y guardar su perfil profesional en Firestore.
import { Ionicons } from "@expo/vector-icons";
import { FirebaseError } from "firebase/app";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  doctorFirebaseRepository,
  obtenerCampoDuplicado,
} from "@/infrastructure/repositories/doctorFirebaseRepository";
import { AppButton } from "@/presentation/components/AppButton";
import { AppHeader } from "@/presentation/components/AppHeader";
import { AppInput } from "@/presentation/components/AppInput";
import { StateMessage } from "@/presentation/components/StateMessage";
import { useDoctorForm } from "@/presentation/hooks/useDoctorForm";
import { convertirDoctorADto } from "@/presentation/utils/validations";

export function RegistroDoctorScreen() {
  const router = useRouter();
  const { form, errors, setErrors, actualizarCampo, validarFormulario } =
    useDoctorForm();
  const [saving, setSaving] = useState(false);

  const registrarDoctor = async () => {
    if (!validarFormulario()) return;

    try {
      setSaving(true);
      setErrors({});

      // Yo dejo que Firebase valide el correo y Firestore controle DNI y colegiatura duplicados.
      await doctorFirebaseRepository.registrar(convertirDoctorADto(form));

      router.replace({
        pathname: "/login",
        params: { registro: "success", email: form.email.trim().toLowerCase() },
      });
    } catch (error) {
      console.log("[FIREBASE ERROR] Yo no pude registrar al doctor", error);

      const campoDuplicado = obtenerCampoDuplicado(error);
      if (campoDuplicado === "dni") {
        setErrors({ dni: "Este DNI ya está registrado." });
        return;
      }
      if (campoDuplicado === "colegiatura") {
        setErrors({
          colegiatura: "Esta colegiatura ya pertenece a otro doctor.",
        });
        return;
      }

      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setErrors({ email: "Este correo ya está registrado." });
          return;
        }
        if (error.code === "auth/weak-password") {
          setErrors({
            password: "La contraseña no cumple los requisitos de seguridad.",
          });
          return;
        }
        if (error.code === "auth/network-request-failed") {
          setErrors({
            general: "Revisa tu conexión a internet e inténtalo nuevamente.",
          });
          return;
        }
        if (error.code === "permission-denied") {
          setErrors({
            general:
              "Firebase no permite guardar el perfil. Revisa las reglas de Firestore.",
          });
          return;
        }
      }

      setErrors({ general: "No fue posible crear la cuenta del doctor." });
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
          <AppHeader title="Registrar doctor" />

          <View className="mb-4 rounded-[28px] bg-slate-950 p-5">
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500">
                <Ionicons name="person-add-outline" size={25} color="#ffffff" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-black text-white">
                  Información profesional
                </Text>
                <Text className="mt-1 text-sm text-slate-400">
                  Completa los datos para crear la cuenta.
                </Text>
              </View>
            </View>
          </View>

          <View className="rounded-[28px] border border-slate-200 bg-white p-5">
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
              title="Crear cuenta"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
