import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import type { Payout, TriggerType } from "@/context/AppContext";

const triggerIcons: Record<TriggerType, { icon: string; color: string; bg: string }> = {
  aqi: { icon: "cloudy", color: "#fff", bg: Colors.trigger.aqi },
  rain: { icon: "rainy", color: "#fff", bg: Colors.trigger.rain },
  heat: { icon: "thermometer", color: "#fff", bg: Colors.trigger.heat },
  curfew: { icon: "warning", color: "#fff", bg: Colors.trigger.curfew },
  flood: { icon: "water", color: "#fff", bg: Colors.trigger.flood },
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
      <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.icon as any} size={20} color={icon.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.reason} numberOfLines={1}>{payout.reason}</Text>
        <Text style={styles.date}>{dateStr} · {payout.upiRef}</Text>
      </View>

      <View style={styles.amountBox}>
        <Text style={styles.amount}>+₹{payout.amount}</Text>
        <View style={styles.paidBadge}>
          <Text style={styles.paidText}>PAID</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, gap: 3 },
  reason: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  date: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  amountBox: { alignItems: "flex-end", gap: 4 },
  amount: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  paidBadge: {
    backgroundColor: Colors.lime,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
  paidText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: 0.5,
  },
});
