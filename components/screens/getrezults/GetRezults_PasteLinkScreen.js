import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView as RNScrollView,   // 👈 rename the native one
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // 👈 add this
import { useNavigation, useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { colors, typography } from "../../../theme";
import ZultsButton from "../../ui/ZultsButton";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ScreenFooter from "../../ui/ScreenFooter";
import { NavbarBackRightText } from "../../ui/Navbar";
import ZultsInput from "../../ui/ZultsInput";  // 👈 add this import

// Logos
import shlLogo from "../../../assets/images/SHL.png";
import randoxLogo from "../../../assets/images/Randox.png";
import nhsLogo from "../../../assets/images/NHS.png";

const PROVIDER_NAMES = {
  shl: "Sexual Health London",
  randox: "Randox Health",
  pp: "Planned Parenthood",
};

const COMMON_INSTRUCTIONS =
  "Tap “Share results link” in your results report and paste it here. Only your latest results link can be used.";

export default function GetRezults_PasteLinkScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ start with null (not "null" string)
  const [selectedProvider, setSelectedProvider] = useState(
    route.params?.providerId ?? null
  );
  const [link, setLink] = useState("https://demolink");

  const providers = [
    { id: "shl", name: "Sexual Health London", logo: shlLogo },
    { id: "randox", name: "Randox Health", logo: randoxLogo },
    { id: "pp", name: "Planned Parenthood", logo: nhsLogo },
  ];

  const providerName = useMemo(
    () => (selectedProvider ? PROVIDER_NAMES[selectedProvider] : "Your Provider"),
    [selectedProvider]
  );

  const subtitle = selectedProvider
    ? `From ${providerName}. ${COMMON_INSTRUCTIONS}`
    : "Select your test provider to continue.";

  const handleContinue = () => {
    if (!link || !selectedProvider) return;
    navigation.navigate("GetRezultsLoading", {
      providerId: selectedProvider,
      resultsLink: link,
    });
  };

  // ✅ toggle press
  const handlePress = (providerId) => {
    Haptics.selectionAsync();
    if (selectedProvider === providerId) {
      setSelectedProvider(null);
    } else {
      setSelectedProvider(providerId);
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: colors.background.surface1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScreenWrapper topPadding={0}>
        
        {/* Navbar always visible */}
        <NavbarBackRightText
          rightText="How to find your link?"
          onRightPress={() =>
            navigation.navigate("GetRezultsHowToFindLink", {
              providerId: selectedProvider,
            })
          }
        />

        {/* Scrollable content */}
<KeyboardAwareScrollView
  contentContainerStyle={[
    styles.content,
    { flexGrow: 1, paddingBottom: 90 },
  ]}
  keyboardShouldPersistTaps="handled"
  enableOnAndroid={true}
  extraScrollHeight={-170} // 👈 negative offset to keep input aligned above footer
  showsVerticalScrollIndicator={false}
>
  {/* Page title + subtitle */}
  <View style={styles.headerBlock}>
    <Text style={styles.pageTitle} allowFontScaling={false}>
      Add Rezults
    </Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>

  {/* Provider carousel */}
  <RNScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.carousel}
  >
    {providers.map((provider) => {
      const isSelected = selectedProvider === provider.id;
      const scaleAnim = useRef(new Animated.Value(1)).current;

      return (
        <TouchableOpacity
          key={provider.id}
          activeOpacity={0.9}
          onPress={() => handlePress(provider.id)}
        >
          <Animated.View
            style={[
              styles.card,
              { transform: [{ scale: scaleAnim }] },
              isSelected && styles.cardSelected,
            ]}
          >
            <BlurView
              intensity={60}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />

            {/* Radio indicator */}
            <View style={styles.radioCircle}>
              {isSelected && <View style={styles.radioDot} />}
            </View>

            <Image
              source={provider.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>
      );
    })}
  </RNScrollView>

  {/* Input only if provider selected */}
  {selectedProvider && (
    <ZultsInput
      label="Paste your link"
      value={link}
      onChangeText={setLink}
      placeholder="https://..."
      keyboardType="url"
      style={{ marginBottom: 24 }}
    />
  )}
</KeyboardAwareScrollView>

{/* Footer with Continue button */}
<ScreenFooter>
  <ZultsButton
    label="Add Rezults"
    type="primary"
    size="large"
    fullWidth
    onPress={handleContinue}
    disabled={!selectedProvider || link.trim().length < 5}
  />
</ScreenFooter>
      </ScreenWrapper>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
}

const CARD_WIDTH = 180;
const CARD_HEIGHT = 120;

const styles = StyleSheet.create({
  headerBlock: {
    marginTop: 32,
    marginBottom: 24,
  },
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
  carousel: {
    paddingRight: 8,
    marginBottom: 24,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    marginRight: 12,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardSelected: {
    shadowColor: colors.brand.primary,
    shadowOpacity: 0.25,
  },
  logo: {
    width: 108,
    height: 60,
  },
  radioCircle: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.neutral[0],
  },
  input: {
  ...typography.bodyRegular,
  borderWidth: 0,
  borderRadius: 20,
  paddingHorizontal: 16,
  paddingVertical: 14,
  color: colors.foreground.default,
  backgroundColor: "rgba(255,255,255,0.08)",
  marginBottom: 24,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
},
  content: {
    paddingHorizontal: 16, // ✅ consistent Apple gutter
  },
});
