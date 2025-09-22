import React from 'react';
import { View, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { colors } from '../../../../theme';
import UserProfileHeader from '../../../ui/UserProfileHeader';
import RezultsCardPlaceholder from '../../../ui/RezultsCardPlaceholder';
import ActivitiesHeader from '../../../ui/ActivitiesHeader';
import ActivityRow from '../../../ui/ActivityRow';
import NotificationCard from '../../../ui/NotificationCard';
import VerifiedBadge from '../../../ui/VerifiedBadge';
import ZultsButton from '../../../ui/ZultsButton';
import ScreenWrapper from '../../../ui/ScreenWrapper';

import melany from '../../../../assets/images/melany.png';
import goodguy from '../../../../assets/images/goodguy.png';
import madman from '../../../../assets/images/madman.png';

export default function MainVerifiedNoRezults() {
  return (
    <ScreenWrapper>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.surface1} />
      <UserProfileHeader badge={<VerifiedBadge />} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <RezultsCardPlaceholder />

        <ZultsButton
          label="Share"
          type="primary"
          size="large"
          onPress={() => {}}
        />

        <View style={{ marginTop: 15 }}>
          <ActivitiesHeader hasUnread />
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
