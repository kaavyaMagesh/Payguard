import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PolicyCard } from "@/components/PolicyCard";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";
import { type PolicyTier, useApp } from "@/context/AppContext";

export default function PolicyScreen() {
  const { policy, selectPolicyTier } = useApp();
  const insets = useSafeAreaInsets();
  const [selectedTier, setSelectedTier] = useState<PolicyTier>(policy?.tier ?? "standard");
  const [saving, setSaving] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      selectPolicyTier(selectedTier);
      setSaving(false);
      router.back();
    }, 800);
  };

  const tiers: { tier: PolicyTier; weeklyPremium: number; coverageAmount: number }[] = [
    { tier: "basic", weeklyPremium: 29, coverageAmount: 1000 },
    { tier: "standard", weeklyPremium: 49, coverageAmount: 2500 },
    { tier: "premium", weeklyPremium: 79, coverageAmount: 5000 },
  ];

  const selected = tiers.find((t) => t.tier === selectedTier)!;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 12, paddingBottom: bottomInset + 140 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.charcoal} />
          </Pressable>
          <View>
            <Text style={styles.title}>Choose Plan</Text>
            <Text style={styles.subtitle}>Auto-renews every week via UPI</Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="flash" size={18} color={Colors.charcoal} />
          <Text style={styles.infoText}>
            Parametric insurance — no claim filing ever. Payouts are fully automatic.
          </Text>
        </View>

        {/* Policy Cards */}
        <View style={styles.policyList}>
          {tiers.map((t) => (
            <PolicyCard
              key={t.tier}
              tier={t.tier}
              weeklyPremium={t.weeklyPremium}
              coverageAmount={t.coverageAmount}
              selected={selectedTier === t.tier}
              current={policy?.tier === t.tier}
              onSelect={() => setSelectedTier(t.tier)}
            />
          ))}
        </View>

        {/* Micro Top-up bento */}
        <View style={styles.topupCard}>
          <View style={styles.topupHeader}>
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
            <Text style={styles.topupTitle}>Micro Top-Ups</Text>
          </View>
          <Text style={styles.topupText}>
            On extreme weather days, buy single-day extra coverage for just ₹5–10. Available until 6 AM.
          </Text>
        </View>

        {/* Savings Pool */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsIcon}>
            <Ionicons name="wallet" size={20} color={Colors.charcoal} />
          </View>
          <View style={styles.savingsText}>
            <Text style={styles.savingsTitle}>Annual Savings Pool</Text>
            <Text style={styles.savingsDesc}>
              Unclaimed premiums are pooled. Workers with long streaks get year-end cashback.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: bottomInset + 16 }]}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Selected:</Text>
          <Text style={styles.footerTier}>{selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}</Text>
          <View style={styles.footerPricePill}>
            <Text style={styles.footerPrice}>₹{selected.weeklyPremium}/wk</Text>
          </View>
        </View>
        <Button
          label={saving ? "Activating..." : "Activate Plan"}
          onPress={handleSave}
          loading={saving}
          variant="dark"
          trailingIcon="flash"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.lime,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    padding: 14,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
    lineHeight: 20,
  },
  policyList: { gap: 12 },
  topupCard: {
    backgroundColor: Colors.mint,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    padding: 18,
    gap: 10,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  topupHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  newBadge: {
    backgroundColor: Colors.charcoal,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  newBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
    letterSpacing: 1,
  },
  topupTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  topupText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
    lineHeight: 20,
  },
  savingsCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    padding: 18,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  savingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.lime,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  savingsText: { flex: 1, gap: 4 },
  savingsTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  savingsDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
    lineHeight: 19,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingTop: 16,
    paddingHorizontal: 18,
    borderTopWidth: 2,
    borderTopColor: Colors.charcoal,
    gap: 12,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
  },
  footerTier: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  footerPricePill: {
    backgroundColor: Colors.lime,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
  footerPrice: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
});
