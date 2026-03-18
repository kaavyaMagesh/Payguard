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
}

export function Card({
  children,
  style,
  onPress,
  padding = 16,
  radius = 16,
  ...rest
}: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, { padding, borderRadius: radius }, style]}
        onPress={onPress}
        activeOpacity={0.85}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.card, { padding, borderRadius: radius }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
});
