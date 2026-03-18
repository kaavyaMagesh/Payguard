import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

interface RiskScoreRingProps {
  score: number;
  size?: number;
}

export function RiskScoreRing({ score, size = 100 }: RiskScoreRingProps) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: score,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const getColor = (s: number) => {
    if (s < 40) return Colors.success;
    if (s < 70) return Colors.warning;
    return Colors.danger;
  };

  const getLabel = (s: number) => {
    if (s < 40) return "Low Risk";
    if (s < 70) return "Moderate";
    return "High Risk";
  };

  const color = getColor(score);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.svgPlaceholder}>
        <View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: Colors.border,
            },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.ringFill,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopColor: "transparent",
              borderRightColor: score > 50 ? color : "transparent",
              transform: [{ rotate: "-90deg" }],
            },
          ]}
        />
      </View>
      <View style={styles.label}>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={styles.riskLabel}>{getLabel(score)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  svgPlaceholder: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
  },
  ringFill: {
    position: "absolute",
  },
  label: {
    alignItems: "center",
  },
  score: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
  },
  riskLabel: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
});
