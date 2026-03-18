import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PayoutCard } from "@/components/PayoutCard";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function PayoutsScreen() {
  const { payouts, totalPaidOut, policy, worker } = useApp();
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const totalPremiums = (policy?.weeklyPremium ?? 49) * 4;
  const savingsRatio =
    totalPremiums > 0
      ? Math.round((totalPaidOut / totalPremiums) * 100)
      : 0;

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
        {/* Header */}
        <Text style={styles.title}>Payouts</Text>
        <Text style={styles.subtitle}>Your zero-touch insurance payments</Text>

        {/* Summary Cards */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard} padding={16}>
            <View style={styles.statIcon}>
              <Ionicons name="arrow-down-circle" size={24} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>₹{totalPaidOut}</Text>
            <Text style={styles.statLabel}>Total Received</Text>
          </Card>
          <Card style={styles.statCard} padding={16}>
            <View style={styles.statIcon}>
              <Ionicons name="trending-up" size={24} color={Colors.info} />
            </View>
            <Text style={styles.statValue}>{savingsRatio}%</Text>
            <Text style={styles.statLabel}>ROI on Premium</Text>
          </Card>
        </View>

        {/* Explainable AI section */}
        <Card padding={16} style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI Explanation</Text>
            </View>
          </View>
          <Text style={styles.aiText}>
            "Rain was 32mm in your zone — payout needed 50mm. No payout this
            time. AQI at 228 — payout triggers at 300. You're 72mm rainfall + 72
            AQI away from your next payout."
          </Text>
        </Card>

        {/* Payout History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>

          {payouts.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons
                name="wallet-outline"
                size={48}
                color={Colors.textMuted}
              />
              <Text style={styles.emptyTitle}>No payouts yet</Text>
              <Text style={styles.emptyText}>
                When conditions trigger a payout, it will appear here instantly.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {payouts.map((p) => (
                <PayoutCard key={p.id} payout={p} />
              ))}
            </View>
          )}
        </View>

        {/* How Payouts Work */}
        <Card padding={16} style={styles.howCard}>
          <Text style={styles.howTitle}>How payouts are calculated</Text>
          <View style={styles.howItems}>
            {[
              {
                icon: "time-outline",
                text: "AI estimates earnings you missed during the disruption window",
              },
              {
                icon: "analytics-outline",
                text: "Based on your delivery history, day & time, zone demand",
              },
              {
                icon: "shield-checkmark-outline",
                text: "Payout capped at your policy coverage amount",
              },
              {
                icon: "flash-outline",
                text: "Instant UPI transfer — no claim filing needed",
              },
            ].map((item, i) => (
              <View key={i} style={styles.howItem}>
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={Colors.primary}
                />
                <Text style={styles.howText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
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
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    marginTop: -8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    borderRadius: 16,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    textAlign: "center",
  },
  aiCard: {
    borderRadius: 16,
    backgroundColor: Colors.text,
    gap: 10,
  },
  aiHeader: {
    flexDirection: "row",
  },
  aiBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aiBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  aiText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
    fontStyle: "italic",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  list: {
    gap: 10,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  howCard: {
    borderRadius: 16,
    gap: 14,
  },
  howTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  howItems: {
    gap: 12,
  },
  howItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  howText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
