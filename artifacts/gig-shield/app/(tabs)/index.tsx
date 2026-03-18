import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertBanner } from "@/components/AlertBanner";
import { StreakBadge } from "@/components/StreakBadge";
import { TriggerMeter } from "@/components/TriggerMeter";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function HomeScreen() {
  const { worker, policy, weather, payouts, refreshWeather, totalPaidOut } = useApp();
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  if (!worker || !policy) return null;

  const tierLabel = policy.tier.charAt(0).toUpperCase() + policy.tier.slice(1);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={false} onRefresh={refreshWeather} tintColor={Colors.charcoal} />}
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 8, paddingBottom: bottomInset + 100 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>{worker.name.split(" ")[0]}</Text>
          </View>
          <Pressable onPress={() => router.push("/(tabs)/profile")}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{worker.avatarInitials}</Text>
            </View>
          </Pressable>
        </View>

        {/* Policy Hero — bento card */}
        <Pressable onPress={() => router.push("/policy")} style={styles.heroBento}>
          <View style={styles.heroBentoTop}>
            <View>
              <View style={styles.planPill}>
                <Text style={styles.planPillText}>{tierLabel} Plan</Text>
              </View>
              <Text style={styles.heroAmount}>₹{policy.coverageAmount.toLocaleString("en-IN")}</Text>
              <Text style={styles.heroCoveredLabel}>covered this week</Text>
            </View>
            <View style={styles.heroRight}>
              <View style={styles.activePill}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>LIVE</Text>
              </View>
              <Text style={styles.heroPremium}>₹{policy.weeklyPremium}</Text>
              <Text style={styles.heroPremiumLabel}>per week</Text>
            </View>
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterText}>Tap to change plan</Text>
            <Ionicons name="arrow-forward-circle" size={20} color={Colors.charcoal} />
          </View>
        </Pressable>

        {/* Bento Grid — Stats */}
        <View style={styles.bentoRow}>
          <Card variant="lime" style={styles.bentoStat} padding={16} radius={28}>
            <Ionicons name="cash-outline" size={22} color={Colors.charcoal} />
            <Text style={styles.bentoStatValue}>₹{totalPaidOut}</Text>
            <Text style={styles.bentoStatLabel}>Total Paid Out</Text>
          </Card>
          <Card variant="dark" style={styles.bentoStat} padding={16} radius={28}>
            <Ionicons name="shield-checkmark" size={22} color={Colors.lime} />
            <Text style={[styles.bentoStatValue, { color: Colors.lime }]}>{payouts.length}</Text>
            <Text style={[styles.bentoStatLabel, { color: "rgba(200,255,0,0.6)" }]}>Claims Paid</Text>
          </Card>
          <Card variant="mint" style={styles.bentoStat} padding={16} radius={28}>
            <Ionicons name="flame" size={22} color={Colors.charcoal} />
            <Text style={styles.bentoStatValue}>{worker.streakWeeks}wk</Text>
            <Text style={styles.bentoStatLabel}>Streak</Text>
          </Card>
        </View>

        {/* Alert */}
        <AlertBanner
          type="warning"
          message="Heavy rain expected at 4 PM in your zone"
          subtitle="Consider finishing deliveries early. AQI is also elevated."
        />

        {/* Live Triggers bento */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Triggers</Text>
            <Pressable onPress={() => router.push("/(tabs)/triggers")} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.charcoal} />
            </Pressable>
          </View>
          <Card padding={20} radius={28}>
            <View style={styles.triggersInner}>
              {weather && (
                <>
                  <TriggerMeter type="rain" value={weather.rainfall} threshold={weather.rainfallMax} unit="mm" label="Rainfall" />
                  <View style={styles.divider} />
                  <TriggerMeter type="aqi" value={weather.aqi} threshold={weather.aqiMax} unit="" label="AQI" />
                  <View style={styles.divider} />
                  <TriggerMeter type="heat" value={weather.temperature} threshold={weather.tempMax} unit="°C" label="Temp" />
                </>
              )}
            </View>
          </Card>
        </View>

        {/* Streak */}
        <StreakBadge weeks={worker.streakWeeks} />

        {/* Recent Payouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Payouts</Text>
            <Pressable onPress={() => router.push("/(tabs)/payouts")} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.charcoal} />
            </Pressable>
          </View>

          {payouts.slice(0, 2).map((p) => (
            <View key={p.id} style={styles.payoutRow}>
              <View style={styles.payoutIconBox}>
                <Ionicons
                  name={p.triggerType === "rain" ? "rainy" : p.triggerType === "aqi" ? "cloudy" : "thermometer"}
                  size={20}
                  color={Colors.charcoal}
                />
              </View>
              <View style={styles.payoutContent}>
                <Text style={styles.payoutReason} numberOfLines={1}>{p.reason}</Text>
                <Text style={styles.payoutDate}>
                  {new Date(p.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </Text>
              </View>
              <View style={styles.payoutAmountBox}>
                <Text style={styles.payoutAmount}>+₹{p.amount}</Text>
              </View>
            </View>
          ))}
        </View>
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
    paddingHorizontal: 18,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
  },
  name: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    lineHeight: 34,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    borderWidth: 2,
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
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  heroBento: {
    backgroundColor: Colors.lime,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    padding: 20,
    gap: 16,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
  },
  heroBentoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planPill: {
    backgroundColor: Colors.charcoal,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  planPillText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  heroAmount: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    lineHeight: 42,
  },
  heroCoveredLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
    marginTop: 2,
  },
  heroRight: { alignItems: "flex-end", gap: 4 },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.charcoal,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lime,
  },
  activeText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
    letterSpacing: 1,
  },
  heroPremium: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  heroPremiumLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1.5,
    borderTopColor: "rgba(26,26,26,0.15)",
    paddingTop: 12,
  },
  heroFooterText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
  },
  bentoRow: {
    flexDirection: "row",
    gap: 10,
  },
  bentoStat: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  bentoStatValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  bentoStatLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoalMid,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.charcoal,
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  triggersInner: { gap: 14 },
  divider: {
    height: 1.5,
    backgroundColor: Colors.border,
    opacity: 0.1,
  },
  payoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  payoutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.mint,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  payoutContent: { flex: 1, gap: 3 },
  payoutReason: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  payoutDate: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  payoutAmountBox: {
    backgroundColor: Colors.lime,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
  payoutAmount: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
});
