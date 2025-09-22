import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { colors, typography } from '../../../theme';
import ActivityCard from '../../ui/ActivityCard';

export default function ActivitiesScreen({ navigation }) {
  const [tab, setTab] = useState('All');

  const handleActivityPress = (user) => {
    navigation.navigate('UserChat', { user });
  };

  const activityLog = [
    {
      id: '1',
      name: 'Binkey',
      avatar: require('../../../assets/images/photo-48.png'),
      message: 'Shared Rezults with you',
      date: '2h ago',
      unreadCount: 2,
    },
  ];

  const filtered =
    tab === 'Unread'
      ? activityLog.filter((a) => a.unreadCount > 0)
      : tab === 'Favorites'
      ? []
      : activityLog;

  const showEmptyState = tab === 'Favorites' && filtered.length === 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            user={{
              name: item.name,
              avatar: item.avatar,
              isVerified: true,
              message: item.message,
              date: item.date,
              unreadCount: item.unreadCount,
            }}
            onPress={() =>
              handleActivityPress({
                name: item.name,
                image: item.avatar,
                isVerified: true,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.surface1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: colors.foreground.default,
  },
  navTitle: {
    ...typography.bodyMedium,
    color: colors.foreground.default,
    marginLeft: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background.surface2,
    borderRadius: 200,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200,
  },
  tabActive: {
    backgroundColor: colors.neutral[0],
  },
  tabText: {
    ...typography.captionSmallRegular,
  },
  tabTextActive: {
    color: colors.button.activeLabelPrimary,
  },
  tabTextInactive: {
    color: colors.foreground.soft,
  },
  emptyStateWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    ...typography.captionSmallRegular,
    color: colors.foreground.soft,
  },
});