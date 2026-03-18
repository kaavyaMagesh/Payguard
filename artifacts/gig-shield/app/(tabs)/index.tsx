import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
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
  const { worker, policy, weather, triggers, payouts, refreshWeather, totalPaidOut } = useApp();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  if (!worker || !policy) {
    return (
      <View style={[styles.container, { paddingTop: topInset }]}>
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  const tierColors: Record<string, string> = {
    basic: Colors.tier.basic.badge,
    standard: Colors.tier.standard.badge,
    premium: Colors.tier.premium.badge,
  };
  const tierBg: Record<string, string> = {
    basic: Colors.tier.basic.bg,
    standard: Colors.tier.standard.bg,
    premium: Colors.tier.premium.bg,
  };
  const policyColor = tierColors[policy.tier];
  const policyBg = tierBg[policy.tier];

  return (
    <View style={styles.container}>
      {/* Sticky blur header */}
      <Animated.View
        style={[styles.stickyHeader, { opacity: headerOpacity, paddingTop: topInset }]}
      >
        <Text style={styles.stickyTitle}>GigShield</Text>
      </Animated.View>

      <Animated.ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refreshWeather}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomInset + 100 }]}
      >
        {/* Hero Header */}
        <View style={[styles.hero, { paddingTop: topInset + 8 }]}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.workerName}>{worker.name.split(" ")[0]}</Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/profile")}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{worker.avatarInitials}</Text>
              </View>
            </Pressable>
          </View>

          {/* Policy Summary */}
          <Pressable onPress={() => router.push("/policy")} style={[styles.policyBanner, { backgroundColor: policyColor }]}>
            <View>
              <Text style={styles.policyTierLabel}>
                {policy.tier.charAt(0).toUpperCase() + policy.tier.slice(1)} Plan
              </Text>
              <Text style={styles.policyAmount}>
                ₹{policy.coverageAmount.toLocaleString("en-IN")} covered
              </Text>
            </View>
            <View style={styles.policyRight}>
              <Text style={styles.policyPremium}>₹{policy.weeklyPremium}/wk</Text>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.body}>
          {/* Alert */}
          <AlertBanner
            type="warning"
            message="Heavy rain expected at 4 PM in your zone"
            subtitle="Consider finishing deliveries early today. AQI is also elevated."
          />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <Card style={styles.statCard} padding={14}>
              <Ionicons name="cash-outline" size={22} color={Colors.success} />
              <Text style={styles.statValue}>₹{totalPaidOut}</Text>
              <Text style={styles.statLabel}>Total Paid Out</Text>
            </Card>
            <Card style={styles.statCard} padding={14}>
              <Ionicons name="shield-checkmark" size={22} color={Colors.primary} />
              <Text style={styles.statValue}>{payouts.length}</Text>
              <Text style={styles.statLabel}>Claims Paid</Text>
            </Card>
            <Card style={styles.statCard} padding={14}>
              <Ionicons name="flame" size={22} color={Colors.warning} />
              <Text style={styles.statValue}>{worker.streakWeeks}wk</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </Card>
          </View>

          {/* Live Triggers */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live Triggers</Text>
              <Pressable onPress={() => router.push("/(tabs)/triggers")}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>

            <Card padding={16}>
              <View style={styles.triggersInner}>
                {weather && (
                  <>
                    <TriggerMeter
                      type="rain"
                      value={weather.rainfall}
                      threshold={weather.rainfallMax}
                      unit="mm"
                      label="Rainfall"
                    />
                    <View style={styles.divider} />
                    <TriggerMeter
                      type="aqi"
                      value={weather.aqi}
                      threshold={weather.aqiMax}
                      unit=""
                      label="AQI"
                    />
                    <View style={styles.divider} />
                    <TriggerMeter
                      type="heat"
                      value={weather.temperature}
                      threshold={weather.tempMax}
                      unit="°C"
                      label="Temperature"
                    />
                  </>
                )}
              </View>
            </Card>
          </View>

          {/* Streak */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Streak</Text>
            <StreakBadge weeks={worker.streakWeeks} />
          </View>

          {/* Recent Payouts */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Payouts</Text>
              <Pressable onPress={() => router.push("/(tabs)/payouts")}>
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>

            {payouts.slice(0, 2).map((p) => (
              <Card key={p.id} padding={14} style={styles.payoutItem}>
                <View style={styles.payoutRow}>
                  <Ionicons
                    name={
                      p.triggerType === "rain"
                        ? "rainy"
                        : p.triggerType === "aqi"
                          ? "cloudy"
                          : "thermometer"
                    }
                    size={20}
                    color={Colors.primary}
                  />
                  <View style={styles.payoutContent}>
                    <Text style={styles.payoutReason} numberOfLines={1}>
                      {p.reason}
                    </Text>
                    <Text style={styles.payoutDate}>
                      {new Date(p.timestamp).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                  </View>
                  <Text style={styles.payoutAmount}>+₹{p.amount}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </Animated.ScrollView>
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
    marginTop: 100,
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: Colors.surface + "F0",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stickyTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
    paddingTop: 12,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    backgroundColor: Colors.text,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.6)",
  },
  workerName: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  policyBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  policyTierLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  policyAmount: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#fff",
    marginTop: 2,
  },
  policyRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  policyPremium: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  activeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  body: {
    padding: 20,
    gap: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    borderRadius: 14,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    textAlign: "center",
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.primary,
  },
  triggersInner: {
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  payoutItem: {
    borderRadius: 14,
  },
  payoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  payoutContent: {
    flex: 1,
    gap: 2,
  },
  payoutReason: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
  },
  payoutDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  payoutAmount: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.success,
  },
});
