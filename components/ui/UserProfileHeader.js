import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography } from '../../theme';
import settingsIcon from '../../assets/images/settings.png';
import tomas from '../../assets/images/tomas.png';
import GetVerifiedBadge from '../ui/GetVerifiedBadge';
import { useNavigation } from "@react-navigation/native";

export default function UserProfileHeader({ hideVerification = false }) {
  const navigation = useNavigation(); // ✅ hook for navigation

  return (
    <View style={styles.header}>
      <Image source={tomas} style={styles.avatar} />
      <View style={styles.profileInfo}>
        <Text style={styles.name}>Jonster</Text>
        {/* ✅ Only show the badge if not hidden */}
        {!hideVerification && <GetVerifiedBadge />}
      </View>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate("Settings")} // ✅ go to SettingsScreen
      >
        <View style={styles.settingsIconContainer}>
          <Image
            source={settingsIcon}
            style={styles.settingsIconImage}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.surface1,
    zIndex: 10,
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  settingsButton: {
    padding: 4,
  },
  settingsIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIconImage: {
    width: 24,
    height: 24,
    tintColor: colors.neutral[0],
  },
});