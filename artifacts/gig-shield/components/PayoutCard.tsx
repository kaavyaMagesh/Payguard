import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import type { Payout, TriggerType } from "@/context/AppContext";

const triggerIcons: Record<TriggerType, { icon: string; color: string }> = {
  aqi: { icon: "cloudy", color: Colors.trigger.aqi },
  rain: { icon: "rainy", color: Colors.trigger.rain },
  heat: { icon: "thermometer", color: Colors.trigger.heat },
  curfew: { icon: "warning", color: Colors.trigger.curfew },
  flood: { icon: "water", color: Colors.trigger.flood },
};

interface PayoutCardProps {
  payout: Payout;
}

export function PayoutCard({ payout }: PayoutCardProps) {
  const icon = triggerIcons[payout.triggerType];
  const date = new Date(payout.timestamp);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: icon.color + "18" }]}>
        <Ionicons name={icon.icon as any} size={22} color={icon.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.reason} numberOfLines={1}>
          {payout.reason}
        </Text>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.upi} numberOfLines={1}>
          UPI Ref: {payout.upiRef}
        </Text>
      </View>

      <View style={styles.amountBox}>
        <Text style={styles.amount}>+₹{payout.amount}</Text>
        <View style={styles.successDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  reason: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  date: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  upi: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  amountBox: {
    alignItems: "flex-end",
    gap: 4,
  },
  amount: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.success,
  },
  successDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
});
