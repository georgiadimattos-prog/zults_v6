import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,   // ✅ add this here
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ZultsButton from '../../ui/ZultsButton';
import ScreenWrapper from '../../ui/ScreenWrapper';
import ScreenFooter from '../../ui/ScreenFooter';
import Navbar from '../../ui/Navbar'; // ✅ add this at the top
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import shlLogo from '../../../assets/images/SHL.png';
import randoxLogo from '../../../assets/images/Randox.png';
import nhsLogo from '../../../assets/images/NHS.png';

export default function GetRezults_SelectProviderScreen() {
  const navigation = useNavigation();
  const [selectedProvider, setSelectedProvider] = useState(null);

  const providers = [
    { id: 'shl', name: 'Sexual Health London', logo: shlLogo },
    { id: 'randox', name: 'Randox Health', logo: randoxLogo },
    { id: 'pp', name: 'Planned Parenthood', logo: nhsLogo },
  ];

  const handleContinue = () => {
    if (!selectedProvider) return;
    navigation.navigate('GetRezultsLinkInput', { providerId: selectedProvider });
  };

  return (
  <ScreenWrapper topPadding={0}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Navbar always visible */}
      <Navbar />

      {/* Scrollable content */}
      <ScrollView
  contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: 120 }]}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
>
        {/* Page title + subtitle */}
        <View style={styles.headerBlock}>
          <Text allowFontScaling={false} style={styles.pageTitle}>
            Add Rezults
          </Text>
          <Text allowFontScaling={false} style={styles.subtitle}>
            Select your test provider to continue.
          </Text>
        </View>

        {/* Horizontal Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {providers.map((provider) => {
            const isSelected = selectedProvider === provider.id;
            const scaleAnim = useRef(new Animated.Value(1)).current;

            const handlePress = () => {
              Haptics.selectionAsync();

              Animated.sequence([
                Animated.spring(scaleAnim, {
                  toValue: 1.05,
                  useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                  toValue: 1,
                  friction: 5,
                  tension: 40,
                  useNativeDriver: true,
                }),
              ]).start();

              setSelectedProvider(provider.id);
            };

            return (
              <TouchableOpacity
                key={provider.id}
                activeOpacity={0.9}
                onPress={handlePress}
              >
                <Animated.View
                  style={[
                    styles.card,
                    { transform: [{ scale: scaleAnim }] },
                    isSelected && styles.cardSelected,
                  ]}
                >
                  {/* Frosted blur background */}
                  <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />

                  {/* Radio indicator */}
                  <View style={styles.radioCircle}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>

                  {/* Provider logo */}
                  <Image
                    source={provider.logo}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Footer with Continue button */}
      <ScreenFooter>
        <ZultsButton
          label="Continue"
          type="primary"
          size="large"
          fullWidth
          disabled={!selectedProvider}
          onPress={handleContinue}
        />
      </ScreenFooter>
    </KeyboardAvoidingView>
  </ScreenWrapper>
);

}

const CARD_WIDTH = 180;
const CARD_HEIGHT = 120;

const styles = StyleSheet.create({
  headerBlock: {
  marginTop: 32,
  marginBottom: 40,
},
  pageTitle: {
  ...typography.largeTitleMedium, // now updated in theme to 34/41
  color: colors.foreground.default,
  marginBottom: 6,
},
  subtitle: {
    ...typography.bodyRegular,
    fontSize: 16,
    color: colors.foreground.soft,
    marginBottom: 0,
  },
  carousel: {
    paddingRight: 8,
  },
  card: {
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  borderRadius: 20,   // bigger corners = more Apple
  marginRight: 12,
  padding: 20,
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden', // required for BlurView
  // soft shadow
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
},
cardSelected: {
  shadowColor: colors.brand.primary, // subtle glow on selection
  shadowOpacity: 0.25,
},
  logo: {
    width: 108,
    height: 60,
  },
  radioCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.neutral[0],
  },
  content: {
  paddingHorizontal: 16,   // ✅ consistent gutter
},
});
