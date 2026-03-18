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

const triggerConfig: Record<TriggerType, { icon: string; color: string }> = {
  aqi: { icon: "cloudy", color: Colors.trigger.aqi },
  rain: { icon: "rainy", color: Colors.trigger.rain },
  heat: { icon: "thermometer", color: Colors.trigger.heat },
  curfew: { icon: "warning", color: Colors.trigger.curfew },
  flood: { icon: "water", color: Colors.trigger.flood },
};

export function TriggerMeter({ type, value, threshold, unit, label }: TriggerMeterProps) {
  const config = triggerConfig[type];
  const percent = Math.min((value / threshold) * 100, 100);
  const isTriggered = percent >= 100;
  const animWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: percent,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  const barColor = isTriggered ? Colors.lime : config.color;
  const remaining = Math.max(threshold - value, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.left}>
          <View style={[styles.iconBg, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon as any} size={16} color="#fff" />
          </View>
          <Text style={styles.name}>{label}</Text>
        </View>
        <Text style={[styles.value, { color: config.color }]}>
          {value}{unit}
          <Text style={styles.threshold}>/{threshold}{unit}</Text>
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
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  value: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  threshold: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  barTrack: {
    height: 10,
    backgroundColor: Colors.mint,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  hint: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.textMuted,
  },
});
