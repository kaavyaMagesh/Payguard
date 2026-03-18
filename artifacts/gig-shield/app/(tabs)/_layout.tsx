import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/colors";

export default function TabLayout() {
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.charcoal,
        tabBarInactiveTintColor: Colors.charcoalMid,
        tabBarActiveBackgroundColor: "transparent",
        tabBarLabelStyle: {
          fontFamily: "Inter_700Bold",
          fontSize: 11,
          letterSpacing: 0.2,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Colors.lime,
          borderTopWidth: 2,
          borderTopColor: Colors.charcoal,
          elevation: 0,
          height: isWeb ? 84 : 72,
          paddingBottom: isWeb ? 16 : 8,
          paddingTop: 8,
          shadowColor: Colors.charcoal,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 0,
        },
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.lime }]} />
        ),
        tabBarItemStyle: {
          borderRadius: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <Ionicons name={focused ? "home" : "home-outline"} size={22} color={focused ? Colors.charcoal : Colors.charcoalMid} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="triggers"
        options={{
          title: "Live",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <Ionicons name={focused ? "pulse" : "pulse-outline"} size={22} color={focused ? Colors.charcoal : Colors.charcoalMid} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="payouts"
        options={{
          title: "Payouts",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <Ionicons name={focused ? "cash" : "cash-outline"} size={22} color={focused ? Colors.charcoal : Colors.charcoalMid} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIcon : styles.icon}>
              <Ionicons name={focused ? "person" : "person-outline"} size={22} color={focused ? Colors.charcoal : Colors.charcoalMid} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIcon: {
    width: 36,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.charcoal,
  },
});
