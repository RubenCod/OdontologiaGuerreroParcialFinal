import { Text, TouchableOpacity } from "react-native";

interface FiltroChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function FiltroChip({ label, selected, onPress }: FiltroChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`mr-2 rounded-full border px-4 py-2.5 ${
        selected ? "border-cyan-600 bg-cyan-600" : "border-slate-200 bg-white"
      }`}
    >
      <Text className={`text-sm font-semibold ${selected ? "text-white" : "text-slate-600"}`}>{label}</Text>
    </TouchableOpacity>
  );
}
