import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { Colors } from "@/constants/colors";

interface CardProps extends Omit<TouchableOpacityProps, "style"> {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padding?: number;
  radius?: number;
  variant?: "default" | "lime" | "dark" | "mint" | "outline";
}

export function Card({
  children,
  style,
  onPress,
  padding = 16,
  radius = 32,
  variant = "default",
  ...rest
}: CardProps) {
  const bgColor = {
    default: Colors.white,
    lime: Colors.lime,
    dark: Colors.charcoal,
    mint: Colors.mint,
    outline: "transparent",
  }[variant];

  const borderColor = {
    default: Colors.charcoal,
    lime: Colors.charcoal,
    dark: Colors.charcoal,
    mint: Colors.charcoal,
    outline: Colors.charcoal,
  }[variant];

  const baseStyle = [
    styles.card,
    {
      padding,
      borderRadius: radius,
      backgroundColor: bgColor,
      borderColor,
    },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={baseStyle}
        onPress={onPress}
        activeOpacity={0.88}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={baseStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
});
