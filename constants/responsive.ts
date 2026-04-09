import { Dimensions, Platform, ScaledSize } from 'react-native';

// Base dimensions which are used by getSize function
export const BASE_WIDTH = 375;
export const BASE_HEIGHT = 812;

// Breakpoints
export const BREAKPOINTS = {
  TABLET: 768,
  DESKTOP: 1024,
};

// Platforms
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

/**
 * Gets the effective width for scaling.
 * On Web/Desktop/Tablet, we apply conservative growth to prevent components from becoming massive.
 */
const getEffectiveWidth = () => {
  const { width } = Dimensions.get('window');
  
  if (width >= BREAKPOINTS.DESKTOP) {
    // Desktop: Fixed factor around 1.35x base mobile size
    return 375 * 1.35; 
  }
  
  if (width >= BREAKPOINTS.TABLET) {
    // Tablet: Fixed factor around 1.2x base mobile size
    return 375 * 1.2;
  }
  
  // Mobile scaling with safety bounds
  return Math.min(Math.max(width, 320), 480);
};

/**
 * Function to scale a value based on the size of the screen size and the original
 * size used on the design.
 */
export const scale = (size: number) => {
  const width = getEffectiveWidth();
  return (width / BASE_WIDTH) * size;
};

export const verticalScale = (size: number) => {
  const { height } = Dimensions.get('window');
  // Clamp height for scaling
  const effectiveHeight = Math.min(Math.max(height, 568), 900);
  return (effectiveHeight / BASE_HEIGHT) * size;
};

export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Listen to orientation changes
export const isPortrait = () => {
  const { width, height } = Dimensions.get('window');
  return height >= width;
};

export const isTablet = () => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  const isWide = width >= BREAKPOINTS.TABLET;
  return isWide || aspectRatio < 1.6;
};

export const isDesktop = () => {
  const { width } = Dimensions.get('window');
  return width >= BREAKPOINTS.DESKTOP;
};

// Responsive font size
export const responsiveFontSize = (fontSize: number) => {
  const { width } = Dimensions.get('window');
  
  let scaleFactor = 1;
  
  if (width >= BREAKPOINTS.DESKTOP) {
    scaleFactor = 1.35; 
  } else if (width >= BREAKPOINTS.TABLET) {
    scaleFactor = 1.2; 
  } else {
    // Mobile scaling factor
    scaleFactor = width / BASE_WIDTH;
    scaleFactor = Math.min(Math.max(scaleFactor, 0.94), 1.06);
  }
  
  return Math.round(fontSize * scaleFactor);
};

// Get responsive width (percentage based)
export const wp = (percentage: number) => {
  const { width } = Dimensions.get('window');
  const value = (percentage * width) / 100;
  return Math.round(value);
};

// Get responsive height (percentage based)
export const hp = (percentage: number) => {
  const { height } = Dimensions.get('window');
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
export const getScreenDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return {
    width,
    height,
    isPortrait: isPortrait(),
    isLandscape: !isPortrait(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    isWeb,
    isIOS,
    isAndroid,
  };
};
