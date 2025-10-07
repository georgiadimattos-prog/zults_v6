import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../theme";
import { useInvite } from "./useInvite";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    justifyContent: "space-between", // space between left + right groups
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10, // 👈 arrow spacing
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16, // 👈 right-side spacing
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.foreground.default,
  },
  backButton: {
    width: 44, // ✅ Apple recommended tappable size
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});

//
// Default Navbar: Back arrow only
//
export default function Navbar({ onBackPress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require("../../assets/images/navbar-arrow.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.right} />
    </View>
  );
}

//
// NavbarBackInvite → Back arrow + “Invite” text
//
export function NavbarBackInvite({ onBackPress }) {
  const navigation = useNavigation();
  const { sendInvite } = useInvite();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require("../../assets/images/navbar-arrow.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          onPress={sendInvite}
          style={{ paddingHorizontal: 8, paddingVertical: 6 }}
        >
          <Text
            style={[
              typography.bodyRegular, // ✅ unified token
              { color: colors.info.onContainer },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            Invite
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//
// NavbarOptions → Back arrow + 3-dot menu
//
export function NavbarOptions({ onBackPress, onOptions }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require("../../assets/images/navbar-arrow.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={onOptions} style={styles.backButton}>
          <Image
            source={require("../../assets/images/navbar-dots.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

//
// NavbarBackRightText → Back arrow + dynamic text link (e.g. “How to find your link?”)
//
export function NavbarBackRightText({ onBackPress, rightText, onRightPress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Left: back arrow */}
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require("../../assets/images/navbar-arrow.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Right: text action */}
      <View style={styles.right}>
        <TouchableOpacity
          onPress={onRightPress}
          style={{ paddingHorizontal: 8, paddingVertical: 6 }}
        >
          <Text
            style={[
              typography.bodyRegular, // ✅ same as Invite
              { color: colors.info.onContainer, textAlign: "right" },
            ]}
            numberOfLines={2}
            ellipsizeMode="clip"
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {rightText != null ? String(rightText) : ""}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//
// NavbarClose → Close (×) button
//
export function NavbarClose({ onClose }) {
  return (
    <View style={styles.container}>
      <View style={styles.left} />
      <View style={styles.right}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={{ fontSize: 28, color: colors.foreground.default }}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}