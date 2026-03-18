import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import type { TriggerType } from "@/context/AppContext";

interface TriggerMeterProps {
  type: TriggerType;
  value: number;
  threshold: number;
  unit: string;
  label: string;
}

const triggerConfig: Record<
  TriggerType,
  { icon: string; color: string; label: string }
> = {
  aqi: { icon: "cloudy", color: Colors.trigger.aqi, label: "AQI" },
  rain: { icon: "rainy", color: Colors.trigger.rain, label: "Rainfall" },
  heat: { icon: "thermometer", color: Colors.trigger.heat, label: "Heat" },
  curfew: { icon: "warning", color: Colors.trigger.curfew, label: "Alert" },
  flood: {
    icon: "water",
    color: Colors.trigger.flood,
    label: "Flood Alert",
  },
};

export function TriggerMeter({
  type,
  value,
  threshold,
  unit,
  label,
}: TriggerMeterProps) {
  const config = triggerConfig[type];
  const percent = Math.min((value / threshold) * 100, 100);
  const isClose = percent >= 75;
  const isTriggered = percent >= 100;
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: percent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const barColor = isTriggered
    ? Colors.success
    : isClose
      ? Colors.warning
      : config.color;
  const remaining = Math.max(threshold - value, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconRow}>
          <View style={[styles.iconBg, { backgroundColor: config.color + "18" }]}>
            <Ionicons
              name={config.icon as any}
              size={18}
              color={config.color}
            />
          </View>
          <View>
            <Text style={styles.name}>{label}</Text>
            <Text style={[styles.value, { color: config.color }]}>
              {value}
              {unit}
            </Text>
          </View>
        </View>
        <View style={styles.thresholdBox}>
          <Text style={styles.thresholdLabel}>Trigger at</Text>
          <Text style={styles.threshold}>
            {threshold}
            {unit}
          </Text>
        </View>
      </View>

      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: animWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      {isTriggered ? (
        <Text style={[styles.hint, { color: Colors.success }]}>
          Threshold reached — payout initiating
        </Text>
      ) : (
        <Text style={styles.hint}>
          {remaining}
          {unit} away from payout
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  thresholdBox: {
    alignItems: "flex-end",
  },
  thresholdLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  threshold: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
  },
  barTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  hint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
});
