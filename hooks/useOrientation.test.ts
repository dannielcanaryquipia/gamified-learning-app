import { act, renderHook } from '@testing-library/react-native';
import { useOrientation } from './useOrientation';

// Mock react-native's useWindowDimensions
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useWindowDimensions: jest.fn(),
}));

import { useWindowDimensions } from 'react-native';

describe('useOrientation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return portrait orientation when height > width', () => {
    (useWindowDimensions as jest.Mock).mockReturnValue({
      width: 375,
      height: 812,
    });

    const { result } = renderHook(() => useOrientation());

    expect(result.current.orientation).toBe('portrait');
    expect(result.current.isPortrait).toBe(true);
    expect(result.current.isLandscape).toBe(false);
    expect(result.current.width).toBe(375);
    expect(result.current.height).toBe(812);
  });

  it('should return landscape orientation when width > height', () => {
    (useWindowDimensions as jest.Mock).mockReturnValue({
      width: 812,
      height: 375,
    });

    const { result } = renderHook(() => useOrientation());

    expect(result.current.orientation).toBe('landscape');
    expect(result.current.isLandscape).toBe(true);
    expect(result.current.isPortrait).toBe(false);
    expect(result.current.width).toBe(812);
    expect(result.current.height).toBe(375);
  });

  it('should handle orientation change', () => {
    const { rerender } = renderHook(() => useOrientation());
    
    // Initial portrait
    (useWindowDimensions as jest.Mock).mockReturnValue({
      width: 375,
      height: 812,
    });
    
    act(() => {
      rerender({});
    });

    // Change to landscape
    (useWindowDimensions as jest.Mock).mockReturnValue({
      width: 812,
      height: 375,
    });
    
    act(() => {
      rerender({});
    });

    expect(useWindowDimensions).toHaveBeenCalled();
  });
});
