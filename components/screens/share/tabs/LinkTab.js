import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Animated,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../../theme";
import ZultsButton from "../../../ui/ZultsButton";
import { rezultsCache } from "../../../../cache/rezultsCache";
import NoRezultsModal from "../../../ui/NoRezultsModal"; // ✅ reuse existing modal

export default function LinkTab() {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [linkActive, setLinkActive] = useState(false);
  const [link, setLink] = useState("");
  const [toast, setToast] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  // ✅ Pulse animation for Online status dot
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (linkActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [linkActive]);

  const handleGenerateLink = () => {
    if (rezultsCache.hasRezults) {
      const generated = "https://myrezults.com/share/1234";
      setLink(generated);
      setLinkActive(true);
    } else {
      setShowModal(true);
    }
  };

  const handleStopSharing = () => {
    setLink("");
    setLinkActive(false);
  };

  const handleCopyAndShare = async () => {
    if (!link) return;
    await Clipboard.setStringAsync(link);

    // ✅ Show toast
    setToast("Link copied!");
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // ✅ Trigger native share sheet
    try {
      await Share.share({
        message: `Here’s my Rezults link: ${link}`,
        url: link,
        title: "My Rezults",
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  return (
    <View style={styles.content}>
      {/* Share-link card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Share-link</Text>
          <View style={styles.statusPill}>
            <Animated.View
              style={[
                styles.statusDot,
                {
                  backgroundColor: linkActive ? "#00D775" : "#FA5F21",
                  transform: [{ scale: linkActive ? pulseAnim : 1 }],
                },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: linkActive ? "#00D775" : "#FA5F21" },
              ]}
            >
              {linkActive ? "Online" : "Offline"}
            </Text>
          </View>
        </View>

        {!linkActive ? (
          <ZultsButton
            label="Generate New Link"
            type="primary"
            size="large"
            fullWidth
            onPress={handleGenerateLink}
          />
        ) : (
          <View>
            {/* ✅ Link row as full touch area */}
            <TouchableOpacity
              style={styles.linkBox}
              onPress={handleCopyAndShare}
            >
              <Text
                style={styles.linkText}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {link}
              </Text>
            </TouchableOpacity>

            <ZultsButton
              label="Disable Link"
              type="secondary"
              size="large"
              fullWidth
              onPress={handleStopSharing}
              style={{ marginTop: 16 }}
            />
          </View>
        )}
      </View>

      {/* ✅ Reuse shared modal */}
      <NoRezultsModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onGetRezults={() => {
          setShowModal(false);
          navigation.navigate("GetRezultsProvider");
        }}
      />

      {/* Toast */}
      {toast ? (
        <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.background.surface3,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#292929",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    ...typography.captionSmallRegular,
  },
  linkBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginTop: 8,
  },
  linkText: {
    ...typography.bodySmall,
    color: colors.foreground.default,
  },
  toast: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toastText: {
    ...typography.captionSmallRegular,
    backgroundColor: "#333",
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
