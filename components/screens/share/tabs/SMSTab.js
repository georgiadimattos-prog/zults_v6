import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { colors, typography } from "../../../../theme";
import infoIcon from "../../../../assets/images/info-icon.png";
import ZultsButton from "../../../ui/ZultsButton";

export default function SMSTab({ navigation }) {
  const [phone, setPhone] = useState("");
  const isValid = phone.trim().length >= 8;

  // ✅ Pulse animation for quota number
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 120,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Card container */}
      <View style={styles.card}>
        {/* Phone input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, typography.inputText]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Add phone number"
            placeholderTextColor={colors.foreground.muted}
            keyboardType="phone-pad"
            maxFontSizeMultiplier={1.2}
            onFocus={() => {
              if (!phone) {
                setPhone("+447123456789"); // 👈 demo number prefilled
              }
            }}
          />
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          <Image source={infoIcon} style={styles.infoIcon} />
          <Text style={styles.infoText}>
  <Animated.Text
    style={[styles.infoHighlight, { transform: [{ scale: pulseAnim }] }]}
    maxFontSizeMultiplier={1.2}
  >
    1 of 1
  </Animated.Text>{" "}
  SMS available this week
</Text>
        </View>

        {/* Continue button */}
        <ZultsButton
          label="Continue"
          type="primary"
          size="large"
          fullWidth
          disabled={!isValid}
          onPress={() => navigation.navigate("ReviewSMSRequest", { phone })}
          style={{ marginTop: 16 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.surface3,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: colors.foreground.default,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D3E2D",
    borderRadius: 12,
    padding: 12,
  },
  infoIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: "#1DCA7A",
  },
  infoText: {
    flexShrink: 1,
    ...typography.captionSmallRegular,
    color: colors.neutral[0],
  },
  infoHighlight: {
    color: "#1DCA7A",
    fontWeight: "600",
  },
});
