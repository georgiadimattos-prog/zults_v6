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

  // ✅ Keep Share button behavior unchanged
  const handleSharePress = () => {
    navigation.navigate("Share");
  };

  // ✅ Updated Link button behavior
  const handleLinkPress = () => {
    navigation.navigate("LinkOffline"); // always go here
  };

  if (!isVerified && !hasRezults) {
    return (
      <MainUnverifiedNoRezults
        onSharePress={handleSharePress}
        onLinkPress={handleLinkPress}
      />
    );
  }
  if (!isVerified && hasRezults) {
    return (
      <MainUnverifiedWithRezults
        onSharePress={handleSharePress}
        onLinkPress={handleLinkPress}
      />
    );
  }
  if (isVerified && !hasRezults) {
    return (
      <MainVerifiedNoRezults
        onSharePress={handleSharePress}
        onLinkPress={handleLinkPress}
      />
    );
  }
  if (isVerified && hasRezults) {
    return (
      <MainVerifiedWithRezults
        onSharePress={handleSharePress}
        onLinkPress={handleLinkPress}
      />
    );
  }
  return null;
}
