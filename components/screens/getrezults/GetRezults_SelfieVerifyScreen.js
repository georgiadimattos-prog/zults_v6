import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ScreenFooter from "../../ui/ScreenFooter";
import ZultsButton from "../../ui/ZultsButton";

export default function GetRezults_SelfieVerifyScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef(null);

  const handleCapture = async () => {
  if (!cameraRef.current) return;
  setIsCapturing(true);
  try {
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,
      base64: false,
    });

    // ✅ Create a FormData object for the file upload
    const data = new FormData();
    data.append("selfie", {
      uri: photo.uri,
      type: "image/jpeg",
      name: "selfie.jpg",
    });

    // ✅ Send selfie file to backend
    const res = await fetch("https://api-demo.myrezults.com/selfie-verify", {
      method: "POST",
      body: data, // no JSON headers for FormData
    });

    const text = await res.text(); // read raw response
    console.log("Server response:", text);

    let result;
    try {
      result = JSON.parse(text); // try parsing JSON safely
    } catch {
      throw new Error("Invalid JSON response from server");
    }

    if (result.match) {
  Alert.alert(
    "Verification complete",
    "Your selfie was uploaded successfully!",
    [
      {
        text: "OK",
        onPress: () => {
          // 🔁 Go to the same flow as providers: show Loading → AddRezultsCard
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "GetRezultsLoading",
                params: {
                  providerId: "manual", // you can display “Manual Upload” card
                  resultsLink: "manual_upload", // placeholder link
                },
              },
            ],
          });
        },
      },
    ]
  );
} else {
  Alert.alert(
    "Verification failed",
    "We couldn’t confirm your identity. Please try again."
  );
}
  } catch (err) {
    console.error("Selfie error:", err);
    Alert.alert("Error", "Something went wrong during selfie verification.");
  } finally {
    setIsCapturing(false);
  }
};

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Text style={styles.title}>Camera access needed</Text>
          <ZultsButton label="Allow Camera" onPress={requestPermission} type="primary" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper topPadding={0} style={{ backgroundColor: colors.background.surface1 }}>
      <View style={styles.content}>
        <Text style={styles.title}>Final Step: Verify your identity</Text>
        <Text style={styles.subtitle}>
          Please take a quick selfie so we can verify that your ID matches you.
        </Text>
      </View>

      <CameraView
  ref={cameraRef}
  style={styles.camera}
  facing="front"
  onCameraReady={() => setCameraReady(true)}
/>

      <ScreenFooter>
        <ZultsButton
          label={isCapturing ? "Verifying..." : "Take Selfie"}
          onPress={handleCapture}
          disabled={!cameraReady || isCapturing}
          fullWidth
          type="primary"
        />
        {isCapturing && <ActivityIndicator color={colors.foreground.muted} style={{ marginTop: 10 }} />}
      </ScreenFooter>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 20,
  },
  cameraWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
