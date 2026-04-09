import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { scale, responsiveFontSize } from '../../constants/responsive';
import Card from '../Card/Card';

type StatusCardProps = {
  value: string | number;
  label: string;
  color: string;
  backgroundColor: string;
  icon?: React.ReactNode;
};

const StatusCard: React.FC<StatusCardProps> = ({
  value,
  label,
  color,
  backgroundColor,
  icon,
}) => {
  const cardStyle: ViewStyle = {
    ...styles.statCard,
    backgroundColor,
  };

  const statValueStyle: TextStyle = {
    ...styles.statValue,
    color,
  };

  const statLabelStyle: TextStyle = {
    ...styles.statLabel,
    color,
  };

  return (
    <Card variant="filled" style={cardStyle}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={statValueStyle}>{value}</Text>
      <Text style={statLabelStyle}>{label}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    marginHorizontal: scale(4),
    padding: scale(12),
    alignItems: 'center',
    borderRadius: scale(12),
  },
  iconContainer: {
    marginBottom: scale(4),
  },
  statValue: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    marginBottom: scale(2),
  },
  statLabel: {
    fontSize: responsiveFontSize(12),
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default StatusCard;
