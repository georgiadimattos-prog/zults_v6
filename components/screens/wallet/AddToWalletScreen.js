import React, { useRef, useEffect } from "react";
import {
  View,
  Animated,
  Easing,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import ZultsButton from "../../ui/ZultsButton";
import { colors, typography } from "../../../theme";

export default function AddToWalletScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <BlurView intensity={40} tint="dark" style={styles.overlay}>
        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.card,
              { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
            ]}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <Image
                source={require("../../../assets/images/icon-logo-zults.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.userField}>
                <Text
                  style={[
                    typography.captionSmallRegular,
                    { color: "rgba(255,255,255,0.6)" },
                  ]}
                >
                  Username
                </Text>
                <Text
                  style={[
                    typography.title3Medium,
                    { color: colors.foreground.default },
                  ]}
                >
                  Jonster
                </Text>
              </View>
            </View>

            {/* QR Section */}
            <View style={styles.qrSection}>
              <Text
                style={[
                  typography.subheadlineRegular,
                  { color: colors.foreground.soft, marginBottom: 16 },
                ]}
              >
                Scan to view Rezults
              </Text>
              <View style={styles.qrContainer}>
                <Image
                  source={require("../../../assets/images/qr-code.png")}
                  style={styles.qr}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <ZultsButton
                label="Add to Wallet"
                type="secondary"
                size="medium"
                fullWidth={false}
                onPress={() => navigation.goBack()}
                style={{ alignSelf: "center", paddingHorizontal: 30 }}
              />
              {/* Cancel removed 👆 */}
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </BlurView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 60,
  },
  card: {
    width: 370,
    height: 520,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: colors.background.surface3,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  logo: {
    width: 102,
    height: 36,
    alignSelf: "flex-start",
  },
  qrSection: {
    marginTop: "auto",
    alignItems: "center",
  },
  qrContainer: {
    width: 156,
    height: 156,
    padding: 12,
    backgroundColor: colors.neutral[0],
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  qr: { width: "100%", height: "100%" },
  actions: {
    marginTop: 30,
    width: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 20,
  },
  userField: {
    alignItems: "flex-end",
  },
});