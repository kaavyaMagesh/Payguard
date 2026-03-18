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

const triggerConfig: Record<TriggerType, { icon: string; color: string; bg: string }> = {
  aqi: { icon: "cloudy-outline", color: Colors.trigger.aqi, bg: Colors.pastel.peach },
  rain: { icon: "rainy-outline", color: Colors.trigger.rain, bg: Colors.pastel.blue },
  heat: { icon: "thermometer-outline", color: Colors.trigger.heat, bg: Colors.pastel.yellow },
  curfew: { icon: "warning-outline", color: Colors.trigger.curfew, bg: Colors.pastel.purple },
  flood: { icon: "water-outline", color: Colors.trigger.flood, bg: Colors.pastel.blue },
};

export function TriggerMeter({ type, value, threshold, unit, label }: TriggerMeterProps) {
  const config = triggerConfig[type];
  const percent = Math.min((value / threshold) * 100, 100);
  const isTriggered = percent >= 100;
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: percent,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const barColor = isTriggered ? Colors.lime : config.color;
  const remaining = Math.max(threshold - value, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={[styles.iconBg, { backgroundColor: config.bg }]}>
            <Ionicons name={config.icon as any} size={15} color={config.color} />
          </View>
          <Text style={styles.name}>{label}</Text>
        </View>
        <Text style={[styles.value, { color: config.color }]}>
          {value}{unit}
          <Text style={styles.threshold}> / {threshold}{unit}</Text>
        </Text>
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

      <Text style={styles.hint}>
        {isTriggered
          ? "Threshold hit — payout initiating"
          : `${remaining}${unit} away from payout`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
  },
  value: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  threshold: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  barTrack: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.07)",
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  hint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
});
