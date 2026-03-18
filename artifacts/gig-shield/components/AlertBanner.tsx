import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface AlertBannerProps {
  message: string;
  type: "warning" | "success" | "info";
  subtitle?: string;
}

export function AlertBanner({ message, type, subtitle }: AlertBannerProps) {
  const config = {
    warning: {
      bg: "#FFF8E1",
      border: Colors.warning,
      icon: "warning",
      color: "#F57F17",
    },
    success: {
      bg: Colors.primaryLight,
      border: Colors.primary,
      icon: "checkmark-circle",
      color: Colors.primaryDark,
    },
    info: {
      bg: "#E3F2FD",
      border: Colors.info,
      icon: "information-circle",
      color: Colors.info,
    },
  }[type];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderLeftColor: config.border,
        },
      ]}
    >
      <Ionicons name={config.icon as any} size={20} color={config.color} />
      <View style={styles.text}>
        <Text style={[styles.message, { color: config.color }]}>{message}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  message: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
