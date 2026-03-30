import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PolicyCard } from "@/components/PolicyCard";
import { Button } from "@/components/ui/Button";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

export default function PolicyScreen() {
  const { policy, selectPolicyTier } = useApp();
  const insets = useSafeAreaInsets();

  const handleSelect = (tier: any) => {
    selectPolicyTier(tier);
    router.back();
  };

  const topPad = Platform.OS === "web" ? 64 : insets.top;

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Plan</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
      >
        <View style={styles.intro}>
          <Text style={styles.title}>Your Safety Net</Text>
          <Text style={styles.subtitle}>
            Choose a plan that fits your risk profile. You can upgrade or downgrade anytime.
          </Text>
        </View>

        <View style={styles.tiers}>
          <PolicyCard
            tier="basic"
            weeklyPremium={29}
            coverageAmount={1000}
            selected={policy?.tier === "basic"}
            onSelect={() => handleSelect("basic")}
            current={policy?.tier === "basic"}
          />
          <PolicyCard
            tier="standard"
            weeklyPremium={49}
            coverageAmount={2500}
            selected={policy?.tier === "standard"}
            onSelect={() => handleSelect("standard")}
            current={policy?.tier === "standard"}
          />
          <PolicyCard
            tier="premium"
            weeklyPremium={79}
            coverageAmount={5000}
            selected={policy?.tier === "premium"}
            onSelect={() => handleSelect("premium")}
            current={policy?.tier === "premium"}
          />
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle" size={20} color="#005BAA" />
          </View>
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Automatic Protection</Text>
            <Text style={styles.infoDesc}>
              Once you select a plan, it's active for 7 days. We'll automatically renew it unless you deactivate auto-renew in settings.
            </Text>
          </View>
        </View>

        <Button
          label="Close"
          onPress={() => router.back()}
          variant="secondary"
          trailingIcon="close"
          fullWidth
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  content: { padding: 20, gap: 24 },
  intro: { gap: 6 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", color: Colors.charcoal, letterSpacing: -0.6 },
  subtitle: { fontSize: 15, fontFamily: "Inter_500Medium", color: Colors.charcoalMid, lineHeight: 22 },
  tiers: { gap: 20 },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.pastel.blue,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0,91,170,0.1)",
  },
  infoIcon: { marginTop: 2 },
  infoText: { flex: 1, gap: 4 },
  infoTitle: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#005BAA" },
  infoDesc: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#004785", lineHeight: 20 },
});
