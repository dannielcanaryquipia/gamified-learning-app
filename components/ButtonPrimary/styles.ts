import { StyleSheet } from 'react-native';
import { scale, responsiveFontSize } from '../../constants/responsive';

export default StyleSheet.create({
  button: {
    paddingVertical: scale(14),
    paddingHorizontal: scale(16),
    borderRadius: scale(12), // Scaled
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: scale(120),
    minHeight: scale(48), // Ensuring touch target >= 44x44 dp
  },
  primaryButton: {
    // Background color handled in component using tokens
  },
  secondaryButton: {
    // Background color handled in component using tokens
  },
  label: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(16), // From design-tokens.json (BODY)
    fontWeight: '700',
    textAlign: 'center',
  },
});
