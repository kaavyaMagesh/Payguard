import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
    <LinearGradient
      colors={[Colors.mint, Colors.white]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.55 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 12, paddingBottom: bottomInset + 150 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={18} color={Colors.charcoal} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Choose Plan</Text>
            <Text style={styles.subtitle}>Auto-renews weekly via UPI · Cancel anytime</Text>
          </View>
        </View>

        {/* Info pill */}
        <View style={styles.infoPill}>
          <View style={styles.infoIcon}>
            <Ionicons name="flash" size={14} color={Colors.charcoal} />
          </View>
          <Text style={styles.infoText}>No claim filing ever. Payouts are fully automatic based on real-time conditions.</Text>
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

        {/* Micro Top-up Bento */}
        <View style={styles.topupCard}>
          <View style={styles.topupLeft}>
            <View style={styles.newPill}>
              <Text style={styles.newPillText}>NEW</Text>
            </View>
            <Text style={styles.topupTitle}>Micro Top-Ups</Text>
            <Text style={styles.topupText}>Buy single-day extra coverage for ₹5–10 on extreme weather days. Available until 6 AM.</Text>
          </View>
          <View style={styles.topupIcon}>
            <Ionicons name="add-circle-outline" size={32} color={Colors.charcoal} />
          </View>
        </View>

        {/* Savings Pool */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsIcon}>
            <Ionicons name="wallet-outline" size={18} color={Colors.charcoal} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={styles.savingsTitle}>Annual Savings Pool</Text>
            <Text style={styles.savingsText}>Unclaimed premiums pool at year-end. Workers with long streaks get cashback.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={[styles.footer, { paddingBottom: bottomInset + 16 }]}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerLabel}>Selected plan</Text>
          <View style={styles.footerPriceRow}>
            <Text style={styles.footerTier}>{selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}</Text>
            <View style={styles.footerPill}>
              <Text style={styles.footerPrice}>₹{selected.weeklyPremium}/wk</Text>
            </View>
          </View>
        </View>
        <Button
          label={saving ? "Activating..." : "Activate Plan"}
          onPress={handleSave}
          loading={saving}
          variant="primary"
          trailingIcon="flash"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 18, gap: 16 },
  header: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.07)",
    marginTop: 2,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.charcoalMid, marginTop: 2 },
  infoPill: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.lime,
    borderRadius: 999,
    padding: 12,
    paddingLeft: 10,
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
    lineHeight: 20,
    alignSelf: "center",
  },
  policyList: { gap: 12 },
  topupCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.pastel.blue,
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    gap: 12,
  },
  topupLeft: { flex: 1, gap: 6 },
  newPill: {
    backgroundColor: Colors.charcoal,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  newPillText: { fontSize: 9, fontFamily: "Inter_700Bold", color: Colors.lime, letterSpacing: 1 },
  topupTitle: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.2 },
  topupText: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.charcoalMid, lineHeight: 18 },
  topupIcon: { opacity: 0.5 },
  savingsCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  savingsIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  savingsTitle: { fontSize: 14, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  savingsText: { fontSize: 12, fontFamily: "Inter_400Regular", color: Colors.charcoalMid, lineHeight: 18 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingTop: 14,
    paddingHorizontal: 18,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  footerSummary: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.charcoalMid },
  footerPriceRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  footerTier: { fontSize: 15, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  footerPill: { backgroundColor: Colors.lime, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  footerPrice: { fontSize: 13, fontFamily: "Inter_700Bold", color: Colors.charcoal },
});
