import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useApp } from "@/context/AppContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatScreen() {
  const { worker, policy } = useApp();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hi ${worker?.name.split(" ")[0]}! I'm your Payguard Assistant. How can I help with your performance-based insurance today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input, policy?.tier || "standard"),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const getAIResponse = (query: string, tier: string) => {
    const q = query.toLowerCase();
    if (q.includes("payout") || q.includes("claim")) {
      return "Payouts are automatic based on hyper-local triggers. If a threshold is hit in your zone, we'll notify you and send the UPI payment instantly.";
    }
    if (q.includes("premium")) {
      return `Your current ${tier} plan premium is ₹${tier === "premium" ? 79 : tier === "standard" ? 49 : 29} per week. You can change this anytime from the policy tab.`;
    }
    return "I'm analyzing your current weather and risk data. Your current status is stable, but I'll alert you if rainfall or AQI hits your policy's trigger thresholds.";
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const topPad = Platform.OS === "web" ? 64 : insets.top;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={18} color={Colors.charcoal} />
          </View>
          <View>
            <Text style={styles.title}>AI Assistant</Text>
            <Text style={styles.subtitle}>Online · Policy Expert</Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.msgWrap,
              m.role === "user" ? styles.msgUser : styles.msgAI,
            ]}
          >
            <Text
              style={[
                styles.msgText,
                { color: m.role === "user" ? Colors.charcoal : Colors.charcoalMid },
              ]}
            >
              {m.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.inputContainer, { marginBottom: insets.bottom + 85 }]}>
        <TextInput
          style={styles.input}
          placeholder="Ask anything..."
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline={false}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Ionicons name="arrow-up" size={20} color={Colors.charcoal} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  title: { fontSize: 18, fontFamily: "Inter_700Bold", color: Colors.charcoal },
  subtitle: { fontSize: 12, fontFamily: "Inter_500Medium", color: Colors.success },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 16 },
  msgWrap: {
    maxWidth: "85%",
    padding: 16,
    borderRadius: 24,
  },
  msgUser: {
    alignSelf: "flex-end",
    backgroundColor: Colors.pastel.blue,
    borderBottomRightRadius: 4,
  },
  msgAI: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  msgText: { fontSize: 15, fontFamily: "Inter_500Medium", lineHeight: 22 },
  inputContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.5 },
});
