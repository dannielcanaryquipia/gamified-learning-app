import React from 'react';
import { render } from '@testing-library/react-native';
import XPBar from '../../components/XPBar';
import { ThemeProvider } from '../../contexts/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('XPBar', () => {
  it('renders progress text correctly', () => {
    const { getByText } = renderWithTheme(
      <XPBar currentXP={50} maxXP={100} label="Level Progress" />
    );
    
    expect(getByText('Level Progress')).toBeTruthy();
    expect(getByText('50 / 100 XP')).toBeTruthy();
  });

  it('renders correctly with 0 XP', () => {
    const { getByText } = renderWithTheme(
      <XPBar currentXP={0} maxXP={500} />
    );
    
    expect(getByText('0 / 500 XP')).toBeTruthy();
  });

  it('renders correctly at max XP', () => {
    const { getByText } = renderWithTheme(
      <XPBar currentXP={100} maxXP={100} />
    );
    
    expect(getByText('100 / 100 XP')).toBeTruthy();
  });
});
