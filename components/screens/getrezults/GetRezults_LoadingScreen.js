import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Rect } from 'react-native-svg';
import { colors, typography } from '../../../theme';
import ScreenWrapper from '../../ui/ScreenWrapper';

import transferIcon from '../../../assets/images/rezults-icon.png';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 32;
const cardHeight = cardWidth / 1.586;

const STATUS_MESSAGES = [
  'Fetching medical report…',
  'Transferring information…',
  'Creating your Rezults…',
];

export default function GetRezults_LoadingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerId, resultsLink } = route.params;

  const [step, setStep] = useState(0);

  const fillAnim = useRef(new Animated.Value(0)).current; // 0 → empty, 1 → full
  const pulse = useRef(new Animated.Value(1)).current;

  // Pulse for the icon
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.6, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  // Step progression
  useEffect(() => {
    // Animate fill over 3 stages
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 5000, // full duration of loading
      useNativeDriver: false,
    }).start();

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < STATUS_MESSAGES.length) {
        setStep(current);
      } else {
        clearInterval(interval);
        navigation.navigate('AddRezultsCard', { providerId, resultsLink });
      }
    }, 1600); // 1s per step

    return () => clearInterval(interval);
  }, [fillAnim, navigation, providerId, resultsLink]);

  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, cardWidth],
  });

  return (
    <ScreenWrapper horizontalPadding={0} topPadding={0}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.wrapper, { width: cardWidth, height: cardHeight }]}>
          {/* White dashed border */}
          <Svg height={cardHeight} width={cardWidth} style={StyleSheet.absoluteFill}>
            <Rect
              x="1"
              y="1"
              rx="20"
              ry="20"
              width={cardWidth - 2}
              height={cardHeight - 2}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="10,10"
            />
          </Svg>

          {/* Animated fill layer */}
          <Animated.View
            style={[
              styles.fill,
              {
                width: fillWidth,
                height: cardHeight,
              },
            ]}
          />

          {/* Content above */}
          <View style={styles.content}>
            <Animated.Image
              source={transferIcon}
              style={[styles.iconImage, { opacity: pulse }]}
              resizeMode="contain"
            />
            <Text style={styles.text}>{STATUS_MESSAGES[step]}</Text>
          </View>
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
  wrapper: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: colors.background.surface1, // subtle fill
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  iconImage: {
    width: 56,
    height: 56,
    tintColor: colors.neutral[0],
    marginBottom: 8,
  },
  text: {
    ...typography.bodyRegular,
    color: colors.neutral[0],
    textAlign: 'center',
  },
});
