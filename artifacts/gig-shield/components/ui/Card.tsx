import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
  radius?: number;
  variant?: "default" | "lime" | "dark" | "mint" | "yellow" | "blue" | "peach" | "purple" | "pink" | "green";
  noBorder?: boolean;
}

const variantColors: Record<string, string> = {
  default: Colors.white,
  lime: Colors.lime,
  dark: Colors.charcoal,
  mint: Colors.mint,
  yellow: Colors.pastel.yellow,
  blue: Colors.pastel.blue,
  peach: Colors.pastel.peach,
  purple: Colors.pastel.purple,
  pink: Colors.pastel.pink,
  green: Colors.pastel.green,
};

export function Card({
  children,
  style,
  onPress,
  padding = 16,
  radius = 32,
  variant = "default",
  noBorder = false,
}: CardProps) {
  const bgColor = variantColors[variant] ?? Colors.white;

  const baseStyle = [
    styles.card,
    {
      padding,
      borderRadius: radius,
      backgroundColor: bgColor,
      borderWidth: noBorder ? 0 : 1,
      borderColor: noBorder ? "transparent" : "rgba(0,0,0,0.06)",
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={baseStyle as any} onPress={onPress} activeOpacity={0.88}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={baseStyle as any}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
});
