import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';
import * as Contacts from "expo-contacts";
import { useInvite } from "./useInvite";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between', // space between left + right groups
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10, // 👈 arrow spacing
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16, // 👈 right-side spacing
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.foreground.default,
  },
  rightText: {
    ...typography.subtitleMedium,
    color: colors.info.onContainer,
  },
  backButton: {
    width: 44,   // ✅ Apple recommended tappable size
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//
// Default Navbar: Back arrow only
//
export default function Navbar({ onBackPress }) {
  const navigation = useNavigation();
  const { sendInvite } = useInvite(); // ✅ hook

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../../assets/images/navbar-arrow.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.right} /> 
    </View>
  );
}

//
// NavbarBackInvite: Back arrow + Invite icon
//
export function NavbarBackInvite({ onBackPress }) {
  const navigation = useNavigation();
  const { sendInvite } = useInvite(); // ✅ same hook as ShareScreen

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require("../../assets/images/navbar-arrow.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
  <TouchableOpacity
    onPress={sendInvite}
    style={{ paddingHorizontal: 8, paddingVertical: 6 }}
  >
    <Text
      style={{
        ...typography.subtitleMedium,
        color: colors.info.onContainer,
      }}
      numberOfLines={1}
      ellipsizeMode="tail"
      maxFontSizeMultiplier={1.3}
    >
      Invite
    </Text>
  </TouchableOpacity>
</View>
    </View>
  );
}

//
// NavbarOptions: Back arrow + 3 dots menu
//
export function NavbarOptions({ onBackPress, onOptions }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../../assets/images/navbar-arrow.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={onOptions} style={styles.backButton}>
          <Image
            source={require('../../assets/images/navbar-dots.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

//
// NavbarBackRightText: Back arrow + Right-side text
//
export function NavbarBackRightText({ onBackPress, rightText, onRightPress }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Left: back arrow */}
      <View style={styles.left}>
        <TouchableOpacity
          onPress={onBackPress || navigation.goBack}
          style={styles.backButton} // ✅ keep 44×44 for icon
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image
            source={require('../../assets/images/navbar-arrow.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Right: flexible text link */}
      <View style={styles.right}>
        <TouchableOpacity
          onPress={onRightPress}
          style={{ paddingHorizontal: 8, paddingVertical: 6 }} // ✅ flexible, not fixed size
        >
          <Text
  style={[styles.rightText, { textAlign: 'right' }]}
  numberOfLines={2}          // ✅ allow up to 2 lines
  ellipsizeMode="clip"       // ✅ no "..."
  maxFontSizeMultiplier={1.3}
  allowFontScaling={true}
>
  {rightText != null ? String(rightText) : ''}
</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//
// NavbarClose: Close (×) button on the right
//
export function NavbarClose({ onClose }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {/* empty left side (no back arrow) */}
      </View>

      <View style={styles.right}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={{ fontSize: 28, color: colors.foreground.default }}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
