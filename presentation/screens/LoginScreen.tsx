// Yo presento el acceso de doctores autenticados mediante Firebase Authentication.
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "@/presentation/components/AppButton";
import { AppInput } from "@/presentation/components/AppInput";
import { AppToast } from "@/presentation/components/AppToast";
import { StateMessage } from "@/presentation/components/StateMessage";
import { useLoginForm } from "@/presentation/hooks/useLoginForm";

export function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string; registro?: string }>();
  const [showToast, setShowToast] = useState(params.registro === "success");
  const cerrarToast = useCallback(() => setShowToast(false), []);
  const {
    email,
    password,
    errors,
    loading,
    cambiarEmail,
    cambiarPassword,
    iniciarSesion,
  } = useLoginForm(params.email ?? "");

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <AppToast
        message="Ya puedes ingresar con el correo y contraseña registrados."
        onClose={cerrarToast}
        title="Cuenta creada"
        type="success"
        visible={showToast}
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-7">
            <View className="flex-row items-center">
              <View className="h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500">
                <Ionicons name="medical" size={34} color="#ffffff" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-xs font-extrabold uppercase tracking-[2px] text-cyan-400">
                  Odontología Guerrero
                </Text>
                <Text className="mt-1 text-xl font-black text-white">
                  Odontología Guerrero App
                </Text>
              </View>
            </View>
          </View>

          <View className="rounded-[32px] bg-white p-6">
            <Text className="text-2xl font-black text-slate-900">
              Iniciar sesión
            </Text>
            <Text className="mb-6 mt-1 leading-5 text-slate-500">
              Ingresa tus credenciales profesionales.
            </Text>

            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              iconName="mail-outline"
              keyboardType="email-address"
              label="Correo profesional"
              onChangeText={cambiarEmail}
              placeholder="doctor@correo.com"
              value={email}
            />
            <AppInput
              autoCapitalize="none"
              error={errors.password}
              iconName="lock-closed-outline"
              isPassword
              label="Contraseña"
              onChangeText={cambiarPassword}
              onSubmitEditing={iniciarSesion}
              placeholder="Ingresa tu contraseña"
              returnKeyType="done"
              value={password}
            />

            {errors.credentials ? (
              <View className="mb-4">
                <StateMessage message={errors.credentials} type="error" />
              </View>
            ) : null}

            <AppButton
              iconName="log-in-outline"
              loading={loading}
              onPress={iniciarSesion}
              title="Ingresar"
            />

            <View className="my-5 h-px bg-slate-200" />

            <Text className="text-center text-sm font-semibold text-slate-500">
              ¿No tienes una cuenta?
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="mt-3 h-14 flex-row items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50"
              onPress={() => router.push("/registro-doctor")}
            >
              <Ionicons name="person-add-outline" size={21} color="#0e7490" />
              <Text className="ml-2 text-base font-extrabold text-cyan-800">
                Registrar doctor
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
