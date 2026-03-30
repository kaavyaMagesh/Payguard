import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/GradientBackground";
import { Card } from "@/components/ui/Card";
import { TriggerMeter } from "@/components/TriggerMeter";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function TriggersScreen() {
  const { weather, refreshWeather } = useApp();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 64 : insets.top;

  return (
    <GradientBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refreshWeather} tintColor={Colors.charcoal} />
        }
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: 130 },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Live Monitoring</Text>
          <View style={styles.zonePill}>
            <Ionicons name="location" size={14} color={Colors.charcoalMid} />
            <Text style={styles.zoneText}>{weather?.zone}</Text>
          </View>
        </View>

        <Card variant="default" padding={22} radius={32} style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dynamic Thresholds</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.desc}>
            Your insurance activates automatically when any of these reach 100%. Payouts are sent via UPI instantly.
          </Text>

          <View style={styles.triggerList}>
            {weather && (
              <>
                <TriggerMeter
                  type="rain"
                  value={weather.rainfall}
                  threshold={weather.rainfallMax}
                  unit="mm"
                  label="Rainfall (High Intensity)"
                />
                <View style={styles.div} />
                <TriggerMeter
                  type="aqi"
                  value={weather.aqi}
                  threshold={weather.aqiMax}
                  unit=""
                  label="Air Quality Index"
                />
                <View style={styles.div} />
                <TriggerMeter
                  type="heat"
                  value={weather.temperature}
                  threshold={weather.tempMax}
                  unit="°C"
                  label="Surface Temperature h"
                />
              </>
            )}
          </View>
        </Card>

        {/* Info Cards */}
        <View style={styles.row}>
          <Card variant="mint" style={styles.miniCard} padding={18}>
            <Ionicons name="flash-outline" size={20} color="#007A45" />
            <Text style={styles.miniLabel}>Network Latency</Text>
            <Text style={styles.miniValue}>12ms</Text>
          </Card>
          <Card variant="blue" style={styles.miniCard} padding={18}>
            <Ionicons name="radio-outline" size={20} color="#005BAA" />
            <Text style={styles.miniLabel}>Sensor Health</Text>
            <Text style={styles.miniValue}>99%</Text>
          </Card>
        </View>

        <Card variant="yellow" padding={20} radius={28} style={styles.notice}>
          <Text style={styles.noticeTitle}>Did you know?</Text>
          <Text style={styles.noticeText}>
            Our sensors are updated every 3 minutes. If you're in a high-risk zone, we suggest keeping your phone online for real-time alerts.
          </Text>
        </Card>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, gap: 18 },
  header: { gap: 6 },
  title: { fontSize: 30, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.6 },
  zonePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  zoneText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: Colors.charcoalMid },
  mainCard: { gap: 16 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.pastel.blue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.info },
  liveText: { fontSize: 10, fontFamily: "Inter_700Bold", color: Colors.info, letterSpacing: 0.5 },
  desc: { fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.charcoalMid, lineHeight: 20 },
  triggerList: { gap: 20, marginTop: 4 },
  div: { height: 1, backgroundColor: "rgba(0,0,0,0.05)" },
  row: { flexDirection: "row", gap: 10 },
  miniCard: { flex: 1, gap: 6 },
  miniLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.charcoalMid, textTransform: "uppercase" },
  miniValue: { fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  notice: { gap: 4 },
  noticeTitle: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#A07800" },
  noticeText: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#806000", lineHeight: 18 },
});
