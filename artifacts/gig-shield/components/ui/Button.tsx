import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/colors";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "dark" | "danger" | "outline";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
  trailingIcon?: string;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  fullWidth = true,
  trailingIcon = "arrow-forward",
}: ButtonProps) {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const bg = {
    primary: Colors.lime,
    secondary: Colors.white,
    dark: Colors.charcoal,
    danger: Colors.danger,
    outline: "transparent",
  }[variant];

  const textColor = {
    primary: Colors.charcoal,
    secondary: Colors.charcoal,
    dark: Colors.lime,
    danger: Colors.white,
    outline: Colors.charcoal,
  }[variant];

  const borderColor = {
    primary: Colors.charcoal,
    secondary: Colors.charcoal,
    dark: Colors.charcoal,
    danger: Colors.charcoal,
    outline: Colors.charcoal,
  }[variant];

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? 0.5 : 1,
          transform: pressed ? [{ translateY: 2 }, { translateX: 2 }] : [],
          shadowOffset: pressed
            ? { width: 2, height: 2 }
            : { width: 4, height: 4 },
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          <Ionicons name={trailingIcon as any} size={18} color={textColor} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    borderWidth: 2,
    shadowColor: Colors.charcoal,
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
});
