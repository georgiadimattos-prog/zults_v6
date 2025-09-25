import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingLeft: 0,
    paddingRight: 16,
    justifyContent: 'flex-start',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5, // ✅ consistent across all variants
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.foreground.default,
  },
  spacer: {
    width: 24,
  },
  rightText: {
    ...typography.bodyMedium,
    color: colors.info.onContainer,
  },
});

//
// Default Navbar: Back arrow only
//
export default function Navbar({ onBackPress }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity onPress={onBackPress || navigation.goBack}>
          <Image
            source={require('../../assets/images/navbar-arrow.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.spacer} />
    </View>
  );
}

//
// NavbarBackInvite: Back arrow + Invite icon
//
export function NavbarBackInvite({ onBackPress, onInvite }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity onPress={onBackPress || navigation.goBack}>
          <Image
            source={require('../../assets/images/navbar-arrow.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onInvite}>
        <Ionicons name="person-add" size={24} color={colors.foreground.default} />
      </TouchableOpacity>
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
        <TouchableOpacity onPress={onBackPress || navigation.goBack}>
          <Image
            source={require('../../assets/images/navbar-arrow.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onOptions}>
        <Image
          source={require('../../assets/images/navbar-dots.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

//
// NavbarBackRightText: Back arrow + Right-side text
//
export function NavbarBackRightText({ onBackPress, rightText, onRightPress }) {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, { justifyContent: 'space-between' }]}>
      {/* Left: back arrow */}
      <View style={styles.left}>
        <TouchableOpacity onPress={onBackPress || navigation.goBack}>
          <Image
            source={require('../../assets/images/navbar-arrow.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Right: text button */}
      <TouchableOpacity onPress={onRightPress}>
        <Text style={styles.rightText}>{rightText}</Text>
      </TouchableOpacity>
    </View>
  );
}
