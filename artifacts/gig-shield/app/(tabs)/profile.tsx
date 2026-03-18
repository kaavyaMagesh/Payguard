import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RiskScoreRing } from "@/components/RiskScoreRing";
import { StreakBadge } from "@/components/StreakBadge";
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

const MENU_ITEMS = [
  { icon: "notifications-outline", label: "Notifications & Alerts", accent: Colors.trigger.rain },
  { icon: "card-outline", label: "UPI & Payment Settings", accent: Colors.lime },
  { icon: "shield-outline", label: "KYC & Verification", accent: Colors.trigger.aqi },
  { icon: "people-outline", label: "Fleet / Group Plans", accent: Colors.warning },
  { icon: "help-circle-outline", label: "Help & Support", accent: Colors.charcoalMid },
];

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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 8, paddingBottom: bottomInset + 100 }]}
      >
        {/* Profile bento — lime */}
        <Card variant="lime" padding={20} radius={32} style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{worker.avatarInitials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <View style={styles.platformPill}>
                <Text style={styles.platformText}>{PLATFORM_LABELS[worker.platform]}</Text>
              </View>
              <Text style={styles.metaText}>{worker.zone} · {worker.pincode}</Text>
              <Text style={styles.metaText}>Since {joinedDate}</Text>
            </View>
          </View>
          <View style={styles.verifyRow}>
            {[
              { ok: worker.aadhaarVerified, label: "Aadhaar" },
              { ok: worker.selfieVerified, label: "Selfie" },
            ].map((v) => (
              <View key={v.label} style={[styles.verifyPill, { backgroundColor: v.ok ? Colors.charcoal : Colors.danger }]}>
                <Ionicons name={v.ok ? "checkmark" : "close"} size={12} color={v.ok ? Colors.lime : "#fff"} />
                <Text style={[styles.verifyText, { color: v.ok ? Colors.lime : "#fff" }]}>{v.label}</Text>
              </View>
            ))}
            <View style={styles.upiPill}>
              <Ionicons name="card-outline" size={12} color={Colors.charcoal} />
              <Text style={styles.upiText}>{worker.upiId}</Text>
            </View>
          </View>
        </Card>

        {/* Risk & Stats bento grid */}
        <View style={styles.bentoRow}>
          <Card variant="dark" padding={18} radius={28} style={styles.riskCard}>
            <Text style={[styles.miniLabel, { color: "rgba(200,255,0,0.6)" }]}>RISK SCORE</Text>
            <View style={styles.riskCenter}>
              <RiskScoreRing score={worker.riskScore} size={84} />
            </View>
            <Text style={[styles.riskNote, { color: "rgba(255,255,255,0.5)" }]}>Updates weekly</Text>
          </Card>

          <View style={styles.miniCol}>
            <Card variant="mint" padding={14} radius={22} style={styles.miniCard}>
              <Text style={styles.miniLabel}>EARNINGS</Text>
              <Text style={styles.miniValue}>₹{(worker.weeklyEarnings / 1000).toFixed(1)}k</Text>
              <Text style={styles.miniSub}>avg/week</Text>
            </Card>
            <Card variant="lime" padding={14} radius={22} style={styles.miniCard}>
              <Text style={styles.miniLabel}>PAID OUT</Text>
              <Text style={styles.miniValue}>₹{totalPaidOut}</Text>
              <Text style={styles.miniSub}>{payouts.length} claims</Text>
            </Card>
          </View>
        </View>

        {/* Streak */}
        <StreakBadge weeks={worker.streakWeeks} />

        {/* Current Plan */}
        {policy && (
          <Card padding={18} radius={28} onPress={() => router.push("/policy")} style={styles.planCard}>
            <View style={styles.planRow}>
              <View>
                <Text style={styles.miniLabel}>CURRENT PLAN</Text>
                <Text style={styles.planTier}>{policy.tier.charAt(0).toUpperCase() + policy.tier.slice(1)} — ₹{policy.weeklyPremium}/wk</Text>
                <Text style={styles.planExpiry}>
                  Renews {new Date(policy.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </Text>
              </View>
              <Pressable onPress={() => { haptic(); router.push("/policy"); }} style={styles.changePill}>
                <Text style={styles.changePillText}>Change</Text>
                <Ionicons name="arrow-forward" size={12} color={Colors.charcoal} />
              </Pressable>
            </View>
          </Card>
        )}

        {/* Settings Menu */}
        <Card padding={0} radius={28} style={styles.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={haptic}
              style={({ pressed }) => [
                styles.menuItem,
                i < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.accent + "22" }]}>
                <Ionicons name={item.icon as any} size={18} color={item.accent} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <View style={styles.menuArrow}>
                <Ionicons name="chevron-forward" size={14} color={Colors.charcoalMid} />
              </View>
            </Pressable>
          ))}
        </Card>

        {/* Sign Out */}
        <Pressable style={styles.signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
          <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
        </Pressable>
      </ScrollView>
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
  profileCard: { gap: 14 },
  profileTop: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: Colors.charcoal,
    borderWidth: 2.5,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  avatarText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
  },
  profileInfo: { flex: 1, gap: 4 },
  workerName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  platformPill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.charcoal,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
  platformText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
    letterSpacing: 0.3,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
  },
  verifyRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  verifyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
  verifyText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  upiPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
  upiText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoal,
  },
  bentoRow: { flexDirection: "row", gap: 10 },
  riskCard: { flex: 1.1, gap: 8, alignItems: "center" },
  riskCenter: { alignItems: "center" },
  riskNote: { fontSize: 9, fontFamily: "Inter_500Medium", textAlign: "center" },
  miniCol: { flex: 1, gap: 10 },
  miniCard: { flex: 1, gap: 2 },
  miniLabel: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoalMid,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  miniValue: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  miniSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
  },
  planCard: {},
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTier: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    marginTop: 2,
  },
  planExpiry: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
    marginTop: 2,
  },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.lime,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.charcoal,
  },
  changePillText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  menuCard: { overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.charcoal,
    opacity: 0.9,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
  },
  menuArrow: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
  },
  signOutText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.danger,
  },
});
