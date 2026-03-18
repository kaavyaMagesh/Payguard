import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const PLATFORM_LABELS: Record<string, string> = {
  swiggy: "Swiggy",
  zomato: "Zomato",
  zepto: "Zepto",
  blinkit: "Blinkit",
  dunzo: "Dunzo",
};


export default function ProfileScreen() {
  const { worker, policy, totalPaidOut, payouts } = useApp();
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const haptic = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (!worker) return null;

  const joinedDate = new Date(worker.joinedAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const menuItems = [
    { icon: "notifications-outline", label: "Notifications & Alerts", sub: "Rain, AQI, payout alerts" },
    { icon: "card-outline", label: "UPI & Payments", sub: worker.upiId },
    { icon: "shield-checkmark-outline", label: "KYC Verification", sub: "Aadhaar + Selfie verified" },
    { icon: "people-outline", label: "Fleet / Group Plans", sub: "Save up to 20% as a group" },
    { icon: "help-circle-outline", label: "Help & Support", sub: "Chat with us 24/7" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 8, paddingBottom: bottomInset + 120 }]}
      >
        {/* Profile Card */}
        <Card variant="dark" padding={22} radius={32} noBorder style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{worker.avatarInitials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <View style={styles.platformRow}>
                <View style={styles.platformPill}>
                  <Text style={styles.platformText}>{PLATFORM_LABELS[worker.platform]}</Text>
                </View>
                <Text style={styles.joinedText}>Since {joinedDate}</Text>
              </View>
              <Text style={styles.zoneText}>{worker.zone} · {worker.pincode}</Text>
            </View>
          </View>

          <View style={styles.verifyRow}>
            {[
              { ok: worker.aadhaarVerified, label: "Aadhaar" },
              { ok: worker.selfieVerified, label: "Selfie" },
            ].map((v) => (
              <View key={v.label} style={[styles.verifyPill, { backgroundColor: v.ok ? Colors.lime : Colors.danger }]}>
                <Ionicons name={v.ok ? "checkmark" : "close"} size={10} color={v.ok ? Colors.charcoal : "#fff"} />
                <Text style={[styles.verifyText, { color: v.ok ? Colors.charcoal : "#fff" }]}>{v.label}</Text>
              </View>
            ))}
            <View style={styles.upiPill}>
              <Ionicons name="card-outline" size={11} color="rgba(255,255,255,0.6)" />
              <Text style={styles.upiText}>{worker.upiId}</Text>
            </View>
          </View>
        </Card>

        {/* Stats Bento */}
        <View style={styles.bentoGrid}>
          <Card variant="yellow" padding={18} radius={28} noBorder style={styles.bentoCard}>
            <View style={styles.bentoIcon}>
              <Ionicons name="cash-outline" size={16} color="#A07800" />
            </View>
            <Text style={styles.bentoLabel}>TOTAL OUT</Text>
            <Text style={styles.bentoValue}>₹{totalPaidOut}</Text>
            <Text style={styles.bentoSub}>{payouts.length} claims</Text>
          </Card>
          <Card variant="blue" padding={18} radius={28} noBorder style={styles.bentoCard}>
            <View style={styles.bentoIcon}>
              <Ionicons name="shield-outline" size={16} color="#005BAA" />
            </View>
            <Text style={styles.bentoLabel}>RISK SCORE</Text>
            <Text style={styles.bentoValue}>{worker.riskScore}</Text>
            <Text style={styles.bentoSub}>Low risk</Text>
          </Card>
          <Card variant="green" padding={18} radius={28} noBorder style={styles.bentoCard}>
            <View style={styles.bentoIcon}>
              <Ionicons name="flame-outline" size={16} color="#007A45" />
            </View>
            <Text style={styles.bentoLabel}>STREAK</Text>
            <Text style={styles.bentoValue}>{worker.streakWeeks}wk</Text>
            <Text style={styles.bentoSub}>Keep going</Text>
          </Card>
        </View>

        {/* Plan Card */}
        {policy && (
          <Card padding={18} radius={28} noBorder onPress={() => { haptic(); router.push("/policy"); }}>
            <View style={styles.planRow}>
              <View>
                <Text style={styles.planLabel}>CURRENT PLAN</Text>
                <Text style={styles.planTier}>{policy.tier.charAt(0).toUpperCase() + policy.tier.slice(1)} — ₹{policy.weeklyPremium}/wk</Text>
                <Text style={styles.planExpiry}>
                  Renews {new Date(policy.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </Text>
              </View>
              <Pressable
                onPress={() => { haptic(); router.push("/policy"); }}
                style={styles.changePill}
              >
                <Text style={styles.changePillText}>Change</Text>
                <View style={styles.changeIcon}>
                  <Ionicons name="arrow-forward" size={12} color={Colors.charcoal} />
                </View>
              </Pressable>
            </View>
          </Card>
        )}

        {/* Settings Menu */}
        <Card padding={0} radius={28} noBorder style={styles.menuCard}>
          {menuItems.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={haptic}
              style={({ pressed }) => [
                styles.menuItem,
                i < menuItems.length - 1 && styles.menuItemBorder,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={styles.menuIconBox}>
                <Ionicons name={item.icon as any} size={17} color={Colors.charcoalMid} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub} numberOfLines={1}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color={Colors.charcoalMid} />
            </Pressable>
          ))}
        </Card>

        {/* Sign Out */}
        <Pressable style={styles.signOut}>
          <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flexGrow: 1, paddingHorizontal: 18, gap: 16 },
  profileCard: { gap: 16 },
  profileTop: { flexDirection: "row", gap: 14, alignItems: "center" },
  avatarBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  profileInfo: { flex: 1, gap: 4 },
  workerName: { fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.white, letterSpacing: -0.3 },
  platformRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  platformPill: {
    backgroundColor: Colors.lime,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  platformText: { fontSize: 10, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: 0.2 },
  joinedText: { fontSize: 11, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.45)" },
  zoneText: { fontSize: 12, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.45)" },
  verifyRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  verifyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  verifyText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  upiPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  upiText: { fontSize: 10, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.6)" },
  bentoGrid: { flexDirection: "row", gap: 10 },
  bentoCard: { flex: 1, gap: 3, position: "relative" },
  bentoIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  bentoLabel: { fontSize: 9, fontFamily: "Inter_700Bold", color: Colors.charcoalMid, letterSpacing: 0.8 },
  bentoValue: { fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.4 },
  bentoSub: { fontSize: 10, fontFamily: "Inter_400Regular", color: Colors.charcoalMid },
  planRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  planLabel: { fontSize: 9, fontFamily: "Inter_700Bold", color: Colors.charcoalMid, letterSpacing: 0.8, marginBottom: 3 },
  planTier: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.2 },
  planExpiry: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.charcoalMid, marginTop: 2 },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.charcoal,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 8,
    borderRadius: 999,
  },
  changePillText: { fontSize: 13, fontFamily: "Inter_700Bold", color: Colors.white },
  changeIcon: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  menuCard: { overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.06)" },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  menuContent: { flex: 1, gap: 1 },
  menuLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.charcoal },
  menuSub: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textMuted },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  signOutText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.danger },
});
