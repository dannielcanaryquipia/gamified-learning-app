import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  margin: 20,

  // App dimensions
  width,
  height,

  // Font sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 16,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, lineHeight: 36, fontWeight: 'bold' },
  h2: { fontSize: SIZES.h2, lineHeight: 30, fontWeight: 'bold' },
  h3: { fontSize: SIZES.h3, lineHeight: 22, fontWeight: 'bold' },
  h4: { fontSize: SIZES.h4, lineHeight: 22, fontWeight: 'bold' },
  body1: { fontSize: SIZES.body1, lineHeight: 36 },
  body2: { fontSize: SIZES.body2, lineHeight: 30 },
  body3: { fontSize: SIZES.body3, lineHeight: 22 },
  body4: { fontSize: SIZES.body4, lineHeight: 20 },
  body5: { fontSize: SIZES.body5, lineHeight: 18 },
};

export const SHADOWS = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
