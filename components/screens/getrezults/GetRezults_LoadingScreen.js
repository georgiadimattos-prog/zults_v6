import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ScreenWrapper from '../../ui/ScreenWrapper';

// Use your own loading animation if available
import transferIcon from '../../../assets/images/transfering-icon.png';

export default function GetRezults_LoadingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerId, resultsLink } = route.params;

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('AddRezultsCard', { providerId, resultsLink });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [navigation, providerId, resultsLink]);

  return (
    <ScreenWrapper horizontalPadding={0} topPadding={0}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.center}>
          <Image source={transferIcon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.text}>Transferring…</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  center: {
    alignItems: 'center',
  },
  icon: {
    width: 72,
    height: 72,
    tintColor: colors.foreground.soft,
    marginBottom: 24,
  },
  text: {
    ...typography.bodyRegular,
    color: colors.foreground.default,
  },
});
