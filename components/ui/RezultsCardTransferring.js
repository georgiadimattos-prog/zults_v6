import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, typography } from '../../theme';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 32; // 16px padding each side
const cardHeight = cardWidth / 1.586; // classic credit card ratio

export default function RezultsCardTransferring() {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.wrapper, { width: cardWidth, height: cardHeight }]}>
      <Svg height={cardHeight} width={cardWidth} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="19%" stopColor="#4817B2" />
            <Stop offset="36%" stopColor="#3FDBEA" />
            <Stop offset="49%" stopColor="#775DEC" />
            <Stop offset="63%" stopColor="#F200F3" />
            <Stop offset="77%" stopColor="#FA5F21" />
          </LinearGradient>
        </Defs>
        <Rect
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
        />
      </Svg>

      <View style={styles.content}>
        <Animated.Text style={[styles.icon, { opacity: pulse }]}>
          ⚡
        </Animated.Text>
        <Text style={styles.text}>Transferring…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 24,
  backgroundColor: '#000', // pure black background
  overflow: 'hidden',
},
fill: {
  position: 'absolute',
  left: 0,
  top: 0,
  backgroundColor: 'rgba(255,255,255,0.08)', // animated white layer only
},
  content: {
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 36,
    color: colors.neutral[0],
  },
  text: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
  },
});
