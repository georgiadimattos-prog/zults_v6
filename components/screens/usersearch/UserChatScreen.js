import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RezultsActionButton from "../../ui/RezultsActionButton";
import RezultActionBubble from "../../ui/RezultActionBubble";
import { runDemoFlow } from "../../../logic/DemoFlow";
import fallbackAvatar from "../../../assets/images/melany.png";

export default function UserChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const user = route?.params?.user || {
    id: "demo1",
    name: "Demo1",
    image: fallbackAvatar,
  };

  const cacheKey = `chat-${user.id}`;
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [buttonState, setButtonState] = useState("request"); // request | requested | view
  const [isTyping, setIsTyping] = useState(false);

  // restore previous chat
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(cacheKey);
      if (saved) {
        const { messages, button } = JSON.parse(saved);
        setMessages(messages || []);
        setButtonState(button || "request");
      }
    })();
  }, []);

  // persist chat
  useEffect(() => {
    AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({ messages, button: buttonState })
    );
  }, [messages, buttonState]);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), ...msg }]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // 👇 request flow
  const handleRequestPress = () => {
    if (buttonState !== "request") return;

    addMessage({
      direction: "from-user",
      username: "You",
      text: "Requested Rezults",
      type: "request",
    });

    setButtonState("requested"); // temporarily lock
    runDemoFlow(user, addMessage, setIsTyping, setButtonState);
  };

  const handleViewPress = () => {
    navigation.navigate("Rezults", {
      username: user.name,
      avatar: user.image || fallbackAvatar,
    });
  };

  const renderItem = ({ item }) => (
    <RezultActionBubble
      direction={item.direction}
      username={item.username}
      avatar={item.avatar || fallbackAvatar}
      text={item.text}
      type={item.type}
    />
  );

  return (
    <View style={styles.container}>
      {/* top button */}
      <View style={styles.header}>
        <RezultsActionButton
          status={buttonState}
          onPress={
            buttonState === "view"
              ? handleViewPress
              : buttonState === "request"
              ? handleRequestPress
              : null
          }
        />
      </View>

      {/* chat area */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 180,
            paddingBottom: 140,
          }}
        />
      </KeyboardAvoidingView>

      {/* footer */}
      <BlurView intensity={40} tint="dark" style={styles.footerBlur}>
        <View style={styles.footerRow}>
          <RezultsActionButton
            status={buttonState}
            onPress={
              buttonState === "view"
                ? handleViewPress
                : buttonState === "request"
                ? handleRequestPress
                : null
            }
          />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { alignItems: "center", paddingTop: 60, paddingBottom: 20 },
  footerBlur: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingTop: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
