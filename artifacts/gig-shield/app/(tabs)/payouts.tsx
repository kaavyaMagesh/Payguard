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
  const { payouts, totalPaidOut, policy } = useApp();
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const totalPremiums = (policy?.weeklyPremium ?? 49) * 4;
  const roi = totalPremiums > 0 ? Math.round((totalPaidOut / totalPremiums) * 100) : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 8, paddingBottom: bottomInset + 100 }]}
      >
        {/* Header */}
        <Text style={styles.title}>Payouts</Text>
        <Text style={styles.subtitle}>Zero-touch insurance payments</Text>

        {/* Bento Stats */}
        <View style={styles.bentoGrid}>
          <Card variant="lime" padding={18} radius={28} style={styles.statMain}>
            <Text style={styles.statLabel}>TOTAL RECEIVED</Text>
            <Text style={styles.statBig}>₹{totalPaidOut}</Text>
            <View style={styles.statFooter}>
              <Ionicons name="arrow-down-circle" size={16} color={Colors.charcoal} />
              <Text style={styles.statFooterText}>{payouts.length} payments</Text>
            </View>
          </Card>

          <View style={styles.statSide}>
            <Card variant="dark" padding={16} radius={24} style={styles.statSmall}>
              <Text style={[styles.statLabel, { color: "rgba(200,255,0,0.6)" }]}>ROI</Text>
              <Text style={[styles.statMid, { color: Colors.lime }]}>{roi}%</Text>
            </Card>
            <Card variant="mint" padding={16} radius={24} style={styles.statSmall}>
              <Text style={styles.statLabel}>CLAIMS</Text>
              <Text style={styles.statMid}>{payouts.length}</Text>
            </Card>
          </View>
        </View>

        {/* AI Explanation — dark bento */}
        <Card variant="dark" padding={20} radius={28} style={styles.aiCard}>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={12} color={Colors.charcoal} />
            <Text style={styles.aiBadgeText}>AI EXPLANATION</Text>
          </View>
          <Text style={styles.aiText}>
            "Rain was 32mm in your zone — payout needed 50mm. AQI at 228 — triggers at 300. You're 18mm rain + 72 AQI away from your next automatic payout."
          </Text>
        </Card>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>

          {payouts.length === 0 ? (
            <Card padding={40} radius={28} style={styles.emptyCard}>
              <Ionicons name="wallet-outline" size={48} color={Colors.charcoalMid} />
              <Text style={styles.emptyTitle}>No payouts yet</Text>
              <Text style={styles.emptyText}>
                When conditions trigger, money lands in your UPI account automatically.
              </Text>
            </Card>
          ) : (
            <View style={styles.list}>
              {payouts.map((p) => <PayoutCard key={p.id} payout={p} />)}
            </View>
          )}
        </View>

        {/* How payouts are calculated */}
        <Card variant="mint" padding={20} radius={28} style={styles.howCard}>
          <Text style={styles.howTitle}>How payouts are calculated</Text>
          {[
            { icon: "time-outline", text: "AI estimates earnings missed during disruption window" },
            { icon: "analytics-outline", text: "Based on your delivery history, day, time & zone demand" },
            { icon: "flash-outline", text: "Instant UPI transfer — no claim filing ever" },
          ].map((item, i) => (
            <View key={i} style={styles.howItem}>
              <View style={styles.howIcon}>
                <Ionicons name={item.icon as any} size={16} color={Colors.charcoal} />
              </View>
              <Text style={styles.howText}>{item.text}</Text>
            </View>
          ))}
        </Card>
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
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
    marginTop: -8,
  },
  bentoGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statMain: {
    flex: 1.4,
    gap: 4,
  },
  statSide: {
    flex: 1,
    gap: 10,
  },
  statSmall: {
    flex: 1,
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoalMid,
    letterSpacing: 1,
  },
  statBig: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    lineHeight: 34,
  },
  statMid: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    marginTop: 4,
  },
  statFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  statFooterText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
  },
  aiCard: { gap: 12 },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.lime,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.lime,
  },
  aiBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: 1,
  },
  aiText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    lineHeight: 22,
    fontStyle: "italic",
  },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  list: { gap: 10 },
  emptyCard: { alignItems: "center", gap: 8 },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
    textAlign: "center",
    lineHeight: 20,
  },
  howCard: { gap: 14 },
  howTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  howItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  howIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  howText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoal,
    lineHeight: 20,
  },
});
