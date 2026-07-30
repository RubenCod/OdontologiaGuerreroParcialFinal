import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import CustomTextInput from "@/components/shared/CustomTextInput";
import PrimaryButton from "@/components/shared/PrimaryButton";
import ScreenHeader from "@/components/shared/ScreenHeader";
import { usePacientes } from "@/context/PacientesContext";
import { usePacienteForm } from "@/hooks/usePacienteForm";
import { ESTADOS, PRIORIDADES, TRATAMIENTOS } from "@/utils/constants";

export default function DetallePacienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarPaciente, actualizarPaciente, eliminarPaciente } = usePacientes();
  const paciente = buscarPaciente(id);

  if (!paciente) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 px-6 pt-4">
        <ScreenHeader title="Paciente no encontrado" />
        <View className="rounded-3xl bg-white p-6"><Text className="text-center text-slate-500">El registro solicitado ya no existe.</Text></View>
      </SafeAreaView>
    );
  }

  return <FormularioEdicion paciente={paciente} onActualizar={actualizarPaciente} onEliminar={eliminarPaciente} />;
}

function FormularioEdicion({ paciente, onActualizar, onEliminar }: { paciente: NonNullable<ReturnType<ReturnType<typeof usePacientes>["buscarPaciente"]>>; onActualizar: ReturnType<typeof usePacientes>["actualizarPaciente"]; onEliminar: ReturnType<typeof usePacientes>["eliminarPaciente"] }) {
  const router = useRouter();
  const { form, errors, setPacienteNombre, setEdad, setTelefono, setTratamiento, setPrioridad, setDescripcion, setEstado, validarFormulario } = usePacienteForm(paciente);

  const guardarCambios = () => {
    if (!validarFormulario()) return;
    if (!onActualizar(paciente.id, form)) return;
    Alert.alert("Cambios guardados", "La información del paciente fue actualizada.");
  };

  const confirmarEliminacion = () => {
    Alert.alert("Eliminar paciente", `¿Deseas eliminar el registro de ${paciente.pacienteNombre}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => { onEliminar(paciente.id); router.replace("/pacientes"); } },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <ScreenHeader title="Detalle del paciente" subtitle={`Registro ${paciente.id}`} />
          <View className="mb-4 rounded-3xl bg-cyan-600 p-5">
            <Text className="text-xs font-bold uppercase tracking-widest text-cyan-100">Atención odontológica</Text>
            <Text className="mt-2 text-2xl font-bold text-white">{paciente.pacienteNombre}</Text>
            <Text className="mt-1 text-cyan-50">Registrado el {new Date(paciente.fechaRegistro).toLocaleString("es-PE")}</Text>
          </View>
          <View className="rounded-3xl bg-white p-5">
            <CustomTextInput label="Nombre completo" value={form.pacienteNombre} onChangeText={setPacienteNombre} iconName="person-outline" error={errors.pacienteNombre} maxLength={50} />
            <View className="flex-row gap-3">
              <View className="flex-1"><CustomTextInput label="Edad" value={form.edad} onChangeText={setEdad} keyboardType="number-pad" iconName="calendar-outline" error={errors.edad} maxLength={3} /></View>
              <View className="flex-[1.5]"><CustomTextInput label="Teléfono" value={form.telefono} onChangeText={setTelefono} keyboardType="number-pad" iconName="call-outline" error={errors.telefono} maxLength={9} /></View>
            </View>
            <Selector title="Tratamiento" options={TRATAMIENTOS} value={form.tratamiento} onChange={setTratamiento} />
            <Selector title="Prioridad" options={PRIORIDADES} value={form.prioridad} onChange={setPrioridad} />
            <Selector title="Estado de atención" options={ESTADOS} value={form.estado} onChange={setEstado} />
            <CustomTextInput label="Descripción clínica" value={form.descripcion} onChangeText={setDescripcion} error={errors.descripcion} multiline numberOfLines={5} maxLength={250} />
            <Text className="-mt-2 mb-5 text-right text-xs text-slate-400">{form.descripcion.length}/250</Text>
            <PrimaryButton title="Guardar cambios" iconName="save-outline" onPress={guardarCambios} />
            <View className="mt-3"><PrimaryButton title="Eliminar paciente" iconName="trash-outline" variant="danger" onPress={confirmarEliminacion} /></View>
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
