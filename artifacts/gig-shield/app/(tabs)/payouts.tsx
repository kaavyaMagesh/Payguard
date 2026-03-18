import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
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
    <LinearGradient
      colors={[Colors.mint, Colors.white]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.55 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 8, paddingBottom: bottomInset + 120 }]}
      >
        <Text style={styles.title}>Payouts</Text>
        <Text style={styles.subtitle}>Automatic UPI transfers, no claims needed</Text>

        {/* Bento Stats */}
        <View style={styles.bentoGrid}>
          <Card variant="dark" padding={20} radius={28} noBorder style={styles.statMain}>
            <Text style={styles.statSub}>TOTAL RECEIVED</Text>
            <Text style={styles.statBig}>₹{totalPaidOut}</Text>
            <View style={styles.statFooter}>
              <View style={styles.statBadge}>
                <Ionicons name="arrow-down" size={12} color={Colors.charcoal} />
                <Text style={styles.statBadgeText}>{payouts.length} payments</Text>
              </View>
            </View>
          </Card>

          <View style={styles.statCol}>
            <Card variant="blue" padding={16} radius={24} noBorder style={styles.statSmall}>
              <Text style={styles.statSubDark}>ROI</Text>
              <Text style={styles.statMidDark}>{roi}%</Text>
            </Card>
            <Card variant="yellow" padding={16} radius={24} noBorder style={styles.statSmall}>
              <Text style={styles.statSub}>CLAIMS</Text>
              <Text style={styles.statMid}>{payouts.length}</Text>
            </Card>
          </View>
        </View>

        {/* AI Explanation */}
        <Card variant="dark" padding={20} radius={32} noBorder>
          <View style={styles.aiBadge}>
            <Ionicons name="sparkles" size={12} color={Colors.charcoal} />
            <Text style={styles.aiBadgeText}>AI INSIGHT</Text>
          </View>
          <Text style={styles.aiText}>
            "Rain was 32mm — payout needs 50mm. AQI at 228 vs threshold 300. You're 18mm of rain and 72 AQI points away from your next automatic payout."
          </Text>
        </Card>

        {/* How payouts work — pastel tiles */}
        <View style={styles.howGrid}>
          {[
            { bg: "blue" as const, icon: "analytics-outline", text: "AI estimates earnings missed during disruption", color: "#005BAA" },
            { bg: "peach" as const, icon: "flash-outline", text: "Instant UPI transfer, no claim filing ever", color: "#C04400" },
          ].map((item, i) => (
            <Card key={i} variant={item.bg} padding={18} radius={24} noBorder style={styles.howTile}>
              <View style={styles.howIcon}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={styles.howText}>{item.text}</Text>
            </Card>
          ))}
        </View>

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>

          {payouts.length === 0 ? (
            <Card padding={40} radius={32} noBorder style={styles.emptyCard}>
              <Ionicons name="wallet-outline" size={44} color={Colors.charcoalMid} />
              <Text style={styles.emptyTitle}>No payouts yet</Text>
              <Text style={styles.emptyText}>Money lands in your UPI account automatically when conditions trigger.</Text>
            </Card>
          ) : (
            <View style={styles.list}>
              {payouts.map((p) => <PayoutCard key={p.id} payout={p} />)}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 18, gap: 16 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.charcoalMid, marginTop: -10 },
  bentoGrid: { flexDirection: "row", gap: 10 },
  statMain: { flex: 1.4, gap: 6 },
  statCol: { flex: 1, gap: 10 },
  statSmall: { flex: 1, justifyContent: "center" },
  statSub: { fontSize: 9, fontFamily: "Inter_700Bold", color: "rgba(200,255,0,0.55)", letterSpacing: 1 },
  statSubDark: { fontSize: 9, fontFamily: "Inter_700Bold", color: Colors.charcoalMid, letterSpacing: 1 },
  statBig: { fontSize: 30, fontFamily: "Inter_700Bold", color: Colors.white, letterSpacing: -0.5 },
  statMid: { fontSize: 24, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.4, marginTop: 4 },
  statMidDark: { fontSize: 24, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.4, marginTop: 4 },
  statFooter: { flexDirection: "row", marginTop: 4 },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.lime,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.charcoal },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.lime,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  aiBadgeText: { fontSize: 9, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: 1 },
  aiText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 22,
    fontStyle: "italic",
  },
  howGrid: { flexDirection: "row", gap: 10 },
  howTile: { flex: 1, gap: 10 },
  howIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  howText: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.charcoal, lineHeight: 18 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.3 },
  list: { gap: 10 },
  emptyCard: { alignItems: "center", gap: 10 },
  emptyTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular", color: Colors.charcoalMid, textAlign: "center", lineHeight: 20 },
});
