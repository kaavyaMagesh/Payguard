import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/colors";
import type { PolicyTier } from "@/context/AppContext";

interface PolicyCardProps {
  tier: PolicyTier;
  weeklyPremium: number;
  coverageAmount: number;
  selected?: boolean;
  onSelect?: () => void;
  current?: boolean;
}

const tierConfig: Record<PolicyTier, { label: string; bg: string; textColor: string; features: string[] }> = {
  basic: {
    label: "Basic",
    bg: Colors.mint,
    textColor: Colors.charcoal,
    features: ["₹1,000 coverage", "3 triggers", "Weekly auto-renew"],
  },
  standard: {
    label: "Standard",
    bg: Colors.lime,
    textColor: Colors.charcoal,
    features: ["₹2,500 coverage", "5 triggers", "Weekly auto-renew", "Pre-emptive alerts"],
  },
  premium: {
    label: "Premium",
    bg: Colors.charcoal,
    textColor: Colors.lime,
    features: ["₹5,000 coverage", "5 triggers + extras", "Streak discounts", "Micro top-ups", "Priority payout"],
  },
};

export function PolicyCard({ tier, weeklyPremium, coverageAmount, selected = false, onSelect, current = false }: PolicyCardProps) {
  const config = tierConfig[tier];
  const isPremium = tier === "premium";

  const handlePress = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect?.();
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: config.bg },
        selected && styles.cardSelected,
      ]}
      onPress={handlePress}
      activeOpacity={0.88}
    >
      {current && (
        <View style={[styles.currentBadge, { backgroundColor: isPremium ? Colors.lime : Colors.charcoal }]}>
          <Text style={[styles.currentLabel, { color: isPremium ? Colors.charcoal : Colors.lime }]}>ACTIVE</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={[styles.tierTag, { backgroundColor: isPremium ? Colors.lime : Colors.charcoal }]}>
          <Text style={[styles.tierName, { color: isPremium ? Colors.charcoal : Colors.lime }]}>{config.label}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={[styles.rupee, { color: config.textColor }]}>₹</Text>
          <Text style={[styles.price, { color: config.textColor }]}>{weeklyPremium}</Text>
          <Text style={[styles.period, { color: isPremium ? "rgba(200,255,0,0.6)" : Colors.charcoalMid }]}>/wk</Text>
        </View>
        <Text style={[styles.coverage, { color: isPremium ? "rgba(200,255,0,0.7)" : Colors.charcoalMid }]}>
          Up to ₹{coverageAmount.toLocaleString("en-IN")} covered
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: isPremium ? "rgba(200,255,0,0.2)" : "rgba(0,0,0,0.1)" }]} />

      <View style={styles.features}>
        {config.features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.check, { backgroundColor: isPremium ? Colors.lime : Colors.charcoal }]}>
              <Ionicons name="checkmark" size={10} color={isPremium ? Colors.charcoal : Colors.lime} />
            </View>
            <Text style={[styles.featureText, { color: config.textColor }]}>{f}</Text>
          </View>
        ))}
      </View>

      {selected && (
        <View style={[styles.selectedPill, { backgroundColor: isPremium ? Colors.lime : Colors.charcoal }]}>
          <Text style={[styles.selectedText, { color: isPremium ? Colors.charcoal : Colors.lime }]}>Selected</Text>
          <Ionicons name="checkmark-circle" size={14} color={isPremium ? Colors.charcoal : Colors.lime} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: Colors.charcoal,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardSelected: {
    shadowOffset: { width: 6, height: 6 },
  },
  currentBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
    zIndex: 10,
  },
  currentLabel: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  header: {
    padding: 20,
    gap: 4,
  },
  tierTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
    marginBottom: 8,
  },
  tierName: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
  },
  rupee: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  price: {
    fontSize: 42,
    fontFamily: "Inter_700Bold",
    lineHeight: 46,
  },
  period: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginLeft: 2,
  },
  coverage: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginTop: 2,
  },
  divider: {
    height: 1.5,
    marginHorizontal: 20,
  },
  features: {
    padding: 20,
    gap: 10,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  selectedPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
  selectedText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
});
