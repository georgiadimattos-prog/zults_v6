import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors, typography } from '../../theme';

export default function ActivityRow({ title, users }) {
  const visibleUsers = users.slice(0, 3);
  const extraCount = users.length > 3 ? `+${users.length - 3}` : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.pill}>
        {extraCount && <Text style={styles.extraCount}>{extraCount}</Text>}
        {visibleUsers.map((user, index) => (
          <View key={index} style={[styles.avatarWrapper, { left: index * 26 }]}>
            <Image source={user} style={styles.avatar} resizeMode="cover" />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.background.surface2,
    borderRadius: 15,
    marginBottom: 6,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: colors.background.surface4,
    height: 32,
    borderRadius: 12,
    paddingHorizontal: 24,
    minWidth: 95,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  extraCount: {
    ...typography.bodyLarge,
    color: colors.foreground.default,
    marginRight: 4,
    zIndex: 10,
  },
  avatarWrapper: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 48,
    borderWidth: 2.5,
    borderColor: colors.background.surface2,
    overflow: 'hidden',
    backgroundColor: colors.background.surface1,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
});