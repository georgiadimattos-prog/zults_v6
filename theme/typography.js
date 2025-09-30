import { fonts } from './fonts';

// 📝 Zults Design System button rules
// - Pill buttons → ONLY inside chat screen (e.g. "Share Rezults", "Request Rezults")
// - Standard ZultsButton (square/rounded corners) → everywhere else
// - Use size="medium" inside cards (e.g. NotificationCard, Activities)
// - Use size="large" for primary CTAs (e.g. Share, Get Rezults)


export const typography = {
  // Large Titles
  largeTitleMedium: {
    fontFamily: fonts.medium,
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: -0.5,
  },
  largeTitleRegular: {
    fontFamily: fonts.regular,
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: -0.5,
  },

  // Title 1
  title1Medium: {
    fontFamily: fonts.medium,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.28,
  },
  title1Regular: {
    fontFamily: fonts.regular,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.28,
  },

  // Title 2
  title2Medium: {
    fontFamily: fonts.medium,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.24,
  },
  title2Regular: {
    fontFamily: fonts.regular,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.24,
  },

  // Title 3
  title3Medium: {
    fontFamily: fonts.medium,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.20,
  },
  title3Regular: {
    fontFamily: fonts.regular,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.20,
  },

  // Title 4
  title4Medium: {
    fontFamily: fonts.medium,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.18,
  },
  title4Regular: {
    fontFamily: fonts.regular,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.18,
  },

  // Headline
  headlineMedium: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.08,
  },
  headlineRegular: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.08,
  },

  // Body
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  bodyRegular: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
  },

  // Subheadline
  subheadlineMedium: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.07,
  },
  subheadlineRegular: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.07,
  },

  // Caption Large
  captionLargeMedium: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.07,
  },
  captionLargeRegular: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: -0.07,
  },

  // Caption Small
  captionSmallMedium: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.06,
  },
  captionSmallRegular: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.06,
  },

  // Buttons
  buttonLargeMedium: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  buttonLargeRegular: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
  },
  buttonSmallMedium: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },
  buttonSmallRegular: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
  },
   buttonMediumMedium: {
    fontFamily: fonts.medium,
    fontSize: 15,     // in-between 16 (large) and 14 (small)
    lineHeight: 20,
  },
  buttonMediumRegular: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 20,
  },
};