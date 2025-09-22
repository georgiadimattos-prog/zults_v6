import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
      navigation.navigate('GetRezultsConfirm', { providerId, resultsLink });
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ScreenWrapper horizontalPadding={0} topPadding={0}>
      <View style={styles.center}>
        <Image source={transferIcon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.text}>Transfering…</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
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
