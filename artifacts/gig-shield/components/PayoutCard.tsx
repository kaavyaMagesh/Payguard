import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/colors";
import type { Payout, TriggerType } from "@/context/AppContext";

const triggerIcons: Record<TriggerType, { icon: string; color: string; bg: string }> = {
  aqi: { icon: "cloudy-outline", color: Colors.trigger.aqi, bg: Colors.pastel.peach },
  rain: { icon: "rainy-outline", color: Colors.trigger.rain, bg: Colors.pastel.blue },
  heat: { icon: "thermometer-outline", color: Colors.trigger.heat, bg: Colors.pastel.yellow },
  curfew: { icon: "warning-outline", color: Colors.trigger.curfew, bg: Colors.pastel.purple },
  flood: { icon: "water-outline", color: Colors.trigger.flood, bg: Colors.pastel.blue },
};

interface PayoutCardProps {
  payout: Payout;
}

export function PayoutCard({ payout }: PayoutCardProps) {
  const icon = triggerIcons[payout.triggerType];
  const dateStr = new Date(payout.timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.icon as any} size={18} color={icon.color} />
      </View>

      <View style={styles.content}>
        <Text style={styles.reason} numberOfLines={1}>{payout.reason}</Text>
        <Text style={styles.date}>{dateStr}</Text>
        <Text style={styles.ref}>{payout.upiRef}</Text>
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
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1, gap: 2 },
  reason: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
  },
  date: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  ref: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  amountBox: { alignItems: "flex-end", gap: 5 },
  amount: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: -0.3,
  },
  paidBadge: {
    backgroundColor: Colors.lime,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  paidText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: 0.5,
  },
});
