import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../theme';

export default function ActivitiesHeader({ hasUnread }) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Text style={styles.title}>Activities</Text>
        {hasUnread && <View style={styles.dot} />}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
        <Text style={styles.viewAll}>View All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.title4Medium,
    color: colors.foreground.default,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F13636',
    marginLeft: 4,
    marginTop: -8,
  },
  viewAll: {
    ...typography.captionMedium,
    color: colors.neutral[0],
  },
});
