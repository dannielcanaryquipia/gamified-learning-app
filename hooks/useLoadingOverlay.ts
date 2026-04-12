import { useCallback, useState } from 'react';

interface UseLoadingOverlayReturn {
  isLoading: boolean;
  loadingMessage: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  setLoadingMessage: (message: string) => void;
}

/**
 * Hook to manage loading overlay state
 * @returns Object containing loading state and controls
 */
export function useLoadingOverlay(): UseLoadingOverlayReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const showLoading = useCallback((message?: string) => {

    if (message) {
      setLoadingMessage(message);
    }
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('Loading...');
  }, []);

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    setLoadingMessage,
  };
}
