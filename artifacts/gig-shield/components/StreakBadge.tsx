import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface StreakBadgeProps {
  weeks: number;
}

export function StreakBadge({ weeks }: StreakBadgeProps) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
      friction: 8,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Ionicons name="flame" size={22} color={Colors.charcoal} />
        </View>
        <View>
          <Text style={styles.label}>Current Streak</Text>
          <Text style={styles.reward}>2 more weeks for discount!</Text>
        </View>
      </View>
      <View style={styles.weeksBadge}>
        <Text style={styles.weeks}>{weeks}</Text>
        <Text style={styles.weeksLabel}>WKS</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lime,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  reward: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
    marginTop: 2,
  },
  weeksBadge: {
    backgroundColor: Colors.charcoal,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
  },
  weeks: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
  },
  weeksLabel: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
    letterSpacing: 1,
  },
});
