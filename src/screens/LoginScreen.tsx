import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomTextInput from "@/components/shared/CustomTextInput";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginScreen() {
  const { email, password, errors, handleEmailChange, handlePasswordChange, handleLogin } = useLoginForm();

  return (
    <SafeAreaView className="flex-1 bg-cyan-50">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 items-center">
            <View className="h-24 w-24 items-center justify-center rounded-3xl bg-cyan-600">
              <Ionicons name="medical" size={50} color="#ffffff" />
            </View>
            <Text className="mt-5 text-center text-3xl font-bold text-slate-800">Odontología Guerrero</Text>
            <Text className="mt-2 text-center text-base text-slate-500">Gestión de pacientes y tratamientos</Text>
          </View>

          <View className="rounded-3xl bg-white p-6">
            <Text className="text-2xl font-bold text-slate-800">Bienvenido</Text>
            <Text className="mb-6 mt-1 text-slate-500">Ingresa tus credenciales para continuar</Text>

            <CustomTextInput
              label="Correo electrónico"
              placeholder="correo@ejemplo.com"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              iconName="mail-outline"
              error={errors.email}
            />
            <CustomTextInput
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={handlePasswordChange}
              autoCapitalize="none"
              iconName="lock-closed-outline"
              isPassword
              error={errors.password}
              onSubmitEditing={handleLogin}
            />

            {errors.credentials ? (
              <View className="mb-4 flex-row items-center rounded-2xl bg-red-50 p-4">
                <Ionicons name="alert-circle-outline" size={21} color="#ef4444" />
                <Text className="ml-2 flex-1 text-sm font-medium text-red-500">{errors.credentials}</Text>
              </View>
            ) : null}

            <PrimaryButton title="Iniciar sesión" iconName="log-in-outline" onPress={handleLogin} />
          </View>
          <Text className="mt-6 text-center text-xs text-slate-400">Sistema de gestión odontológica</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
