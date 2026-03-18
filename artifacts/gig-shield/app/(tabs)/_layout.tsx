import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconActive]}>
      <Ionicons
        name={name as any}
        size={20}
        color={focused ? Colors.charcoal : Colors.charcoalMid}
      />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const bottomPad = isWeb ? 24 : insets.bottom + 8;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.charcoal,
        tabBarInactiveTintColor: Colors.charcoalMid,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          left: 40,
          right: 40,
          bottom: bottomPad,
          height: 64,
          borderRadius: 999,
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.06)",
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarBackground: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="triggers"
        options={{
          title: "Live",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "pulse" : "pulse-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Chat",
          tabBarIcon: ({ focused }) => (
            <View style={styles.chatTabBtn}>
              <Ionicons name="sparkles" size={20} color={Colors.charcoal} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="payouts"
        options={{
          title: "Payouts",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "cash" : "cash-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "person" : "person-outline"} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  iconActive: {
    backgroundColor: Colors.lime,
  },
  chatTabBtn: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
