import { StyleSheet } from 'react-native';
import { scale, responsiveFontSize } from '../../constants/responsive';

export default StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontSize: responsiveFontSize(14),
    fontWeight: '600',
    marginBottom: scale(4),
  },
  track: {
    height: scale(12),
    borderRadius: scale(6),
    overflow: 'hidden',
    width: '100%',
  },
  progress: {
    height: '100%',
    borderRadius: scale(6),
  },
  xpText: {
    fontSize: responsiveFontSize(12),
    marginTop: scale(4),
    textAlign: 'right',
    fontWeight: '500',
    opacity: 0.8,
  },
});
