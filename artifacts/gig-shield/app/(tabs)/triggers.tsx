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
  { type: "aqi" as const, threshold: 300, unit: "", label: "Air Quality Index", icon: "cloudy-outline" as const, desc: "AQI 300+ triggers severe pollution payout" },
  { type: "rain" as const, threshold: 50, unit: "mm", label: "Rainfall", icon: "rainy-outline" as const, desc: "50mm rain in 3 hours triggers heavy rain payout" },
  { type: "heat" as const, threshold: 45, unit: "°C", label: "Temperature", icon: "thermometer-outline" as const, desc: "45°C+ triggers extreme heat payout" },
  { type: "curfew" as const, threshold: 1, unit: "", label: "Curfew / Strike", icon: "warning-outline" as const, desc: "Govt-declared curfew or bandh" },
  { type: "flood" as const, threshold: 1, unit: "", label: "Flood Alert", icon: "water-outline" as const, desc: "Official flood alert for your pincode" },
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
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 8, paddingBottom: bottomInset + 120 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Live Triggers</Text>
            <View style={styles.zoneRow}>
              <Ionicons name="location-outline" size={12} color={Colors.charcoalMid} />
              <Text style={styles.zone}>{worker?.zone} · {lastUpdated}</Text>
            </View>
          </View>
          <Pressable onPress={handleRefresh} style={styles.refreshBtn}>
            <Ionicons name="refresh-outline" size={18} color={Colors.charcoal} />
          </Pressable>
        </View>

        <AlertBanner
          type="info"
          message="Monitoring 5 live conditions in your zone"
          subtitle="Payouts transfer automatically when thresholds are crossed."
        />

        {TRIGGER_DEFS.map((def) => {
          const val = currentValues[def.type] ?? 0;
          const hasLiveData = def.type !== "curfew" && def.type !== "flood";

          return (
            <Card key={def.type} padding={18} radius={28} noBorder style={styles.triggerCard}>
              {!hasLiveData || val === 0 ? (
                <View style={styles.clearRow}>
                  <View style={styles.clearIconBox}>
                    <Ionicons name={def.icon} size={18} color={Colors.charcoalMid} />
                  </View>
                  <View style={styles.clearContent}>
                    <Text style={styles.triggerLabel}>{def.label}</Text>
                    <Text style={styles.triggerDesc}>{def.desc}</Text>
                  </View>
                  <View style={styles.clearPill}>
                    <View style={styles.clearDot} />
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

        {/* How it works */}
        <Card variant="dark" padding={22} radius={32} noBorder style={styles.howCard}>
          <View style={styles.howHeader}>
            <View style={styles.howBadge}>
              <Ionicons name="flash" size={12} color={Colors.charcoal} />
              <Text style={styles.howBadgeText}>ZERO-TOUCH</Text>
            </View>
          </View>
          <Text style={styles.howTitle}>Fully automatic payouts</Text>
          <Text style={styles.howSubtitle}>No claims, no paperwork, no waiting.</Text>
          <View style={styles.howSteps}>
            {[
              "5 conditions monitored in real-time 24/7",
              "Threshold crossed → payout initiated instantly",
              "UPI transfer within minutes of trigger",
              "SMS notification with full breakdown",
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
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scroll: { flexGrow: 1, paddingHorizontal: 18, gap: 14 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: -0.5,
  },
  zoneRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  zone: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.charcoalMid },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  triggerCard: {},
  clearRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  clearIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  clearContent: { flex: 1 },
  triggerLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: Colors.charcoal },
  triggerDesc: { fontSize: 11, fontFamily: "Inter_400Regular", color: Colors.textMuted, marginTop: 2, lineHeight: 16 },
  clearPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.pastel.green,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  clearDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  clearPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#007A45" },
  activeContent: { gap: 6 },
  howCard: { gap: 14 },
  howHeader: { flexDirection: "row" },
  howBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.lime,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  howBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: 0.5 },
  howTitle: { fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.white, letterSpacing: -0.4 },
  howSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.5)", marginTop: -8 },
  howSteps: { gap: 10 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  stepNum: {
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNumText: { fontSize: 11, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  stepText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", lineHeight: 20 },
});
