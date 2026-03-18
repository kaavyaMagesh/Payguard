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
  { type: "aqi" as const, threshold: 300, unit: "", label: "Air Quality Index", icon: "cloudy-outline" as const, description: "Severe pollution — AQI 300+" },
  { type: "rain" as const, threshold: 50, unit: "mm", label: "Rainfall", icon: "rainy-outline" as const, description: "Heavy rain — 50mm in 3 hours" },
  { type: "heat" as const, threshold: 45, unit: "°C", label: "Temperature", icon: "thermometer-outline" as const, description: "Extreme heat — 45°C+" },
  { type: "curfew" as const, threshold: 1, unit: "", label: "Curfew / Strike", icon: "warning-outline" as const, description: "Government-declared curfew or bandh" },
  { type: "flood" as const, threshold: 1, unit: "", label: "Flood Alert", icon: "water-outline" as const, description: "Flood alert issued for your pincode" },
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

  if (!weather) {
    return (
      <View style={[styles.container, { paddingTop: topInset + 20 }]}>
        <Text style={styles.loading}>Loading weather data...</Text>
      </View>
    );
  }

  const currentValues: Record<string, number> = {
    aqi: weather.aqi,
    rain: weather.rainfall,
    heat: weather.temperature,
    curfew: 0,
    flood: 0,
  };

  const lastUpdated = new Date(weather.lastUpdated).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.container]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
        contentContainerStyle={[styles.scroll, { paddingTop: topInset + 12, paddingBottom: bottomInset + 100 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Live Triggers</Text>
            <View style={styles.zoneRow}>
              <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.zone}>{worker?.zone ?? "Your Zone"}</Text>
              <Text style={styles.updated}>· Updated {lastUpdated}</Text>
            </View>
          </View>
          <Pressable onPress={handleRefresh} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={18} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Alert */}
        <View style={styles.alertContainer}>
          <AlertBanner
            type="warning"
            message="Rain at 32mm — 18mm away from payout"
            subtitle="Conditions being monitored in real time. You'll get notified before a payout triggers."
          />
        </View>

        {/* Trigger Cards */}
        <View style={styles.section}>
          {TRIGGER_DEFS.map((def, i) => {
            const val = currentValues[def.type] ?? 0;
            const pct = Math.min((val / def.threshold) * 100, 100);
            const isMeaningful = def.type !== "curfew" && def.type !== "flood";

            if (!isMeaningful && val === 0) {
              return (
                <Card key={def.type} padding={16} style={styles.triggerCard}>
                  <View style={styles.inactiveRow}>
                    <View style={[styles.iconBox, { backgroundColor: Colors.border }]}>
                      <Ionicons name={def.icon} size={20} color={Colors.textMuted} />
                    </View>
                    <View style={styles.inactiveContent}>
                      <Text style={styles.triggerLabel}>{def.label}</Text>
                      <Text style={styles.triggerDesc}>{def.description}</Text>
                    </View>
                    <View style={styles.clearBadge}>
                      <Text style={styles.clearText}>Clear</Text>
                    </View>
                  </View>
                </Card>
              );
            }

            return (
              <Card key={def.type} padding={16} style={styles.triggerCard}>
                <TriggerMeter
                  type={def.type}
                  value={isMeaningful ? val : 0}
                  threshold={def.threshold}
                  unit={def.unit}
                  label={def.label}
                />
                <Text style={styles.triggerDesc}>{def.description}</Text>
              </Card>
            );
          })}
        </View>

        {/* How it works */}
        <Card padding={16} style={styles.infoCard}>
          <Text style={styles.infoTitle}>How zero-touch payouts work</Text>
          <View style={styles.infoSteps}>
            {[
              "We monitor 5 weather & civic triggers in real time",
              "When a threshold is crossed, payout is auto-initiated",
              "Money arrives in your UPI account within minutes",
              "You get an SMS + notification with details",
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loading: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 60,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  zoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  zone: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: Colors.textSecondary,
  },
  updated: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  alertContainer: {},
  section: {
    gap: 12,
  },
  triggerCard: {
    borderRadius: 16,
    gap: 8,
  },
  triggerDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    marginTop: 2,
  },
  inactiveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveContent: {
    flex: 1,
    gap: 2,
  },
  triggerLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
  },
  clearBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  clearText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: Colors.primaryDark,
  },
  infoCard: {
    borderRadius: 16,
    gap: 14,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: Colors.text,
  },
  infoSteps: {
    gap: 12,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  stepNumText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: Colors.primaryDark,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
