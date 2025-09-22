import React from 'react';

// ✅ Import screen variants
import MainUnverifiedNoRezults from './variants/Main_unverified_noRezults';
import MainUnverifiedWithRezults from './variants/Main_unverified_withRezults';
import MainVerifiedNoRezults from './variants/Main_verified_noRezults';
import MainVerifiedWithRezults from './variants/Main_verified_withRezults';

export default function MainScreen() {
  // TEMPORARY: Simulated user state (replace with real auth/data later)
  const user = {
    isVerified: false,
    hasRezults: false,
  };

  if (!user.isVerified && !user.hasRezults) return <MainUnverifiedNoRezults />;
  if (!user.isVerified && user.hasRezults) return <MainUnverifiedWithRezults />;
  if (user.isVerified && !user.hasRezults) return <MainVerifiedNoRezults />;
  if (user.isVerified && user.hasRezults) return <MainVerifiedWithRezults />;

  return null;
}
