export const colors = { 
  // Backgrounds
  background: {
     surface1: '#0E0E0E',  // 🔄 tiny bit darker than #101010
    surface2: '#1C1C1C',
    surface3: '#222222',
    screen: '#0B0B0B',
  },

  // Neutrals / white
  neutral: {
    0: '#FFFFFF',
    850: '#313131',
    900: '#1A1A1A',
  },

  // Foreground (text)
  foreground: {
    default: '#F5F5F5',
    soft: 'rgba(255,255,255,0.6)',
    disabled: 'rgba(255,255,255,0.4)',
    muted: 'rgba(255,255,255,0.35)',
  },

  // Info
  info: {
    container: '#1E1F47',
    onContainer: '#4D4CFF',
  },

  // Success
  success: {
    container: '#042F1D',
    onContainer: '#1DCA7A',
  },

  // Button label overrides
  button: {
    activeLabelPrimary: '#141414',
  },

  // Brand colors
  brand: {
    orange1: '#FF8D75',
    purple1: '#8C6CF0',
    accent: '#4D4CFF',   // ✅ new accent for links & inline actions
  },

  // Error
  error: {
    default: '#FB6E6E',
    container: '#3B1111',       // 🔴 background for destructive surfaces
    onContainer: '#FF4C4C',     // 🔴 icon/text inside error container
  },

  // Misc / neutral text placeholders
  neutralText: {
    label: '#999999',
    subtext: '#7B7B7B',
  },

  // Rezults Card specific
  cardRezults: {
    primary: '#F5F5F5',  // maps to foreground.default
    link: '#4D4CFF',     // maps to info.onContainer
  },
};

export default colors;
