import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';

interface ProgressBarProps {
  percentage: number;
  completedTasks?: number;
  totalTasks?: number;
  color?: string;
  height?: number;
  showLabels?: boolean;
}

export function ProgressBar({
  percentage,
  completedTasks,
  totalTasks,
  color = COLORS.primary,
  height = 6,
  showLabels = true,
}: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>
            {completedTasks !== undefined && totalTasks !== undefined
              ? `${completedTasks} of ${totalTasks} completed`
              : 'Progress'}
          </Text>
          <Text style={[styles.percentageText, { color }]}>
            {clampedPercentage}%
          </Text>
        </View>
      )}

      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedPercentage}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '800',
  },
  track: {
    width: '100%',
    backgroundColor: '#1A1D27',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 4,
  },
});
