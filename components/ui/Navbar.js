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
  title: {
    ...typography.title3Medium,
    color: colors.foreground.default,
    marginLeft: 8, // small breathing space after arrow
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
// Default Navbar: Back arrow + Title
//
export default function Navbar({ title, onBackPress }) {
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
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.spacer} />
    </View>
  );
}

//
// NavbarBackInvite: Back arrow + Title + Invite button
//
export function NavbarBackInvite({ title, onBackPress, onInvite }) {
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
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onInvite}>
        <Ionicons name="person-add" size={24} color={colors.foreground.default} />
      </TouchableOpacity>
    </View>
  );
}

//
// NavbarOptions: Title + Options (3 dots)
//
export function NavbarOptions({ title, onOptions }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
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
