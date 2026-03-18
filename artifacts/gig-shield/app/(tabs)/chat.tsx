import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientBackground } from "@/components/GradientBackground";
import { Colors } from "@/constants/colors";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  time: string;
}

const INITIAL: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "Hi Rahul! I'm your GigShield AI. Ask me anything about your coverage, triggers, or payouts.",
    time: "9:01 AM",
  },
  {
    id: "2",
    role: "user",
    text: "Why didn't I get a payout yesterday?",
    time: "9:02 AM",
  },
  {
    id: "3",
    role: "ai",
    text: "Yesterday's rainfall reached 32mm in Koramangala — your Standard plan triggers at 50mm. You were 18mm short. AQI was 228, which also didn't cross the 300 threshold. Both need to cross simultaneously for a combined payout.",
    time: "9:02 AM",
  },
  {
    id: "4",
    role: "user",
    text: "What if it rains again today?",
    time: "9:03 AM",
  },
  {
    id: "5",
    role: "ai",
    text: "Current forecast shows 28mm more rain expected by 4 PM. That would push the total to ~60mm — above your threshold! If confirmed, your ₹300 rain payout would auto-transfer to your UPI within minutes. No action needed from you.",
    time: "9:03 AM",
  },
];

const SUGGESTIONS = [
  "What triggers my payout?",
  "Upgrade to Premium?",
  "Next payout estimate",
  "AQI threshold?",
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;

  const sendMessage = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msg, time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "I'm analyzing your policy and current conditions. Based on your Standard plan and live data, I'll update you on your next payout eligibility shortly.",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);

    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowRight : styles.msgRowLeft]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={14} color={Colors.charcoal} />
          </View>
        )}
        <View style={{ maxWidth: "78%", gap: 4 }}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.bubbleText, isUser && styles.userText]}>{item.text}</Text>
          </View>
          <Text style={[styles.timeText, isUser && { textAlign: "right" }]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topInset + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Ionicons name="sparkles" size={18} color={Colors.charcoal} />
            </View>
            <View>
              <Text style={styles.headerTitle}>GigShield AI</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Always on</Text>
              </View>
            </View>
          </View>
          <Pressable style={styles.clearBtn} onPress={() => setMessages(INITIAL)}>
            <Ionicons name="refresh-outline" size={18} color={Colors.charcoalMid} />
          </Pressable>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={[styles.messagesList, { paddingBottom: bottomInset + 140 }]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ? (
              <View style={[styles.msgRow, styles.msgRowLeft]}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={14} color={Colors.charcoal} />
                </View>
                <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
                  <View style={styles.loadingDots}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={styles.dot} />
                    ))}
                  </View>
                </View>
              </View>
            ) : null
          }
        />

        {/* Suggestions */}
        {!loading && (
          <View style={styles.suggestions}>
            <FlatList
              data={SUGGESTIONS}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(s) => s}
              contentContainerStyle={styles.suggestionsInner}
              renderItem={({ item }) => (
                <Pressable style={styles.suggestionPill} onPress={() => sendMessage(item)}>
                  <Text style={styles.suggestionText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: bottomInset + 80 }]}>
          <Pressable style={styles.plusBtn}>
            <Ionicons name="add" size={22} color={Colors.charcoalMid} />
          </Pressable>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your coverage..."
            placeholderTextColor={Colors.textMuted}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: input.trim() ? Colors.charcoal : Colors.surfaceSecondary }]}
            onPress={() => sendMessage()}
            disabled={!input.trim()}
          >
            <Ionicons name="arrow-up" size={18} color={input.trim() ? Colors.lime : Colors.textMuted} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: Colors.charcoal,
    letterSpacing: -0.3,
  },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 1 },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: Colors.success,
  },
  clearBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  messagesList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  msgRowLeft: { justifyContent: "flex-start" },
  msgRowRight: { justifyContent: "flex-end" },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: Colors.lime,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  aiBubble: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.07)",
  },
  userBubble: {
    backgroundColor: Colors.pastel.blue,
    borderWidth: 0,
  },
  bubbleText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoal,
    lineHeight: 21,
  },
  userText: {
    color: Colors.charcoal,
  },
  timeText: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: Colors.textMuted,
    paddingHorizontal: 4,
  },
  loadingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  loadingDots: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: Colors.charcoalMid,
    opacity: 0.5,
  },
  suggestions: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
  },
  suggestionsInner: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestionPill: {
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: Colors.charcoal,
  },
  inputBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  plusBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginBottom: 1,
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: Colors.charcoal,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
  },
});
