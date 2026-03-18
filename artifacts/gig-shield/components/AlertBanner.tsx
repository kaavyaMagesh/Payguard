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
      bg: "#FFF3CD",
      border: Colors.charcoal,
      icon: "warning",
      iconColor: "#FF9500",
      dot: "#FF9500",
    },
    success: {
      bg: Colors.lime,
      border: Colors.charcoal,
      icon: "checkmark-circle",
      iconColor: Colors.charcoal,
      dot: Colors.charcoal,
    },
    info: {
      bg: Colors.mint,
      border: Colors.charcoal,
      icon: "information-circle",
      iconColor: Colors.charcoal,
      dot: Colors.charcoal,
    },
  }[type];

  return (
    <View style={[styles.container, { backgroundColor: config.bg, borderColor: config.border }]}>
      <Ionicons name={config.icon as any} size={20} color={config.iconColor} />
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
    borderWidth: 2,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  text: { flex: 1, gap: 2 },
  message: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
    lineHeight: 18,
  },
});
