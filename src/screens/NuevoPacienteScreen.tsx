import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import CustomTextInput from "@/components/shared/CustomTextInput";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ScreenHeader from "@/components/shared/ScreenHeader";
import { usePacientes } from "@/context/PacientesContext";
import { usePacienteForm } from "@/hooks/usePacienteForm";
import { ESTADOS, PRIORIDADES, TRATAMIENTOS } from "@/utils/constants";

export default function NuevoPacienteScreen() {
  const router = useRouter();
  const { agregarPaciente } = usePacientes();
  const { form, errors, setPacienteNombre, setEdad, setTelefono, setTratamiento, setPrioridad, setDescripcion, setEstado, validarFormulario } = usePacienteForm();

  const guardarPaciente = () => {
    if (!validarFormulario()) return;
    agregarPaciente(form);
    Alert.alert("Registro exitoso", "El paciente fue registrado correctamente.", [
      { text: "Ver pacientes", onPress: () => router.replace("/pacientes") },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <ScreenHeader title="Registrar paciente" subtitle="Completa la información de la atención odontológica" />
          <View className="rounded-3xl bg-white p-5">
            <Text className="mb-5 text-lg font-bold text-slate-800">Datos del paciente</Text>
            <CustomTextInput label="Nombre completo" placeholder="Nombre y apellidos" value={form.pacienteNombre} onChangeText={setPacienteNombre} iconName="person-outline" error={errors.pacienteNombre} autoCapitalize="words" maxLength={50} />
            <View className="flex-row gap-3">
              <View className="flex-1"><CustomTextInput label="Edad" placeholder="Ej. 27" value={form.edad} onChangeText={setEdad} keyboardType="number-pad" iconName="calendar-outline" error={errors.edad} maxLength={3} /></View>
              <View className="flex-[1.5]"><CustomTextInput label="Teléfono" placeholder="9 dígitos" value={form.telefono} onChangeText={setTelefono} keyboardType="number-pad" iconName="call-outline" error={errors.telefono} maxLength={9} /></View>
            </View>
            <Selector title="Tratamiento" options={TRATAMIENTOS} value={form.tratamiento} onChange={setTratamiento} />
            <Selector title="Prioridad" options={PRIORIDADES} value={form.prioridad} onChange={setPrioridad} />
            <Selector title="Estado de atención" options={ESTADOS} value={form.estado} onChange={setEstado} />
            <CustomTextInput label="Descripción clínica" placeholder="Describe el motivo de atención o las observaciones principales" value={form.descripcion} onChangeText={setDescripcion} error={errors.descripcion} multiline numberOfLines={5} maxLength={250} />
            <Text className="-mt-2 mb-5 text-right text-xs text-slate-400">{form.descripcion.length}/250</Text>
            <PrimaryButton title="Registrar paciente" iconName="save-outline" onPress={guardarPaciente} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Selector<T extends string>({ title, options, value, onChange }: { title: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return (
    <View className="mb-5">
      <Text className="mb-2 ml-1 font-semibold text-slate-700">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <TouchableOpacity key={option} onPress={() => onChange(option)} className={`rounded-full border px-4 py-2.5 ${value === option ? "border-cyan-600 bg-cyan-600" : "border-slate-200 bg-slate-50"}`}>
            <Text className={`text-xs font-bold ${value === option ? "text-white" : "text-slate-600"}`}>{option.replace("_", " ")}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
