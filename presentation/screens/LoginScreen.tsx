// Yo presento el acceso profesional y permito ingresar con doctores guardados en SQLite.
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
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
  const db = useSQLiteContext();
  const router = useRouter();
  const params = useLocalSearchParams<{
    email?: string;
    registro?: string;
  }>();
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
  } = useLoginForm(db, params.email ?? "");

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <AppToast
        message="La cuenta del doctor quedó guardado Correctamente. Ya puedes ingresar con tus credenciales."
        onClose={cerrarToast}
        title="Cuenta creada correctamente"
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
                  Evaluación final odontoapp
                </Text>
                <Text className="mt-1 text-xl font-black text-white">
                  EF_OdontologiaGuerrero
                </Text>
              </View>
            </View>

            <Text className="mt-7 text-4xl font-black leading-[46px] text-white">
              Gestión clínica Odontologia Guerrero
            </Text>
            <Text className="mt-3 text-base leading-6 text-slate-400">
              Ingresa con una cuenta de Usuario registrado en el dispositivo.
            </Text>
          </View>

          <View className="rounded-[32px] bg-white p-6">
            <View className="mb-6 flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-2xl font-black text-slate-900">
                  Iniciar sesión
                </Text>
                <Text className="mt-1 leading-5 text-slate-500">
                  Tus credenciales se validan con SQLite.
                </Text>
              </View>
              
            </View>

            <AppInput
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              iconName="mail-outline"
              keyboardType="email-address"
              label="Correo profesional"
              onChangeText={cambiarEmail}
              placeholder="ejemplo@correo.com"
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
              title="Ingresar al sistema"
            />

            <View className="my-5 h-px bg-slate-200" />

            <Text className="text-center text-sm font-semibold text-slate-500">
              ¿Todavía no tienes credenciales?
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="mt-3 h-14 flex-row items-center justify-center rounded-2xl border border-cyan-200 bg-cyan-50"
              onPress={() => router.push("/registro-doctor")}
            >
              <Ionicons
                name="person-add-outline"
                size={21}
                color="#0e7490"
              />
              <Text className="ml-2 text-base font-extrabold text-cyan-800">
                Crear cuenta de Usuario
              </Text>
            </TouchableOpacity>
          </View>

       
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
