import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface StreakBadgeProps {
  weeks: number;
}

export function StreakBadge({ weeks }: StreakBadgeProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.iconRow}>
        <Ionicons name="flame" size={20} color={Colors.warning} />
        <Text style={styles.weeks}>{weeks}</Text>
      </View>
      <Text style={styles.label}>week streak</Text>
      <Text style={styles.reward}>Keep going for 2% discount!</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accentLight,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.warning + "40",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  weeks: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: Colors.warning,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  reward: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: "center",
  },
});
