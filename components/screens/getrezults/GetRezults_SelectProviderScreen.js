import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography } from '../../../theme';
import ZultsButton from '../../ui/ZultsButton';
import ScreenWrapper from '../../ui/ScreenWrapper';
import ScreenFooter from '../../ui/ScreenFooter';
import Navbar from '../../ui/Navbar'; // ✅ add this at the top

import shlLogo from '../../../assets/images/SHL.png';
import randoxLogo from '../../../assets/images/Randox.png';
import nhsLogo from '../../../assets/images/NHS.png';

export default function GetRezults_SelectProviderScreen() {
  const navigation = useNavigation();
  const [selectedProvider, setSelectedProvider] = useState(null);

  const providers = [
    { id: 'shl', name: 'Sexual Health London', logo: shlLogo },
    { id: 'randox', name: 'Randox Health', logo: randoxLogo },
    { id: 'nhs', name: 'NHS', logo: nhsLogo },
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Navbar row */}
          <Navbar title="Select Provider" />

          {/* Page title + subtitle */}
          <Text allowFontScaling={false} style={styles.pageTitle}>
            Add Rezults
          </Text>
          <Text allowFontScaling={false} style={styles.subtitle}>
            To turn your STI results into Rezults, first select your test provider.
          </Text>

          {/* Horizontal Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {providers.map((provider) => {
              const isSelected = selectedProvider === provider.id;
              return (
                <TouchableOpacity
                  key={provider.id}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => setSelectedProvider(provider.id)}
                >
                  <View style={styles.radioCircle}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Image
                    source={provider.logo}
                    style={styles.logo}
                    resizeMode="contain"
                  />
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
  pageTitle: {
    ...typography.largeTitleMedium,
    color: colors.foreground.default,
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodyRegular,
    color: colors.foreground.soft,
    marginBottom: 24,
  },
  carousel: {
    paddingRight: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.background.surface2,
    borderRadius: 12,
    marginRight: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colors.neutral[0],
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
});
