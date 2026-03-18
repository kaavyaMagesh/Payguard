import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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
import { TriggerMeter } from "@/components/TriggerMeter";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const TRIGGER_DEFS = [
  { type: "aqi" as const, threshold: 300, unit: "", label: "Air Quality Index", icon: "cloudy-outline" as const, desc: "AQI 300+ → severe pollution payout" },
  { type: "rain" as const, threshold: 50, unit: "mm", label: "Rainfall", icon: "rainy-outline" as const, desc: "50mm rain in 3 hours → heavy rain payout" },
  { type: "heat" as const, threshold: 45, unit: "°C", label: "Temperature", icon: "thermometer-outline" as const, desc: "45°C+ → extreme heat payout" },
  { type: "curfew" as const, threshold: 1, unit: "", label: "Curfew / Strike", icon: "warning-outline" as const, desc: "Govt-declared curfew or bandh" },
  { type: "flood" as const, threshold: 1, unit: "", label: "Flood Alert", icon: "water-outline" as const, desc: "Flood alert for your pincode" },
];

export default function TriggersScreen() {
  const { weather, worker, refreshWeather } = useApp();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const handleRefresh = () => {
    setRefreshing(true);
    refreshWeather();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const currentValues: Record<string, number> = {
    aqi: weather?.aqi ?? 0,
    rain: weather?.rainfall ?? 0,
    heat: weather?.temperature ?? 0,
    curfew: 0,
    flood: 0,
  };

  const lastUpdated = weather
    ? new Date(weather.lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "--";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.charcoal} />}
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 8, paddingBottom: bottomInset + 100 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Live Triggers</Text>
            <View style={styles.zoneRow}>
              <Ionicons name="location" size={12} color={Colors.charcoalMid} />
              <Text style={styles.zone}>{worker?.zone} · {lastUpdated}</Text>
            </View>
          </View>
          <Pressable onPress={handleRefresh} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={18} color={Colors.charcoal} />
          </Pressable>
        </View>

        {/* Alert */}
        <AlertBanner
          type="warning"
          message="Rain at 32mm — 18mm away from payout"
          subtitle="We'll automatically transfer money to your UPI when threshold is crossed."
        />

        {/* Active Triggers Bento Grid */}
        <Text style={styles.sectionLabel}>MONITORING NOW</Text>
        {TRIGGER_DEFS.map((def) => {
          const val = currentValues[def.type] ?? 0;
          const hasData = def.type !== "curfew" && def.type !== "flood";

          return (
            <Card key={def.type} padding={18} radius={28} style={styles.triggerCard}>
              {!hasData || val === 0 ? (
                <View style={styles.clearRow}>
                  <View style={styles.clearIcon}>
                    <Ionicons name={def.icon} size={20} color={Colors.charcoalMid} />
                  </View>
                  <View style={styles.clearContent}>
                    <Text style={styles.triggerLabel}>{def.label}</Text>
                    <Text style={styles.triggerDesc}>{def.desc}</Text>
                  </View>
                  <View style={styles.clearPill}>
                    <Text style={styles.clearPillText}>Clear</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.activeContent}>
                  <TriggerMeter
                    type={def.type}
                    value={val}
                    threshold={def.threshold}
                    unit={def.unit}
                    label={def.label}
                  />
                  <Text style={styles.triggerDesc}>{def.desc}</Text>
                </View>
              )}
            </Card>
          );
        })}

        {/* How it works — dark bento */}
        <Card variant="dark" padding={20} radius={28} style={styles.howCard}>
          <View style={styles.howBadge}>
            <Text style={styles.howBadgeText}>ZERO-TOUCH</Text>
          </View>
          <Text style={styles.howTitle}>How automatic payouts work</Text>
          <View style={styles.howSteps}>
            {[
              "5 triggers monitored in real-time",
              "Threshold crossed → payout initiated",
              "UPI transfer within minutes",
              "SMS + notification with breakdown",
            ].map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
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
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  zone: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: Colors.charcoalMid,
  },
  refreshBtn: {
    width: 40,
    height: 40,
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
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoalMid,
    letterSpacing: 1.2,
  },
  triggerCard: { gap: 8 },
  clearRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clearIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: Colors.charcoal,
    alignItems: "center",
    justifyContent: "center",
  },
  clearContent: { flex: 1 },
  triggerLabel: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  triggerDesc: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    marginTop: 2,
  },
  clearPill: {
    backgroundColor: Colors.mint,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
  clearPillText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  activeContent: { gap: 6 },
  howCard: { gap: 14 },
  howBadge: {
    backgroundColor: Colors.lime,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.lime,
    marginBottom: 4,
  },
  howBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: 1.2,
  },
  howTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: Colors.white,
  },
  howSteps: { gap: 10 },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.lime,
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
  },
});
