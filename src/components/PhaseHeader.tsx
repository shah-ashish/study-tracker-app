import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Phase } from '../types';
import { COLORS } from '../constants';

interface PhaseHeaderProps {
  phase: Phase;
  label: string;
  dayRange: string;
  color: string;
}

export function PhaseHeader({
  label,
  dayRange,
  color,
}: PhaseHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.colorIndicator, { backgroundColor: color }]} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{label}</Text>
        <Text style={[styles.rangeBadge, { color }]}>{dayRange}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
    gap: 8,
  },
  colorIndicator: {
    width: 4,
    height: 18,
    borderRadius: 2,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
  rangeBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
});
