import { useState, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export interface UseOrientationReturn {
  orientation: Orientation;
  isLandscape: boolean;
  isPortrait: boolean;
  width: number;
  height: number;
}

/**
 * Hook to track device orientation and auto-rotate state
 * Follows the specification from HOOKS.md
 */
export function useOrientation(): UseOrientationReturn {
  const { width, height } = useWindowDimensions();
  const [orientation, setOrientation] = useState<Orientation>(
    width > height ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const newOrientation = width > height ? 'landscape' : 'portrait';
    setOrientation(newOrientation);
  }, [width, height]);

  return {
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    width,
    height,
  };
}
