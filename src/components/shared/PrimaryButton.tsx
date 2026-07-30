import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "secondary" | "danger";
}

export default function PrimaryButton({ title, iconName, variant = "primary", disabled, ...props }: PrimaryButtonProps) {
  const background =
    variant === "danger" ? "bg-red-500" : variant === "secondary" ? "bg-slate-100" : "bg-cyan-600";
  const textColor = variant === "secondary" ? "text-slate-700" : "text-white";
  const iconColor = variant === "secondary" ? "#334155" : "#ffffff";

  return (
    <TouchableOpacity
      {...props}
      disabled={disabled}
      activeOpacity={0.8}
      className={`h-14 flex-row items-center justify-center rounded-2xl ${disabled ? "bg-slate-300" : background}`}
    >
      {iconName ? <Ionicons name={iconName} size={21} color={iconColor} /> : null}
      <Text className={`${iconName ? "ml-2" : ""} text-base font-bold ${textColor}`}>{title}</Text>
    </TouchableOpacity>
  );
}
