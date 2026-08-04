// Yo reutilizo este selector para tratamientos, prioridades y estados del formulario.
import { Text, TouchableOpacity, View } from "react-native";

type Props<T extends string> = {
  title: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  getLabel?: (value: T) => string;
};

export function OptionSelector<T extends string>({
  title,
  options,
  value,
  onChange,
  getLabel = (item) => item.replace(/_/g, " "),
}: Props<T>) {
  return (
    <View className="mb-5">
      <Text className="mb-2 ml-1 font-bold text-slate-700">{title}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <TouchableOpacity
              key={option}
              className={`rounded-full border px-4 py-2.5 ${
                selected
                  ? "border-cyan-600 bg-cyan-600"
                  : "border-slate-200 bg-slate-50"
              }`}
              onPress={() => onChange(option)}
            >
              <Text
                className={`text-xs font-extrabold ${selected ? "text-white" : "text-slate-600"}`}
              >
                {getLabel(option)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
