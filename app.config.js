export default {
  expo: {
    name: "Zults",
    slug: "snack-56e4b4f5-f1e0-4ec3-b012-82d267abd500",
    version: "8.0.0",
    orientation: "portrait",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/icon.png",
      resizeMode: "contain",
      backgroundColor: "#000000",
    },
    ios: {
      bundleIdentifier: "com.ewellness.zults.v5demo",
      buildNumber: "13",
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSContactsUsageDescription:
          "Zults needs access to your contacts so you can invite friends via SMS.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#000000",
      },
      edgeToEdgeEnabled: true,
    },
    runtimeVersion: { policy: "appVersion" },
    extra: {
      // 👇 This pulls from your EAS “Secret” OPENAI_API_KEY at build time
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      eas: { projectId: "57c6a6c9-ac62-4765-9974-7dba98dd44e2" },
    },
    updates: {
      url: "https://u.expo.dev/57c6a6c9-ac62-4765-9974-7dba98dd44e2",
    },
  },
};
