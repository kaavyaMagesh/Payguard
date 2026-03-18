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

const tierConfig: Record<PolicyTier, { label: string; bg: string; textColor: string; iconColor: string; features: string[] }> = {
  basic: {
    label: "Basic",
    bg: Colors.pastel.green,
    textColor: Colors.charcoal,
    iconColor: "#007A45",
    features: ["₹1,000 coverage", "3 triggers", "Weekly auto-renew"],
  },
  standard: {
    label: "Standard",
    bg: Colors.lime,
    textColor: Colors.charcoal,
    iconColor: Colors.charcoal,
    features: ["₹2,500 coverage", "5 triggers", "Weekly auto-renew", "Pre-emptive alerts"],
  },
  premium: {
    label: "Premium",
    bg: Colors.charcoal,
    textColor: Colors.white,
    iconColor: Colors.lime,
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
      activeOpacity={0.9}
    >
      {current && (
        <View style={[styles.currentBadge, { backgroundColor: isPremium ? Colors.lime : Colors.charcoal }]}>
          <Text style={[styles.currentLabel, { color: isPremium ? Colors.charcoal : Colors.lime }]}>ACTIVE</Text>
        </View>
      )}

      <View style={styles.header}>
        <View style={[styles.tierPill, { backgroundColor: isPremium ? Colors.lime : "rgba(0,0,0,0.09)" }]}>
          <Text style={[styles.tierLabel, { color: isPremium ? Colors.charcoal : config.textColor }]}>{config.label}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={[styles.rupee, { color: config.textColor }]}>₹</Text>
          <Text style={[styles.price, { color: config.textColor }]}>{weeklyPremium}</Text>
          <Text style={[styles.period, { color: isPremium ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)" }]}>/week</Text>
        </View>
        <Text style={[styles.coverage, { color: isPremium ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }]}>
          Up to ₹{coverageAmount.toLocaleString("en-IN")} covered
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: isPremium ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }]} />

      <View style={styles.features}>
        {config.features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.check, { backgroundColor: config.iconColor + "22" }]}>
              <Ionicons name="checkmark" size={10} color={config.iconColor} />
            </View>
            <Text style={[styles.featureText, { color: config.textColor, opacity: isPremium ? 0.8 : 1 }]}>{f}</Text>
          </View>
        ))}
      </View>

      {selected && (
        <View style={[styles.selectedBanner, { backgroundColor: isPremium ? Colors.lime : Colors.charcoal }]}>
          <Text style={[styles.selectedText, { color: isPremium ? Colors.charcoal : Colors.lime }]}>Selected Plan</Text>
          <Ionicons name="checkmark-circle" size={15} color={isPremium ? Colors.charcoal : Colors.lime} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardSelected: {
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 6,
  },
  currentBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 10,
  },
  currentLabel: { fontSize: 9, fontFamily: "Inter_700Bold", letterSpacing: 1 },
  header: { padding: 20, gap: 4 },
  tierPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  tierLabel: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8, textTransform: "uppercase" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 1 },
  rupee: { fontSize: 18, fontFamily: "Inter_700Bold" },
  price: { fontSize: 44, fontFamily: "Inter_700Bold", letterSpacing: -1, lineHeight: 48 },
  period: { fontSize: 14, fontFamily: "Inter_500Medium", marginLeft: 2 },
  coverage: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  divider: { height: 1, marginHorizontal: 20 },
  features: { padding: 20, gap: 10 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  check: {
    width: 18,
    height: 18,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  selectedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  selectedText: { fontSize: 13, fontFamily: "Inter_700Bold" },
});
