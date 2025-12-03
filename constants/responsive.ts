import { Dimensions, ScaledSize } from 'react-native';

// Base dimensions which are used by getSize function
export const BASE_WIDTH = 375;
export const BASE_HEIGHT = 812;

const { width, height } = Dimensions.get('window');

/**
 * Function to scale a value based on the size of the screen size and the original
 * size used on the design.
 */
export const scale = (size: number) => (width / BASE_WIDTH) * size;

export const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Listen to orientation changes
export const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

export const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  return aspectRatio < 1.6; // Common aspect ratio for tablets
};

// Responsive font size
export const responsiveFontSize = (fontSize: number) => {
  const scaleFactor = Math.min(width / BASE_WIDTH, 1.2); // Cap scaling at 1.2x
  return Math.round(fontSize * scaleFactor);
};

// Get responsive width (percentage based)
export const wp = (percentage: number) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

// Get responsive height (percentage based)
export const hp = (percentage: number) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};

// Listen to screen size changes
export const subscribeToDimensionChanges = (callback: (dims: { window: ScaledSize; screen: ScaledSize }) => void) => {
  const subscription = Dimensions.addEventListener('change', callback);
  return () => {
    subscription.remove();
  };
};

// Get screen dimensions
export const getScreenDimensions = () => ({
  width,
  height,
  isPortrait: isPortrait(),
  isLandscape: !isPortrait(),
  isTablet: isTablet(),
});
