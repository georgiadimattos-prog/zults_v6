import React from "react";

// ✅ Import screen variants
import MainUnverifiedNoRezults from "./variants/Main_unverified_noRezults";
import MainUnverifiedWithRezults from "./variants/Main_unverified_withRezults";
import MainVerifiedNoRezults from "./variants/Main_verified_noRezults";
import MainVerifiedWithRezults from "./variants/Main_verified_withRezults";

// ✅ Import Rezults cache
import { rezultsCache } from "../../../cache/rezultsCache";

export default function MainScreen() {
  // ✅ Read from cache (demo only for investors)
  const hasRezults = rezultsCache.hasRezults;
  const isVerified = false; // demo flag for now (later you can hook verification state here)

  if (!isVerified && !hasRezults) return <MainUnverifiedNoRezults />;
  if (!isVerified && hasRezults) return <MainUnverifiedWithRezults />;
  if (isVerified && !hasRezults) return <MainVerifiedNoRezults />;
  if (isVerified && hasRezults) return <MainVerifiedWithRezults />;

  return null;
}
