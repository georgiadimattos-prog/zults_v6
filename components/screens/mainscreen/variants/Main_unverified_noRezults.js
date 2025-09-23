import React from 'react';
import { View, ScrollView, StatusBar, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../../../theme';
import UserProfileHeader from '../../../ui/UserProfileHeader';
import RezultsCardPlaceholder from '../../../ui/RezultsCardPlaceholder';
import ActivitiesHeader from '../../../ui/ActivitiesHeader';
import ActivityRow from '../../../ui/ActivityRow';
import NotificationCard from '../../../ui/NotificationCard';
import ZultsButton from '../../../ui/ZultsButton';
import ScreenWrapper from '../../../ui/ScreenWrapper';

import melany from '../../../../assets/images/melany.png';
import goodguy from '../../../../assets/images/goodguy.png';
import madman from '../../../../assets/images/madman.png';

export default function MainUnverifiedNoRezults() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.surface1} />
      <UserProfileHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RezultsCardPlaceholder />

        <ZultsButton
          label="Share"
          type="primary"
          size="large"
          onPress={() => navigation.navigate('Share')}
        />

        <View style={{ marginTop: 15 }}>
          <ActivitiesHeader hasUnread />
          <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
            <Text style={{ color: colors.brand.purple1, marginTop: 8 }}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 8 }}>
          <ActivityRow title="Shares" users={[melany, goodguy, madman]} />
          <ActivityRow title="Requests" users={[melany, goodguy, madman]} />
          <ActivityRow title="Likes" users={[melany, goodguy, madman]} />
        </View>

        <NotificationCard />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    gap: 24,
  },
});
