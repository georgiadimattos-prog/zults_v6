import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Animated, 
  Dimensions, 
  Image 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ScreenWrapper from '../../ui/ScreenWrapper';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 32;
const cardHeight = cardWidth / 1.586;

const STATUS_MESSAGES = [
  'Connecting…',
  'Syncing results…',
  'Creating your Rezults…',
];

export default function GetRezults_LoadingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { providerId, resultsLink } = route.params;

  const [step, setStep] = useState(0);

  // Progressive fill animation synced to steps
  const fillAnim = useRef(new Animated.Value(0)).current;

  // Dot animations (bounce + fade)
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Animate fill when step changes
  useEffect(() => {
    const target = (step + 1) / STATUS_MESSAGES.length; // 1/3, 2/3, 1
    Animated.timing(fillAnim, {
      toValue: target,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [step]);

// ✅ Step progression with manual upload detection
useEffect(() => {
  let current = 0;
  const interval = setInterval(() => {
    current += 1;
    if (current < STATUS_MESSAGES.length) {
      setStep(current);
    } else {
      clearInterval(interval);

      // ✅ Detect if this came from manual upload (no link = manual)
      const fromManualUpload = !resultsLink; // true if no resultsLink

      navigation.navigate("AddRezultsCard", {
        providerId,
        resultsLink,
        fromManualUpload, // 👈 flag for AddRezultsCardScreen
      });
    }
  }, 2000);

  return () => clearInterval(interval);
}, [navigation, providerId, resultsLink]);

  // Animate dots in sequence
  useEffect(() => {
    const animateDot = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(dot, { toValue: -4, duration: 400, delay, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          ]),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, [dot1, dot2, dot3]);

  // Fill width synced to step
  const fillWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, cardWidth],
  });

  return (
    <ScreenWrapper horizontalPadding={0} topPadding={0}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrapper}>
          {/* Grey fill behind frosted glass */}
          <Animated.View style={[styles.progressFill, { width: fillWidth }]}>
            <LinearGradient
  colors={[colors.background.surface1, "#1A1A1A"]}
  start={{ x: 0, y: 0.5 }}
  end={{ x: 1, y: 0.5 }}
  style={StyleSheet.absoluteFill}
/>
          </Animated.View>

          {/* Frosted glass layer */}
          <BlurView intensity={40} tint="dark" style={styles.cardContainer}>
            {/* Noise overlay */}
            <Image
              source={require('../../../assets/images/noise.png')}
              style={{
                position: 'absolute',
                width: cardWidth,
                height: cardHeight,
                opacity: 0.08,
              }}
              resizeMode="cover"
            />

            {/* Content */}
            <View style={styles.content}>
              {/* 3-dot animation */}
              <View style={styles.dotsContainer}>
                <Animated.View
                  style={[styles.dot, { transform: [{ translateY: dot1 }], opacity: dot1 }]}
                />
                <Animated.View
                  style={[styles.dot, { transform: [{ translateY: dot2 }], opacity: dot2 }]}
                />
                <Animated.View
                  style={[styles.dot, { transform: [{ translateY: dot3 }], opacity: dot3 }]}
                />
              </View>

              {/* Status text */}
              <Text style={styles.titleText}>{STATUS_MESSAGES[step]}</Text>
            </View>
          </BlurView>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
  flexGrow: 1,
  justifyContent: 'center',  // centers vertically
  alignItems: 'center',      // centers horizontally
},
  cardWrapper: {
    width: cardWidth,
    height: cardHeight,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9776E6',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  cardContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: colors.neutral[0],
  },
  titleText: {
    ...typography.bodyMedium,
    color: colors.neutral[0],
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
});
