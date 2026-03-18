import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";
import type { Policy, PolicyTier } from "@/context/AppContext";

interface PolicyCardProps {
  tier: PolicyTier;
  weeklyPremium: number;
  coverageAmount: number;
  selected?: boolean;
  onSelect?: () => void;
  current?: boolean;
}

const tierConfig: Record<
  PolicyTier,
  { label: string; color: string; bg: string; features: string[] }
> = {
  basic: {
    label: "Basic",
    color: Colors.tier.basic.badge,
    bg: Colors.tier.basic.bg,
    features: ["₹1,000 coverage", "3 triggers", "Weekly auto-renew"],
  },
  standard: {
    label: "Standard",
    color: Colors.tier.standard.badge,
    bg: Colors.tier.standard.bg,
    features: [
      "₹2,500 coverage",
      "5 triggers",
      "Weekly auto-renew",
      "Pre-emptive alerts",
    ],
  },
  premium: {
    label: "Premium",
    color: Colors.tier.premium.badge,
    bg: Colors.tier.premium.bg,
    features: [
      "₹5,000 coverage",
      "5 triggers + extras",
      "Streak discounts",
      "Micro top-ups",
      "Priority payout",
    ],
  },
};

export function PolicyCard({
  tier,
  weeklyPremium,
  coverageAmount,
  selected = false,
  onSelect,
  current = false,
}: PolicyCardProps) {
  const config = tierConfig[tier];

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSelect?.();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && { borderColor: config.color, borderWidth: 2 },
        !selected && { borderColor: Colors.border, borderWidth: 1 },
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {current && (
        <View style={[styles.currentBadge, { backgroundColor: config.color }]}>
          <Text style={styles.currentLabel}>Active</Text>
        </View>
      )}

      <View style={[styles.header, { backgroundColor: config.bg }]}>
        <Text style={[styles.tierName, { color: config.color }]}>
          {config.label}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.rupee}>₹</Text>
          <Text style={[styles.price, { color: config.color }]}>
            {weeklyPremium}
          </Text>
          <Text style={styles.period}>/week</Text>
        </View>
        <Text style={styles.coverage}>up to ₹{coverageAmount.toLocaleString("en-IN")} coverage</Text>
      </View>

      <View style={styles.features}>
        {config.features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={config.color}
            />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {selected && (
        <View style={[styles.selectedFooter, { backgroundColor: config.color }]}>
          <Text style={styles.selectedText}>Selected Plan</Text>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  currentBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },
  currentLabel: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  header: {
    padding: 16,
    alignItems: "flex-start",
  },
  tierName: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  rupee: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  price: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
  },
  period: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  coverage: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  features: {
    padding: 16,
    gap: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
  },
  selectedFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  selectedText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
