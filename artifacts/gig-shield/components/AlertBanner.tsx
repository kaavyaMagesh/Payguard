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
      bg: Colors.pastel.yellow,
      icon: "warning-outline",
      iconColor: "#C07000",
      border: "rgba(192,112,0,0.15)",
    },
    success: {
      bg: Colors.pastel.green,
      icon: "checkmark-circle-outline",
      iconColor: "#007A45",
      border: "rgba(0,122,69,0.15)",
    },
    info: {
      bg: Colors.pastel.blue,
      icon: "information-circle-outline",
      iconColor: "#005BAA",
      border: "rgba(0,91,170,0.15)",
    },
  }[type];

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.border }]}>
      <Ionicons name={config.icon as any} size={18} color={config.iconColor} />
      <View style={styles.text}>
        <Text style={styles.message}>{message}</Text>
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
    borderRadius: 20,
    borderWidth: 1,
  },
  text: { flex: 1, gap: 2 },
  message: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
    lineHeight: 18,
  },
});
