import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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
  const [selectedTier, setSelectedTier] = useState<PolicyTier>(
    policy?.tier ?? "standard"
  );
  const [saving, setSaving] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSave = async () => {
    setSaving(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topInset + 12, paddingBottom: bottomInset + 120 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </Pressable>
          <View>
            <Text style={styles.title}>Choose Plan</Text>
            <Text style={styles.subtitle}>Auto-renews every week via UPI</Text>
          </View>
        </View>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Parametric insurance — no claim filing. Payouts are automatic when
            conditions trigger.
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

        {/* Micro Top-up info */}
        <View style={styles.topupCard}>
          <View style={styles.topupHeader}>
            <View style={styles.topupBadge}>
              <Text style={styles.topupBadgeText}>New</Text>
            </View>
            <Text style={styles.topupTitle}>Micro Top-Ups</Text>
          </View>
          <Text style={styles.topupText}>
            On days with extreme weather forecasted (cyclone, red alert rain),
            buy extra single-day coverage for ₹5–10 until 6 AM.
          </Text>
        </View>

        {/* Savings Pool */}
        <View style={styles.savingsCard}>
          <Ionicons name="wallet-outline" size={20} color={Colors.info} />
          <View style={styles.savingsText}>
            <Text style={styles.savingsTitle}>Annual Savings Pool</Text>
            <Text style={styles.savingsDesc}>
              Unclaimed premiums are pooled. At year end, enrolled workers get
              cashback proportional to their streak.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View
        style={[
          styles.footer,
          { paddingBottom: bottomInset + 16 },
        ]}
      >
        <View style={styles.footerInfo}>
          <Text style={styles.footerLabel}>Selected:</Text>
          <Text style={styles.footerTier}>
            {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
          </Text>
          <Text style={styles.footerPrice}>
            ₹{tiers.find((t) => t.tier === selectedTier)?.weeklyPremium}/week
          </Text>
        </View>
        <Button
          label={saving ? "Saving..." : "Activate Plan"}
          onPress={handleSave}
          loading={saving}
          style={styles.activateBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
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
    borderRadius: 12,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.primaryDark,
    lineHeight: 20,
  },
  policyList: {
    gap: 12,
  },
  topupCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.warning + "40",
    gap: 8,
  },
  topupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  topupBadge: {
    backgroundColor: Colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  topupBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  topupTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  topupText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  savingsCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 14,
    padding: 16,
  },
  savingsText: {
    flex: 1,
    gap: 4,
  },
  savingsTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.info,
  },
  savingsDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "#1565C0",
    lineHeight: 19,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  footerTier: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  footerPrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.primary,
    marginLeft: 4,
  },
  activateBtn: {
    borderRadius: 14,
  },
});
