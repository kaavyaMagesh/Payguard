import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface RiskScoreRingProps {
  score: number;
  size?: number;
}

export function RiskScoreRing({ score, size = 100 }: RiskScoreRingProps) {
  const getColor = (s: number) => {
    if (s < 40) return Colors.lime;
    if (s < 70) return Colors.warning;
    return Colors.danger;
  };

  const getLabel = (s: number) => {
    if (s < 40) return "LOW RISK";
    if (s < 70) return "MODERATE";
    return "HIGH RISK";
  };

  const color = getColor(score);

  return (
    <View style={[styles.container as any, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.label}>{getLabel(score)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: Colors.charcoal,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  score: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  label: {
    fontSize: 8,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: 0.5,
  },
});
