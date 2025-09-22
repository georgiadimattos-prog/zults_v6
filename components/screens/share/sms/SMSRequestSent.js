import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../../../theme';
import successImage from '../../../../assets/images/SentSMSOK.png';
import ScreenWrapper from '../../../ui/ScreenWrapper';

export default function SMSRequestSent() {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.popToTop();
    }, 9000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ScreenWrapper horizontalPadding={24} topPadding={0}>
      <Video
        source={require('../../../../assets/videos/Sent.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />

      <View style={styles.overlay}>
        <View style={styles.imageWrapper}>
          <Image source={successImage} style={styles.image} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Sent!</Text>
        <Text style={styles.subtitle}>
          You’ll be able to send another anonymous SMS in one week.
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: 40,
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 240,
  },
  image: {
    width: 240,
    height: 240,
  },
  title: {
    ...typography.largeTitleMedium,
    color: colors.neutral[0],
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    textAlign: 'left',
    lineHeight: 20,
  },
});
