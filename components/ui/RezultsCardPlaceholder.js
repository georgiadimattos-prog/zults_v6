import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../theme';
import ZultsButton from './ZultsButton';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 32; // 16px padding on each side
const cardHeight = cardWidth / 1.586; // classic credit card ratio

export default function RezultsCardPlaceholder() {
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
        <Text style={styles.title} allowFontScaling>
          No Rezults yet
        </Text>
        <Text style={styles.subtitle} allowFontScaling>
          Tap here to get started!
        </Text>
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
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
  ...typography.bodyMedium, // ✅ this one’s usually fine
  color: colors.foreground.default,
},
subtitle: {
  ...typography.bodyRegular, // ⬅️ swap from captionSmallRegular
  color: colors.foreground.soft,
  textAlign: 'center',
},
});
