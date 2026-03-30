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
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function ProfileScreen() {
  const { worker, totalPremiums } = useApp();
  const insets = useSafeAreaInsets();

  const topPad = Platform.OS === "web" ? 64 : insets.top;

  if (!worker) return null;

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
          <Text style={styles.title}>Account</Text>
        </View>

        <Card padding={20} radius={32} style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{worker.avatarInitials}</Text>
            </View>
            <View>
              <Text style={styles.name}>{worker.name}</Text>
              <Text style={styles.phone}>{worker.phone}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>₹{totalPremiums}</Text>
              <Text style={styles.statLab}>Premiums</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{worker.platform.toUpperCase()}</Text>
              <Text style={styles.statLab}>Platform</Text>
            </View>
            <View style={styles.statDiv} />
            <View style={styles.stat}>
              <Text style={styles.statVal}>{worker.streakWeeks}</Text>
              <Text style={styles.statLab}>Weeks</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification</Text>
          <Card padding={0} radius={24} noBorder>
            <View style={styles.row}>
              <Ionicons name="card-outline" size={20} color={Colors.success} />
              <Text style={styles.rowLabel}>Aadhaar Verified</Text>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
            </View>
            <View style={styles.line} />
            <View style={styles.row}>
              <Ionicons name="camera-outline" size={20} color={Colors.success} />
              <Text style={styles.rowLabel}>Selfie Verified</Text>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card padding={0} radius={24} noBorder>
            <View style={styles.row}>
              <Ionicons name="notifications-outline" size={20} color={Colors.charcoal} />
              <Text style={styles.rowLabel}>Push Notifications</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </View>
            <View style={styles.line} />
            <View style={styles.row}>
              <Ionicons name="wallet-outline" size={20} color={Colors.charcoal} />
              <Text style={styles.rowLabel}>UPI Settings</Text>
              <Text style={styles.upiText}>{worker.upiId}</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  content: { paddingHorizontal: 18, gap: 20 },
  header: { marginBottom: 4 },
  title: { fontSize: 30, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.6 },
  profileCard: { gap: 20 },
  profileTop: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  avatarText: { fontSize: 24, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  name: { fontSize: 20, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  phone: { fontSize: 14, fontFamily: "Inter_500Medium", color: Colors.charcoalMid },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.03)",
    padding: 16,
    borderRadius: 20,
  },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statVal: { fontSize: 16, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  statLab: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: Colors.charcoalMid, textTransform: "uppercase" },
  statDiv: { width: 1, height: 24, backgroundColor: "rgba(0,0,0,0.07)" },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", color: Colors.charcoal, marginLeft: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  rowLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold", color: Colors.charcoal },
  line: { height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginHorizontal: 16 },
  upiText: { fontSize: 13, fontFamily: "Inter_500Medium", color: Colors.charcoalMid },
});
