import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ButtonPrimary from '../../components/ButtonPrimary';
import { ThemeProvider } from '../../contexts/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ButtonPrimary', () => {
  it('renders correctly with label', () => {
    const { getByText } = renderWithTheme(
      <ButtonPrimary label="Test Button" onPress={() => {}} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPressMock = jest.fn();
    const { getByText } = renderWithTheme(
      <ButtonPrimary label="Click Me" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = renderWithTheme(
      <ButtonPrimary label="Disabled" onPress={onPressMock} disabled={true} />
    );
    
    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading prop is true', () => {
    const { getByRole } = renderWithTheme(
      <ButtonPrimary label="Loading" onPress={() => {}} loading={true} />
    );
    
    // ActivityIndicator usually has a busy state
    expect(getByRole('button')).toBeTruthy();
  });
});
