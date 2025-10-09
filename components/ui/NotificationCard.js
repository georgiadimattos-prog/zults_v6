import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../theme";
import ZultsButton from "./ZultsButton";
import closeIcon from "../../assets/images/close-square.png";

export default function NotificationCard() {
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Notifications
        </Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Image source={closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text
        style={styles.text}
      >
        Get notified when someone sends you their Rezults or requests yours.
      </Text>

      {/* Button */}
      <ZultsButton
        label="Turn on notifications"
        type="primary"
        size="small"
        fullWidth={false}
        style={{ marginTop: 8, alignSelf: "flex-start" }}
        onPress={() => navigation.navigate("Settings")}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.surface2,
    borderRadius: 20,
    padding: 20,
    marginTop: 20, // rhythm match with Activities / ExpireContainer
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
  ...typography.headlineMedium,
  fontSize: 16,
  lineHeight: 21,
  color: colors.foreground.default,
},
  closeButton: {
    width: 24,
    height: 24,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: colors.foreground.muted,
  },
  text: {
  ...typography.captionLargeRegular,
  fontSize: 15,        // 🔹 +1 pt optical adjustment
  lineHeight: 18,
  color: 'rgba(255,255,255,0.6)',
},
});
