import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Pressable } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 32;
const cardHeight = cardWidth / 1.586;

export default function RezultsCardPlaceholder() {
  const navigation = useNavigation();
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={() => navigation.navigate('GetRezultsSelectProvider')}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ alignItems: 'center' }}
    >
      <Animated.View
        style={[
          styles.wrapper,
          { width: cardWidth, height: cardHeight, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Svg height={cardHeight} width={cardWidth} style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#FFCEB2" />
              <Stop offset="50%" stopColor="#FC8CFF" />
              <Stop offset="100%" stopColor="#4D4CFF" />
            </LinearGradient>
          </Defs>
          <AnimatedRect
            x="1"
            y="1"
            rx="20"
            ry="20"
            width={cardWidth - 2}
            height={cardHeight - 2}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="10,10"
            strokeOpacity={glowAnim} // 👈 animated pulse
          />
        </Svg>

        <View style={styles.content}>
          <Text style={styles.title}>Tap to add your Rezults  ›</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    ...typography.headlineMedium,
    color: colors.foreground.default,
    textAlign: 'center',
  },
});
