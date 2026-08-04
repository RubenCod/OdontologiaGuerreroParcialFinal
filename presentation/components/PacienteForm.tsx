// Yo concentro los campos del formulario para reutilizarlos al crear y editar.
import { Text, View } from "react-native";

import {
  PacienteFormData,
  PacienteFormErrors,
} from "@/domain/models/PacienteLocal";
import { AppInput } from "@/presentation/components/AppInput";
import { OptionSelector } from "@/presentation/components/OptionSelector";
import {
  ESTADOS,
  ETIQUETAS_ESTADO,
  ETIQUETAS_TRATAMIENTO,
  PRIORIDADES,
  TRATAMIENTOS,
} from "@/presentation/utils/constants";

type Props = {
  form: PacienteFormData;
  errors: PacienteFormErrors;
  onChange: <K extends keyof PacienteFormData>(
    field: K,
    value: PacienteFormData[K],
  ) => void;
};

export function PacienteForm({ form, errors, onChange }: Props) {
  return (
    <View>
      <Text className="mb-5 text-lg font-black text-slate-900">
        Datos de la atención
      </Text>

      <AppInput
        error={errors.dni}
        iconName="card-outline"
        keyboardType="number-pad"
        label="DNI del paciente"
        maxLength={8}
        onChangeText={(value) => onChange("dni", value.replace(/\D/g, ""))}
        placeholder="8 dígitos"
        value={form.dni}
      />

      <AppInput
        autoCapitalize="words"
        error={errors.pacienteNombre}
        iconName="person-outline"
        label="Nombre completo"
        maxLength={60}
        onChangeText={(value) => onChange("pacienteNombre", value)}
        placeholder="Nombre y apellidos"
        value={form.pacienteNombre}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <AppInput
            error={errors.edad}
            iconName="calendar-outline"
            keyboardType="number-pad"
            label="Edad"
            maxLength={3}
            onChangeText={(value) => onChange("edad", value.replace(/\D/g, ""))}
            placeholder="Ej. 27"
            value={form.edad}
          />
        </View>
        <View className="flex-[1.5]">
          <AppInput
            error={errors.telefono}
            iconName="call-outline"
            keyboardType="number-pad"
            label="Teléfono"
            maxLength={9}
            onChangeText={(value) =>
              onChange("telefono", value.replace(/\D/g, ""))
            }
            placeholder="9 dígitos"
            value={form.telefono}
          />
        </View>
      </View>

      <OptionSelector
        getLabel={(value) => ETIQUETAS_TRATAMIENTO[value]}
        onChange={(value) => onChange("tratamiento", value)}
        options={TRATAMIENTOS}
        title="Tratamiento"
        value={form.tratamiento}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <AppInput
            error={errors.sesiones}
            iconName="layers-outline"
            keyboardType="number-pad"
            label="Sesiones"
            maxLength={2}
            onChangeText={(value) =>
              onChange("sesiones", value.replace(/\D/g, ""))
            }
            placeholder="Ej. 3"
            value={form.sesiones}
          />
        </View>
        <View className="flex-1">
          <AppInput
            error={errors.precio}
            iconName="cash-outline"
            keyboardType="decimal-pad"
            label="Precio (S/)"
            maxLength={8}
            onChangeText={(value) =>
              onChange("precio", value.replace(/[^0-9.]/g, ""))
            }
            placeholder="Ej. 250"
            value={form.precio}
          />
        </View>
      </View>

      <OptionSelector
        onChange={(value) => onChange("prioridad", value)}
        options={PRIORIDADES}
        title="Prioridad"
        value={form.prioridad}
      />

      <OptionSelector
        getLabel={(value) => ETIQUETAS_ESTADO[value]}
        onChange={(value) => onChange("estado", value)}
        options={ESTADOS}
        title="Estado de atención"
        value={form.estado}
      />

      <AppInput
        error={errors.descripcion}
        label="Descripción clínica"
        maxLength={300}
        multiline
        numberOfLines={5}
        onChangeText={(value) => onChange("descripcion", value)}
        placeholder="Describe el motivo de atención y las observaciones principales"
        value={form.descripcion}
      />
      <Text className="-mt-2 mb-5 text-right text-xs font-semibold text-slate-400">
        {form.descripcion.length}/300
      </Text>
    </View>
  );
}
