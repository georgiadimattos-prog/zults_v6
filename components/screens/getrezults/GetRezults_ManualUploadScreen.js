import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
// 👇 updated import: includes useRoute now
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, typography } from "../../../theme";
import ScreenWrapper from "../../ui/ScreenWrapper";
import ScreenFooter from "../../ui/ScreenFooter";
import { NavbarBackRightText } from "../../ui/Navbar";
import ZultsButton from "../../ui/ZultsButton";
import { rezultsCache } from "../../../cache/rezultsCache";

export default function GetRezults_ManualUploadScreen() {
  const navigation = useNavigation();
  const route = useRoute(); // 👈 this line fixes “Property 'route' doesn’t exist”

  // ✅ dynamic provider mapping
  const { providerId } = route.params || {};
  const PROVIDERS = {
    randox: "Randox Health",
    demolab: "DemoLab",
    testme: "TestMe",
    testforme: "TestForMe",
    shl: "Sexual Health London",
    sh24: "SH:24",
    shuk: "SH.UK",
    soapoli: "Soapoli-Online",
    plannedparenthood: "Planned Parenthood",
    openhouse: "Open House",
    luud: "Luud Health",
  };
  const provider = PROVIDERS[providerId?.toLowerCase()] || "DemoLab";
  
  const [resultFile, setResultFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = async (type) => {
    try {
      const file = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
      });
      if (file.canceled) return;
      const selected = file.assets[0];

      if (type === "result") setResultFile(selected);
      if (type === "id") setIdFile(selected);
    } catch (err) {
      Alert.alert("Error", "Couldn't open file picker.");
    }
  };

  const handleSubmit = async () => {
    if (!resultFile || !idFile) {
      Alert.alert("Missing files", "Please upload both your test result and your ID.");
      return;
    }

    try {
      setUploading(true);

      // 🪄 Step 1: Get upload URL for result
      const res1 = await fetch("https://api-demo.myrezults.com/upload-url");
      const { url: url1, key: key1 } = await res1.json();
      const blob1 = await (await fetch(resultFile.uri)).blob();

      await fetch(url1, {
        method: "PUT",
        body: blob1,
        headers: { "Content-Type": resultFile.mimeType || "application/pdf" },
      });

      // 🪄 Step 2: Get upload URL for ID
      const res2 = await fetch("https://api-demo.myrezults.com/upload-url");
      const { url: url2, key: key2 } = await res2.json();
      const blob2 = await (await fetch(idFile.uri)).blob();

      await fetch(url2, {
        method: "PUT",
        body: blob2,
        headers: { "Content-Type": idFile.mimeType || "image/jpeg" },
      });

      // 🪄 Step 3: Tell backend to create manual review task
      await fetch("https://api-demo.myrezults.com/manual-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resultKey: key1,
          idKey: key2,
          mimeTypes: {
            result: resultFile.mimeType,
            id: idFile.mimeType,
          },
        }),
      });

      // 🪄 Step 4: Short delay to ensure S3 has finished processing
      await new Promise((resolve) => setTimeout(resolve, 9000));

// ✅ Step 5: Trigger verification directly on AWS (with debug log)
try {
  console.log("🔑 Sending fileKey:", key1);

  // ✅ Wait a moment to ensure S3 has fully stored the file
  console.log("⏳ Waiting 9s to allow S3 file propagation...");
  await new Promise(resolve => setTimeout(resolve, 9000));

  // Check if this flow was triggered by a provider link or manual upload
  const isDemoLink = route.params?.providerLink === true;

  // ✅ Hardcode for now — we’ll restore dynamic provider later
  const providerName = "testme";

  console.log("📦 Sending to backend:", { provider: providerName, fileKey: key1 });
  const verifyRes = await fetch("https://api-demo.myrezults.com/verify-provider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: providerName,
      providerLink: isDemoLink,
      fileKey: key1,   // ✅ Correct key name
    }),
  });

  const rawText = await verifyRes.text();
  console.log("🧾 Raw response from AWS:", rawText);

  let verifyData;
  try {
    verifyData = JSON.parse(rawText);
  } catch (err) {
    console.error("❌ Could not parse JSON:", err);
    Alert.alert("Server Error", "AWS returned an unexpected response (see console).");
    return;
  }

  console.log("✅ Parsed verification result:", verifyData);

  // Save only real uploads (not demo link)
  if (verifyData.ok && verifyData.rezultsCard && !isDemoLink) {
    rezultsCache.hasRezults = true;
    rezultsCache.card = {
      realName: verifyData.rezultsCard.front.full_name,
      providerName: verifyData.rezultsCard.front.provider,
      testDate: verifyData.rezultsCard.back.test_date,
      isVerified: true,
      showRealName: true,
    };
    console.log("💾 Updated rezultsCache:", rezultsCache);
  }

if (verifyData.ok) {
  Alert.alert(
    "Verified!",
    `Document recognised with trust score: ${verifyData.score || "N/A"}%`
  );
} else {
  Alert.alert(
    "Verification Warning",
    verifyData.message || "Document may need manual review."
  );
}
} catch (verifyErr) {
  console.error("Template check failed:", verifyErr);
  Alert.alert("Warning", "Could not verify the document automatically.");
}

// ✅ Instead of going to selfie verify, go to the Rezults Card screen
setTimeout(() => {
  navigation.navigate("AddRezultsCard", {
    providerId: provider,       // e.g. "testme", "randox", etc.
    fromManualUpload: true,     // 👈 tells AddRezultsCardScreen to show real extracted data
  });
}, 1000);

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScreenWrapper topPadding={0} style={{ backgroundColor: colors.background.surface1 }}>
      <NavbarBackRightText
        rightText="Help"
        onRightPress={() =>
          Alert.alert(
            "Manual Upload Help",
            "Please upload your test result PDF and a photo of your ID. We'll verify that your name matches before issuing your Rezults card."
          )
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Upload your Rezults manually</Text>
        <Text style={styles.subtitle}>
          If your provider isn’t listed, upload your test result and a photo ID.
          Rez will check your name and verify it matches.
        </Text>

        {/* Result upload */}
        <TouchableOpacity
          style={styles.uploadBlock}
          onPress={() => pickFile("result")}
          activeOpacity={0.8}
        >
          <Text style={styles.uploadLabel}>
            {resultFile ? "✅ Result uploaded" : "Upload your test result (PDF or image)"}
          </Text>
        </TouchableOpacity>

        {/* ID upload */}
        <TouchableOpacity
          style={styles.uploadBlock}
          onPress={() => pickFile("id")}
          activeOpacity={0.8}
        >
          <Text style={styles.uploadLabel}>
            {idFile ? "✅ ID uploaded" : "Upload your ID (passport, driving license...)"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.notice}>
          Your files are handled securely and deleted after manual verification.
        </Text>
      </ScrollView>

      <ScreenFooter>
        <ZultsButton
          label={uploading ? "Submitting..." : "Submit for Verification"}
          type="primary"
          size="large"
          fullWidth
          onPress={handleSubmit}
          disabled={uploading}
        />
      </ScreenFooter>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  title: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginTop: 32,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 32,
  },
  uploadBlock: {
    backgroundColor: colors.background.surface2,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  uploadLabel: {
    ...typography.headlineMedium,
    color: colors.foreground.default,
  },
  notice: {
    ...typography.subheadlineRegular,
    color: colors.foreground.muted,
    marginTop: 10,
  },
});
