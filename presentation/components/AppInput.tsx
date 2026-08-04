// Yo reutilizo este campo para mostrar etiquetas, iconos y errores de la misma manera.
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
};

export function AppInput({
  label,
  error,
  iconName,
  isPassword = false,
  multiline,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 ml-1 font-bold text-slate-700">{label}</Text>
      <View
        className={`${multiline ? "min-h-28 items-start py-3" : "h-14 items-center"} flex-row rounded-2xl border px-4 ${
          error
            ? "border-red-300 bg-red-50"
            : focused
              ? "border-cyan-500 bg-white"
              : "border-slate-200 bg-slate-50"
        }`}
      >
        {iconName ? (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? "#ef4444" : "#64748b"}
          />
        ) : null}
        <TextInput
          {...props}
          className={`${iconName ? "ml-3" : ""} flex-1 text-base text-slate-900`}
          multiline={multiline}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          placeholderTextColor="#94a3b8"
          secureTextEntry={isPassword && !showPassword}
          textAlignVertical={multiline ? "top" : "center"}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setShowPassword((actual) => !actual)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={21}
              color="#64748b"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <Text className="ml-1 mt-1.5 text-sm font-medium text-red-500">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
