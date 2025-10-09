// components/screens/getrezults/GetRezults_PasteLinkScreen.js
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

// Provider logos
import ppLogo from "../../../assets/images/pp-logo.png";
import soapoliLogo from "../../../assets/images/soapoli.png";
import shlLogo from "../../../assets/images/SHL.png";
import shUKLogo from "../../../assets/images/SHUK.png";
import testMeLogo from "../../../assets/images/testforme.png";
import openHouseLogo from "../../../assets/images/openhouse.png";
import chevronDown from "../../../assets/images/chevron-down.png";

// ✅ Unified providers list — same as ProvidersListScreen
const PROVIDERS = [
  { id: "pp", name: "Planned Parenthood", logo: ppLogo, baseUrl: "https://www.plannedparenthood/demo" },
  { id: "soapoli", name: "Soapoli-Online", logo: soapoliLogo, baseUrl: "https://www.soapoli-online/demo" },
  { id: "shl", name: "Sexual Health London", logo: shlLogo, baseUrl: "https://www.shl/demo" },
  { id: "shuk", name: "SH.UK", logo: shUKLogo, baseUrl: "https://www.shuk/demo" },
  { id: "testme", name: "TestForMe", logo: testMeLogo, baseUrl: "https://www.testforme/demo" },
  { id: "openhouse", name: "Open House", logo: openHouseLogo, baseUrl: "https://openhouse/demo" },
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
            {/* Header */}
            <View style={styles.headerBlock}>
              <Text style={styles.title}>
                Add your Rezults
              </Text>
              <Text
                style={[typography.bodyRegular, styles.subtitle]}
              >
                Choose your test provider and paste your results link to turn it
                into your Rezults.
              </Text>
            </View>

            {/* Provider Dropdown */}
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
                  >
                    {selectedProvider.name}
                  </Text>
                </>
              ) : (
                <Text
                  style={[styles.dropdownText, { color: colors.foreground.soft }]}
                >
                  Select your provider
                </Text>
              )}
              <Image source={chevronDown} style={styles.chevron} />
            </TouchableOpacity>

            {/* Link Input */}
            {selectedProvider && (
              <ZultsInput
                ref={inputRef}
                value={link}
                onChangeText={setLink}
                placeholder="Paste your results link..."
                keyboardType="url"
                style={{ marginTop: 10 }}
                placeholderTextColor={colors.foreground.muted}
              />
            )}
          </ScrollView>

          {/* Footer */}
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
                  typography.subheadlineRegular,
                  {
                    color: colors.foreground.muted,
                    textAlign: "center",
                  },
                ]}
              >
                Don’t see your provider? Let us know.
              </Text>
            </TouchableOpacity>
          </ScreenFooter>

          {/* Provider Picker Modal */}
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
                    <Text style={styles.sheetTitle}>
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
  title: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 8,
    flexWrap: "wrap",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    backgroundColor: colors.background.surface2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  dropdownText: {
    ...typography.headlineMedium,
    color: colors.foreground.default,
    flex: 1,
  },
  providerLogo: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  chevron: {
    width: 20,
    height: 20,
    tintColor: colors.foreground.muted,
  },
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
    ...typography.title1Medium,
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
    color: colors.foreground.soft,
    flexShrink: 1,
  },
});
