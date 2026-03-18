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

export default function ProfileScreen() {
  const { worker, policy, totalPaidOut, payouts } = useApp();
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleMenuItem = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  if (!worker) {
    return (
      <View style={[styles.container, { paddingTop: topInset + 20 }]}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const joinedDate = new Date(worker.joinedAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: topInset + 12,
            paddingBottom: bottomInset + 100,
          },
        ]}
      >
        {/* Profile Hero */}
        <Card padding={20} style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarTextLarge}>{worker.avatarInitials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <View style={styles.platformRow}>
                <View style={styles.platformBadge}>
                  <Text style={styles.platformText}>
                    {PLATFORM_LABELS[worker.platform] ?? worker.platform}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.detailText}>{worker.zone} · {worker.pincode}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.detailText}>Since {joinedDate}</Text>
              </View>
            </View>
          </View>

          {/* Verification */}
          <View style={styles.verifyRow}>
            <View style={styles.verifyItem}>
              <Ionicons
                name={worker.aadhaarVerified ? "checkmark-circle" : "close-circle"}
                size={16}
                color={worker.aadhaarVerified ? Colors.success : Colors.danger}
              />
              <Text style={styles.verifyText}>Aadhaar KYC</Text>
            </View>
            <View style={styles.verifyItem}>
              <Ionicons
                name={worker.selfieVerified ? "checkmark-circle" : "close-circle"}
                size={16}
                color={worker.selfieVerified ? Colors.success : Colors.danger}
              />
              <Text style={styles.verifyText}>Selfie Verified</Text>
            </View>
            <View style={styles.verifyItem}>
              <Ionicons name="card-outline" size={16} color={Colors.info} />
              <Text style={styles.verifyText}>{worker.upiId}</Text>
            </View>
          </View>
        </Card>

        {/* Risk Score & Stats */}
        <View style={styles.riskRow}>
          <Card style={styles.riskCard} padding={16}>
            <Text style={styles.riskTitle}>AI Risk Score</Text>
            <View style={styles.riskCenter}>
              <RiskScoreRing score={worker.riskScore} size={90} />
            </View>
            <Text style={styles.riskNote}>
              Updates weekly based on zone, platform & weather history
            </Text>
          </Card>

          <View style={styles.miniStats}>
            <Card style={styles.miniStatCard} padding={14}>
              <Ionicons name="trending-up" size={20} color={Colors.success} />
              <Text style={styles.miniStatValue}>₹{worker.weeklyEarnings.toLocaleString("en-IN")}</Text>
              <Text style={styles.miniStatLabel}>Avg Weekly Earnings</Text>
            </Card>
            <Card style={styles.miniStatCard} padding={14}>
              <Ionicons name="cash-outline" size={20} color={Colors.info} />
              <Text style={styles.miniStatValue}>₹{totalPaidOut}</Text>
              <Text style={styles.miniStatLabel}>Total Received</Text>
            </Card>
            <Card style={styles.miniStatCard} padding={14}>
              <Ionicons name="document-text-outline" size={20} color={Colors.warning} />
              <Text style={styles.miniStatValue}>{payouts.length}</Text>
              <Text style={styles.miniStatLabel}>Payouts</Text>
            </Card>
          </View>
        </View>

        {/* Streak */}
        <StreakBadge weeks={worker.streakWeeks} />

        {/* Current Policy */}
        {policy && (
          <Card padding={16} style={styles.policyCard} onPress={() => router.push("/policy")}>
            <View style={styles.policyRow}>
              <View>
                <Text style={styles.policyLabel}>Current Plan</Text>
                <Text style={styles.policyTier}>
                  {policy.tier.charAt(0).toUpperCase() + policy.tier.slice(1)} — ₹{policy.weeklyPremium}/week
                </Text>
                <Text style={styles.policyExpiry}>
                  Renews {new Date(policy.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </Text>
              </View>
              <View style={styles.policyActions}>
                <Pressable
                  onPress={() => {
                    handleMenuItem();
                    router.push("/policy");
                  }}
                  style={styles.changePlanBtn}
                >
                  <Text style={styles.changePlanText}>Change Plan</Text>
                </Pressable>
              </View>
            </View>
          </Card>
        )}

        {/* Settings Menu */}
        <Card padding={0} style={styles.menuCard}>
          {[
            { icon: "notifications-outline", label: "Notifications & Alerts", color: Colors.info },
            { icon: "card-outline", label: "UPI & Payment Settings", color: Colors.success },
            { icon: "shield-outline", label: "KYC & Verification", color: Colors.primary },
            { icon: "people-outline", label: "Fleet / Group Plans", color: Colors.warning },
            { icon: "help-circle-outline", label: "Help & Support", color: Colors.textSecondary },
            { icon: "information-circle-outline", label: "About GigShield", color: Colors.textMuted },
          ].map((item, i, arr) => (
            <Pressable
              key={item.label}
              onPress={handleMenuItem}
              style={({ pressed }) => [
                styles.menuItem,
                i < arr.length - 1 && styles.menuItemBorder,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <View style={[styles.menuIconBox, { backgroundColor: item.color + "18" }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </Pressable>
          ))}
        </Card>

        {/* Sign out */}
        <Pressable style={styles.signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loading: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  profileCard: {
    borderRadius: 16,
    gap: 16,
  },
  profileTop: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTextLarge: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  workerName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  platformRow: {
    flexDirection: "row",
  },
  platformBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  platformText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primaryDark,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  verifyRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  verifyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  verifyText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
  },
  riskRow: {
    flexDirection: "row",
    gap: 12,
  },
  riskCard: {
    flex: 1,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  riskTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
    alignSelf: "flex-start",
  },
  riskCenter: {
    alignItems: "center",
  },
  riskNote: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 14,
  },
  miniStats: {
    flex: 1,
    gap: 8,
  },
  miniStatCard: {
    flex: 1,
    borderRadius: 12,
    gap: 2,
  },
  miniStatValue: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  miniStatLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    lineHeight: 14,
  },
  policyCard: {
    borderRadius: 16,
  },
  policyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  policyLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  policyTier: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
    marginTop: 2,
  },
  policyExpiry: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  policyActions: {
    justifyContent: "center",
  },
  changePlanBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  changePlanText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primaryDark,
  },
  menuCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
  },
  signOut: {
    alignItems: "center",
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    color: Colors.danger,
  },
});
