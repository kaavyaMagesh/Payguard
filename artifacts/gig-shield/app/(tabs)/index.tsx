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
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TriggerMeter } from "@/components/TriggerMeter";
import { StreakBadge } from "@/components/StreakBadge";
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
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshWeather} tintColor={Colors.charcoal} />
        }
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topInset + 8, paddingBottom: bottomInset + 120 },
        ]}
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

        {/* Policy Hero Card */}
        <Card variant="dark" padding={22} radius={32} noBorder style={styles.heroCard} onPress={() => router.push("/policy")}>
          <View style={styles.heroTop}>
            <View>
              <View style={styles.planPill}>
                <View style={styles.planDot} />
                <Text style={styles.planPillText}>{tierLabel} Plan · Active</Text>
              </View>
              <Text style={styles.heroAmount}>₹{policy.coverageAmount.toLocaleString("en-IN")}</Text>
              <Text style={styles.heroCoveredLabel}>insured this week</Text>
            </View>
            <View style={styles.heroRight}>
              <Text style={styles.heroPremium}>₹{policy.weeklyPremium}</Text>
              <Text style={styles.heroPremiumLabel}>/week</Text>
            </View>
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroFooterText}>Tap to manage plan</Text>
            <View style={styles.heroArrow}>
              <Ionicons name="arrow-forward" size={14} color={Colors.charcoal} />
            </View>
          </View>
        </Card>

        {/* Alert */}
        <AlertBanner
          type="warning"
          message="Heavy rain at 4 PM — monitor triggers"
          subtitle="You're 18mm away from a ₹300 payout. AQI elevated."
        />

        {/* Popular / Bento Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Overview</Text>

          <View style={styles.bentoGrid}>
            {/* Row 1 */}
            <Card variant="yellow" padding={18} radius={28} noBorder style={styles.bentoCard}>
              <View style={styles.bentoIconTopRight}>
                <Ionicons name="cash-outline" size={18} color="#A07800" />
              </View>
              <Text style={styles.bentoLabel}>Total Paid Out</Text>
              <Text style={styles.bentoValue}>₹{totalPaidOut}</Text>
              <Text style={styles.bentoSub}>{payouts.length} claims</Text>
            </Card>

            <Card variant="blue" padding={18} radius={28} noBorder style={styles.bentoCard}>
              <View style={styles.bentoIconTopRight}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#005BAA" />
              </View>
              <Text style={styles.bentoLabel}>Risk Score</Text>
              <Text style={styles.bentoValue}>{worker.riskScore}</Text>
              <Text style={styles.bentoSub}>Low risk</Text>
            </Card>

            {/* Row 2 */}
            <Card variant="green" padding={18} radius={28} noBorder style={styles.bentoCard}>
              <View style={styles.bentoIconTopRight}>
                <Ionicons name="flame-outline" size={18} color="#007A45" />
              </View>
              <Text style={styles.bentoLabel}>Streak</Text>
              <Text style={styles.bentoValue}>{worker.streakWeeks}wk</Text>
              <Text style={styles.bentoSub}>2 more = discount</Text>
            </Card>

            <Card variant="peach" padding={18} radius={28} noBorder style={styles.bentoCard}>
              <View style={styles.bentoIconTopRight}>
                <Ionicons name="wallet-outline" size={18} color="#C04400" />
              </View>
              <Text style={styles.bentoLabel}>Weekly Earnings</Text>
              <Text style={styles.bentoValue}>₹{(worker.weeklyEarnings / 1000).toFixed(1)}k</Text>
              <Text style={styles.bentoSub}>avg estimate</Text>
            </Card>
          </View>
        </View>

        {/* Live Triggers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Triggers</Text>
            <Pressable onPress={() => router.push("/(tabs)/triggers")} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={12} color={Colors.charcoalMid} />
            </Pressable>
          </View>
          <Card padding={20} radius={32} noBorder>
            <View style={styles.triggersInner}>
              {weather && (
                <>
                  <TriggerMeter type="rain" value={weather.rainfall} threshold={weather.rainfallMax} unit="mm" label="Rainfall" />
                  <View style={styles.divider} />
                  <TriggerMeter type="aqi" value={weather.aqi} threshold={weather.aqiMax} unit="" label="AQI" />
                  <View style={styles.divider} />
                  <TriggerMeter type="heat" value={weather.temperature} threshold={weather.tempMax} unit="°C" label="Temperature" />
                </>
              )}
            </View>
          </Card>
        </View>

        {/* Streak Badge */}
        <StreakBadge weeks={worker.streakWeeks} />

        {/* Recent Payouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Payouts</Text>
            <Pressable onPress={() => router.push("/(tabs)/payouts")} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="arrow-forward" size={12} color={Colors.charcoalMid} />
            </Pressable>
          </View>
          {payouts.slice(0, 2).map((p) => (
            <Card key={p.id} padding={14} radius={24} noBorder style={styles.payoutRow}>
              <View style={styles.payoutIconBox}>
                <Ionicons
                  name={p.triggerType === "rain" ? "rainy" : p.triggerType === "aqi" ? "cloudy" : "thermometer"}
                  size={18}
                  color={Colors.charcoal}
                />
              </View>
              <View style={styles.payoutContent}>
                <Text style={styles.payoutReason} numberOfLines={1}>{p.reason}</Text>
                <Text style={styles.payoutDate}>
                  {new Date(p.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </Text>
              </View>
              <View style={styles.amountPill}>
                <Text style={styles.payoutAmount}>+₹{p.amount}</Text>
              </View>
            </Card>
          ))}
        </View>

        {/* AI Chat CTA */}
        <Button
          label="Ask AI about my policy"
          onPress={() => router.push("/(tabs)/chat")}
          variant="primary"
          trailingIcon="sparkles"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    gap: 18,
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
    letterSpacing: -0.6,
    lineHeight: 34,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  heroCard: {
    gap: 16,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  planPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  planDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.lime,
  },
  planPillText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
    letterSpacing: 0.2,
  },
  heroAmount: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
    letterSpacing: -1,
    lineHeight: 44,
  },
  heroCoveredLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.55)",
    marginTop: 2,
  },
  heroRight: { alignItems: "flex-end", paddingTop: 8 },
  heroPremium: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: Colors.lime,
    letterSpacing: -0.5,
  },
  heroPremiumLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.45)",
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 14,
  },
  heroFooterText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.55)",
  },
  heroArrow: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: -0.4,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.07)",
  },
  seeAllText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoalMid,
  },
  bentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  bentoCard: {
    width: "48%",
    minHeight: 120,
    gap: 4,
    position: "relative",
  },
  bentoIconTopRight: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  bentoLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoalMid,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 8,
  },
  bentoValue: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  bentoSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoalMid,
  },
  triggersInner: { gap: 16 },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  payoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  payoutIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: Colors.pastel.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  payoutContent: { flex: 1, gap: 2 },
  payoutReason: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
  },
  payoutDate: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  amountPill: {
    backgroundColor: Colors.lime,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  payoutAmount: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
});
