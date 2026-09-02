import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComparisonCar, MetricDefinition } from '../types/comparison.types';
import { calculateMetricWinner } from '../data/comparison-mock.data';

interface MetricRowProps {
  metric: MetricDefinition;
  cars: ComparisonCar[];
  isOddRow?: boolean;
}

export const MetricRow: React.FC<MetricRowProps> = ({ metric, cars, isOddRow }) => {
  const winnersMap = calculateMetricWinner(metric, cars);

  return (
    <View style={[styles.rowContainer, isOddRow && styles.rowOdd]}>
      {/* Metric Label in middle / header */}
      <Text style={styles.metricLabel}>{metric.label}</Text>

      {/* Values Row */}
      <View style={styles.valuesRow}>
        {cars.map((car) => {
          const valDisplay = metric.getDisplayValue(car);
          const isWinner = !!winnersMap[car.id];

          return (
            <View key={car.id} style={styles.valueColumn}>
              {isWinner ? (
                <View style={styles.winnerBadge}>
                  <Ionicons name="checkmark-circle" size={13} color="#10B981" />
                  <Text style={styles.winnerText} numberOfLines={1}>
                    {valDisplay}
                  </Text>
                </View>
              ) : (
                <Text style={styles.normalText} numberOfLines={2}>
                  {valDisplay}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowOdd: {
    backgroundColor: '#F8FAFC',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  valueColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
  },
  winnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
    maxWidth: '100%',
  },
  winnerText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#059669',
  },
  normalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F3040',
    textAlign: 'center',
  },
});
