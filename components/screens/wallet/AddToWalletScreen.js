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
        duration: 320,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 320,
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
                    typography.labelSmall,
                    { color: colors.foreground.muted, marginBottom: 2 },
                  ]}
                >
                  Username
                </Text>
                <Text
                  style={[
                    typography.titleMedium,
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
                  typography.bodyMedium,
                  {
                    color: colors.foreground.soft,
                    marginBottom: 18,
                    textAlign: "center",
                    letterSpacing: 0.2,
                  },
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
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: colors.background.surface2,
    borderRadius: 24, // ✅ matches RezultsCard curvature
    borderWidth: 1,
    borderColor: colors.background.surface3,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 32,
  },
  logo: {
    width: 102,
    height: 36,
    alignSelf: "flex-start",
  },
  userField: {
    alignItems: "flex-end",
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
    borderRadius: 10, // ✅ aligned to RezultsCard geometry
    justifyContent: "center",
    alignItems: "center",
  },
  qr: {
    width: "100%",
    height: "100%",
  },
  actions: {
    marginTop: 40,
    width: "100%",
  },
});
