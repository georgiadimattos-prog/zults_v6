// theme/typography.js
import { fonts } from "./fonts";
import colors from "./colors";

export const typography = {
  // ─── Large Titles ─────────────────────────────────────
  largeTitleMedium: {
    fontFamily: fonts.medium,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.64,
    includeFontPadding: false,
    color: colors.foreground.default,
  },
  largeTitleRegular: {
    fontFamily: fonts.regular,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.64,
    includeFontPadding: false,
    color: colors.foreground.default,
  },

  // ─── Titles ───────────────────────────────────────────
  title1Medium: { fontFamily: fonts.medium, fontSize: 28, lineHeight: 34, letterSpacing: -0.28 },
  title1Regular:{ fontFamily: fonts.regular,fontSize: 28,lineHeight: 34,letterSpacing: -0.28 },
  title2Medium: { fontFamily: fonts.medium, fontSize: 24, lineHeight: 28, letterSpacing: -0.24 },
  title2Regular:{ fontFamily: fonts.regular,fontSize: 24,lineHeight: 28,letterSpacing: -0.24 },
  title3Medium: { fontFamily: fonts.medium, fontSize: 20, lineHeight: 24, letterSpacing: -0.20 },
  title3Regular:{ fontFamily: fonts.regular,fontSize: 20,lineHeight: 24,letterSpacing: -0.20 },
  title4Medium: { fontFamily: fonts.medium, fontSize: 18, lineHeight: 24, letterSpacing: -0.18 },
  title4Regular:{ fontFamily: fonts.regular,fontSize: 18,lineHeight: 24,letterSpacing: -0.18 },

  // ─── Headlines ────────────────────────────────────────
  headlineMedium:{
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.08,
    includeFontPadding: false,
  },
  headlineRegular:{
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.08,
    includeFontPadding: false,
  },

  // ─── Body ─────────────────────────────────────────────
  bodyMedium:{
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    includeFontPadding: false,
    color: colors.foreground.soft,
  },
  bodyRegular:{
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    includeFontPadding: false,
    color: colors.foreground.soft,
  },

  // ─── Subheadline ──────────────────────────────────────
  subheadlineMedium:{
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.07,
    includeFontPadding: false,
  },
  subheadlineRegular:{
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.07,
    includeFontPadding: false,
  },

  // ─── Captions ─────────────────────────────────────────
  captionLargeMedium:{
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.07,
    includeFontPadding: false,
  },
  captionLargeRegular:{
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.07,
    includeFontPadding: false,
  },
  captionSmallMedium:{
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.06,
    includeFontPadding: false,
  },
  captionSmallRegular:{
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.06,
    includeFontPadding: false,
  },

  // ─── Buttons ──────────────────────────────────────────
  buttonLargeMedium:{
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  buttonLargeRegular:{
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 20,
  },
  buttonSmallMedium:{
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },
  buttonSmallRegular:{
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 18,
  },

  // ─── Input Text ───────────────────────────────────────
  inputText:{
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0,
    includeFontPadding: false,
    color: colors.foreground.default,
  },
};