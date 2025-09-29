// components/screens/intro/IntroVideoScreen.js
import React, { useRef, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { Video } from "expo-av";
import { colors, typography } from "../../../theme";

export default function IntroVideoScreen({ navigation }) {
  const videoRef = useRef(null);

  // Navigate to main screen when video finishes
  const handleVideoEnd = () => {
    navigation.replace("MainScreen"); // ✅ registered in App.js
  };

  // Safety timeout fallback (in case onEnd isn't triggered)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("MainScreen");
    }, 6000); // adjust to actual video length
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require("../../../assets/videos/Logo.mp4")}
        style={styles.video}
        resizeMode="cover"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          if (status.didJustFinish) {
            handleVideoEnd();
          }
        }}
      />

      {/* Skip button for testing */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("MainScreen")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  skipButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  skipText: {
    ...typography.buttonSmallRegular,
    color: colors.neutral[0],
  },
});