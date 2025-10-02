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
      navigation.navigate('MainScreen');
    }, 9000);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <ScreenWrapper topPadding={0} horizontalPadding={24}>
      <Video
        source={require('../../../../assets/videos/Sent.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        shouldPlay
        isLooping
        isMuted
      />

      <View style={styles.overlay}>
        <View style={styles.centerContent}>
          <Image
            source={successImage}
            style={styles.image}
            resizeMode="contain"
          />
          <Text
            style={styles.title}
            allowFontScaling={false}   // 🚫 fixed size title
          >
            Sent!
          </Text>
          <Text
            style={styles.subtitle}
            maxFontSizeMultiplier={1.2}  // ✅ capped scaling
          >
            You can send another SMS in one week.
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    ...typography.largeTitleMedium,
    color: colors.neutral[0],
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    textAlign: 'center',
    lineHeight: 20,
  },
});