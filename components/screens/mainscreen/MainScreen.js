// MainScreen.js
import React from "react";
import { useNavigation } from "@react-navigation/native";
import MainUnverifiedNoRezults from "./variants/Main_unverified_noRezults";
import MainUnverifiedWithRezults from "./variants/Main_unverified_withRezults";
import MainVerifiedNoRezults from "./variants/Main_verified_noRezults";
import MainVerifiedWithRezults from "./variants/Main_verified_withRezults";
import { rezultsCache } from "../../../cache/rezultsCache";

export default function MainScreen() {
  const navigation = useNavigation();
  const hasRezults = rezultsCache.hasRezults;
  const isVerified = false;

  // 👉 Back to original behavior: open Share tabs screen
  const handleLinkPress = () => {
    navigation.navigate("Share");
  };

  if (!isVerified && !hasRezults) {
    return <MainUnverifiedNoRezults onLinkPress={handleLinkPress} />;
  }
  if (!isVerified && hasRezults) {
    return <MainUnverifiedWithRezults onLinkPress={handleLinkPress} />;
  }
  if (isVerified && !hasRezults) {
    return <MainVerifiedNoRezults onLinkPress={handleLinkPress} />;
  }
  if (isVerified && hasRezults) {
    return <MainVerifiedWithRezults onLinkPress={handleLinkPress} />;
  }
  return null;
}
