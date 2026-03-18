import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Colors } from "@/constants/colors";

interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  style?: ViewStyle;
  size?: "sm" | "md";
}

export function Badge({
  label,
  color = Colors.primary,
  bg,
  style,
  size = "sm",
}: BadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        size === "md" && styles.badgeMd,
        { backgroundColor: bg ?? color + "20" },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          size === "md" && styles.labelMd,
          { color },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  labelMd: {
    fontSize: 13,
  },
});
