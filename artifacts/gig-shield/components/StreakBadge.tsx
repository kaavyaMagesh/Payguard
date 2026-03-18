import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface StreakBadgeProps {
  weeks: number;
}

export function StreakBadge({ weeks }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconBox}>
          <Ionicons name="flame" size={20} color="#C07000" />
        </View>
        <View>
          <Text style={styles.label}>Current Streak</Text>
          <Text style={styles.reward}>2 more weeks for a discount!</Text>
        </View>
      </View>
      <View style={styles.weeksBadge}>
        <Text style={styles.weeks}>{weeks}</Text>
        <Text style={styles.weeksLabel}>WKS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pastel.yellow,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: -0.2,
  },
  reward: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
    marginTop: 2,
  },
  weeksBadge: {
    backgroundColor: Colors.charcoal,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  weeks: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
    letterSpacing: -0.5,
  },
  weeksLabel: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "rgba(212,255,0,0.55)",
    letterSpacing: 1,
  },
});
