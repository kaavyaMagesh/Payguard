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
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function PayoutsScreen() {
  const { payouts, totalPaidOut } = useApp();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 64 : insets.top;

  const totalPossible = payouts.reduce((sum, p) => sum + p.estimatedLostEarnings, 0);
  const coverageRate = totalPossible > 0 ? Math.round((totalPaidOut / totalPossible) * 100) : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: 130 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Earnings History</Text>
          <Text style={styles.subtitle}>Payouts triggered by events in your zone</Text>
        </View>

        {/* stats summary */}
        <View style={styles.statsCard}>
          <View style={styles.statLine}>
            <View>
              <Text style={styles.statLabel}>Total Recovered</Text>
              <Text style={styles.statMain}>₹{totalPaidOut}</Text>
            </View>
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark-done" size={24} color={Colors.lime} />
            </View>
          </View>
          <View style={styles.statFooter}>
            <Text style={styles.statSubText}>{coverageRate}% of lost earnings covered</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${coverageRate}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{payouts.length}</Text>
          </View>
        </View>

        <View style={styles.list}>
          {payouts.length > 0 ? (
            payouts.map((p) => <PayoutCard key={p.id} payout={p} />)
          ) : (
            <View style={styles.empty}>
              <Ionicons name="cash-outline" size={48} color={Colors.charcoalMid} />
              <Text style={styles.emptyText}>No payouts yet</Text>
            </View>
          )}
        </View>

        <View style={styles.footerNote}>
          <Ionicons name="shield-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.footerText}>All payouts are secured by Payguard Trust</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  content: { paddingHorizontal: 18, gap: 20 },
  header: { gap: 4 },
  title: { fontSize: 30, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.6 },
  subtitle: { fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.charcoalMid },
  statsCard: {
    backgroundColor: Colors.charcoal,
    borderRadius: 32,
    padding: 24,
    gap: 20,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  statLine: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.5 },
  statMain: { fontSize: 44, fontFamily: "Inter_700Bold", color: Colors.white, letterSpacing: -1, marginTop: 4 },
  checkBadge: { width: 54, height: 54, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" },
  statFooter: { gap: 8 },
  statSubText: { fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.lime },
  statBar: { height: 6, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 999, overflow: "hidden" },
  statFill: { height: "100%", backgroundColor: Colors.lime, borderRadius: 999 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  sectionTitle: { fontSize: 19, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.4 },
  countBadge: { backgroundColor: "rgba(0,0,0,0.06)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  countText: { fontSize: 12, fontFamily: "Inter_700Bold", color: Colors.charcoalMid },
  list: { gap: 12 },
  empty: { padding: 40, alignItems: "center", justifyContent: "center", gap: 16 },
  emptyText: { fontSize: 16, fontFamily: "Inter_500Medium", color: Colors.textMuted },
  footerNote: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10 },
  footerText: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.textMuted },
});
