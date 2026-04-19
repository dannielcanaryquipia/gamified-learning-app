import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Platform } from 'react-native';

/**
 * Hook to blur any focused element when screen loses focus.
 * Fixes aria-hidden warning in React Native Web when navigated screens
 * retain focusable elements while being hidden from assistive tech.
 */
export function useFocusCleanup() {
  useFocusEffect(
    useCallback(() => {
      // Return cleanup function that runs when screen loses focus
      return () => {
        if (Platform.OS === 'web') {
          const activeElement = document.activeElement as HTMLElement | null;
          // Only blur if the focused element is inside a hidden aria-hidden container
          const hiddenParent = activeElement?.closest('[aria-hidden="true"]');
          if (hiddenParent && activeElement?.blur) {
            activeElement.blur();
          }
        }
      };
    }, [])
  );
}
