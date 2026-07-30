import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export default function CustomTextInput({
  label,
  error,
  isPassword = false,
  iconName,
  multiline,
  ...props
}: CustomTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <Text className="mb-2 ml-1 font-semibold text-slate-700">{label}</Text>
      <View
        className={`${multiline ? "min-h-28 items-start py-3" : "h-14 items-center"} flex-row rounded-2xl border-2 px-4 ${
          error
            ? "border-red-400 bg-red-50"
            : isFocused
              ? "border-cyan-500 bg-white"
              : "border-slate-200 bg-slate-50"
        }`}
      >
        {iconName ? (
          <Ionicons name={iconName} size={21} color={error ? "#ef4444" : "#64748b"} />
        ) : null}
        <TextInput
          {...props}
          multiline={multiline}
          className={`${iconName ? "ml-3" : ""} flex-1 text-base text-slate-800`}
          placeholderTextColor="#94a3b8"
          secureTextEntry={isPassword && !showPassword}
          textAlignVertical={multiline ? "top" : "center"}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            props.onBlur?.(event);
          }}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword((value) => !value)} activeOpacity={0.7}>
            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#64748b" />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? (
        <View className="mt-2 flex-row items-center">
          <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
          <Text className="ml-1 flex-1 text-sm text-red-500">{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
