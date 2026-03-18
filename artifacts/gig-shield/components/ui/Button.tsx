import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/colors";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
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

  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";

  const bg = isPrimary ? Colors.charcoal : isGhost ? "transparent" : Colors.white;
  const textColor = isPrimary ? Colors.white : Colors.charcoal;
  const borderColor = isGhost ? Colors.charcoalMid : Colors.charcoal;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
          transform: pressed ? [{ scale: 0.98 }] : [],
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" style={{ flex: 1 }} />
      ) : (
        <>
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          <View style={styles.iconCircle}>
            <Ionicons name={trailingIcon as any} size={16} color={Colors.charcoal} />
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingLeft: 24,
    paddingRight: 8,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  fullWidth: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.2,
    flex: 1,
    textAlign: "center",
    marginLeft: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
});
