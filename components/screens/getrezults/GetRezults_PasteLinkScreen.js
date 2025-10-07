import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ScreenFooter from "../../ui/ScreenFooter";
import { NavbarBackRightText } from "../../ui/Navbar";
import ZultsInput from "../../ui/ZultsInput";
import ZultsButton from "../../ui/ZultsButton";

// Logos
import shlLogo from "../../../assets/images/SHL.png";
import randoxLogo from "../../../assets/images/Randox.png";
import nhsLogo from "../../../assets/images/NHS.png";
import ppLogo from "../../../assets/images/pp-logo.png";
import chevronDown from "../../../assets/images/chevron-down.png";

const PROVIDERS = [
  { id: "pp", name: "Planned Parenthood", logo: ppLogo, baseUrl: "https://plannedparenthood.demo/" },
  { id: "shl", name: "Sexual Health London", logo: shlLogo, baseUrl: "https://www.shl.uk/" },
  { id: "nhs", name: "NHS", logo: nhsLogo, baseUrl: "https://www.nhs.uk/" },
  { id: "randox", name: "Randox Health", logo: randoxLogo, baseUrl: "https://www.randoxhealth.com/" },
];

export default function GetRezults_PasteLinkScreen() {
  const navigation = useNavigation();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [link, setLink] = useState("");
  const inputRef = useRef(null);

  const handleContinue = () => {
    if (!link || !selectedProvider) return;
    navigation.navigate("GetRezultsLoading", {
      providerId: selectedProvider.id,
      resultsLink: link,
    });
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setShowSheet(false);
    setLink(provider.baseUrl);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background.surface1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenWrapper topPadding={0}>
          <NavbarBackRightText
            rightText="How to find your link?"
            onRightPress={() =>
              navigation.navigate("GetRezultsHowToFindLink", {
                providerId: selectedProvider?.id,
              })
            }
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, { paddingBottom: 90 }]}
            keyboardShouldPersistTaps="handled"
          >
            {/* ─── Header ─── */}
            <View style={styles.headerBlock}>
              <Text style={styles.title} allowFontScaling={false}>
                Add your Rezults
              </Text>

              <Text
                style={[typography.bodyRegular, styles.subtitle]}
                allowFontScaling
                maxFontSizeMultiplier={1.3}
              >
                Find your STI results link from your provider and paste it below
                to turn it into your Rezults.
              </Text>
            </View>

            {/* ─── Provider Dropdown ─── */}
            <TouchableOpacity
              onPress={() => {
                Haptics.selectionAsync();
                setShowSheet(true);
              }}
              activeOpacity={0.9}
              style={styles.dropdown}
            >
              {selectedProvider ? (
                <>
                  <Image
                    source={selectedProvider.logo}
                    style={styles.providerLogo}
                    resizeMode="contain"
                  />
                  <Text
                    style={styles.dropdownText}
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.3}
                  >
                    {selectedProvider.name}
                  </Text>
                </>
              ) : (
                <Text
                  style={[styles.dropdownText, { color: colors.foreground.soft }]}
                  maxFontSizeMultiplier={1.3}
                >
                  Select your provider
                </Text>
              )}
              <Image source={chevronDown} style={styles.chevron} />
            </TouchableOpacity>

            {/* ─── Link Input ─── */}
            {selectedProvider && (
              <ZultsInput
                ref={inputRef}
                value={link}
                onChangeText={setLink}
                placeholder="Paste your results link..."
                keyboardType="url"
                style={{ marginTop: 10 }}
                placeholderTextColor={colors.foreground.muted}
                maxFontSizeMultiplier={1.3}
              />
            )}
          </ScrollView>

          {/* ─── Footer ─── */}
          <ScreenFooter>
            <ZultsButton
              label="Continue"
              type="primary"
              size="large"
              fullWidth
              onPress={handleContinue}
              disabled={!selectedProvider || link.trim().length < 5}
            />

            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() =>
                Linking.openURL(
                  "mailto:support@myrezults.com?subject=Request a new provider"
                )
              }
            >
              <Text
                style={[
                  typography.subheadlineRegular, // ✅ smaller Apple-style footnote link
                  {
                    color: colors.foreground.muted,
                    textAlign: "center",
                  },
                ]}
                allowFontScaling
                maxFontSizeMultiplier={1.3}
              >
                Don’t see your provider? Let us know.
              </Text>
            </TouchableOpacity>
          </ScreenFooter>

          {/* ─── Provider Picker Modal ─── */}
          <Modal
            transparent
            visible={showSheet}
            animationType="fade"
            onRequestClose={() => setShowSheet(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowSheet(false)}>
              <BlurView intensity={40} tint="dark" style={styles.overlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.sheetContainer}>
                    <Text style={styles.sheetTitle} allowFontScaling={false}>
                      Choose your provider
                    </Text>

                    {PROVIDERS.map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        onPress={() => handleProviderSelect(p)}
                        style={styles.sheetItem}
                        activeOpacity={0.9}
                      >
                        <Image
                          source={p.logo}
                          style={styles.sheetLogo}
                          resizeMode="contain"
                        />
                        <Text
                          style={styles.sheetText}
                          allowFontScaling
                          maxFontSizeMultiplier={1.3}
                          numberOfLines={1}
                        >
                          {p.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableWithoutFeedback>
              </BlurView>
            </TouchableWithoutFeedback>
          </Modal>
        </ScreenWrapper>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16 },
  headerBlock: { marginTop: 32, marginBottom: 24 },

  // ─── Title / Subtitle ───
  title: {
    ...typography.largeTitleMedium, // ✅ 32 / 36 / -0.64
    color: colors.foreground.default,
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 8,
    flexWrap: "wrap",
  },

  // ─── Provider Dropdown ───
dropdown: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: 16,                         // ✅ same curvature as InfoCards
  backgroundColor: colors.background.surface2, // ✅ same tone
  paddingHorizontal: 16,
  paddingVertical: 14,                      // ✅ matches InfoCard vertical padding
  marginBottom: 12,
},

dropdownText: {
  ...typography.headlineMedium,             // ✅ same typographic scale as InfoCard title
  color: colors.foreground.default,
  flex: 1,
},

providerLogo: {
  width: 48,                                // ✅ same icon proportion as InfoCard icons
  height: 48,
  marginRight: 12,
},

chevron: {
  width: 20,
  height: 20,
  tintColor: colors.foreground.muted,
},

  // ─── Modal ───
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: colors.background.surface2,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sheetTitle: {
    ...typography.title1Medium, // ✅ Apple-style modal title (28 / 34)
    color: colors.foreground.default,
    marginBottom: 24,
  },
  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },
  sheetLogo: {
    width: 64,
    height: 64,
    marginRight: 16,
  },
  sheetText: {
  ...typography.headlineMedium,
  color: colors.foreground.soft, // ✅ softer 60% white tone
  flexShrink: 1,
},
});
