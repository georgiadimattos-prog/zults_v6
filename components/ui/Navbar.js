import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../theme';

export default function Navbar({ title, onBackPress }) {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress || navigation.goBack}>
        <Image
          source={require('../../assets/images/navbar-arrow.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: colors.foreground.default,
    marginRight: 12,
  },
  title: {
    ...typography.title3Medium,
    color: colors.foreground.default,
  },
});
