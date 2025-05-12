import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryScatter } from 'victory-native';
import theme from '../constants/theme';

interface DataPoint {
  x: Date | string;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  title?: string;
  color?: string;
  height?: number;
  loading?: boolean;
  error?: string | null;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisLabel,
  yAxisLabel,
  title,
  color = theme.colors.primary,
  height = 250,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.loadingText}>Cargando gráfico...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyText}>No hay datos disponibles</Text>
      </View>
    );
  }
  
  // Process data to ensure x values are Date objects
  const processedData = data.map(point => ({
    x: typeof point.x === 'string' ? new Date(point.x) : point.x,
    y: point.y
  }));
  
  // Format dates for the x-axis
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
  };
  
  // Format large numbers for the y-axis (e.g., 1M, 50K)
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };
  
  return (
    <View style={[styles.container, { height }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 20, y: 20 }}
        padding={{ top: 20, right: 40, bottom: 50, left: 60 }}
        height={height}
      >
        <VictoryAxis
          tickFormat={(date) => formatDate(date as Date)}
          style={{
            tickLabels: { fontSize: 10, padding: 5, angle: -45 }
          }}
          label={xAxisLabel}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(val) => formatNumber(val)}
          style={{
            tickLabels: { fontSize: 10, padding: 5 }
          }}
          label={yAxisLabel}
        />
        <VictoryLine
          data={processedData}
          style={{
            data: { stroke: color, strokeWidth: 2 }
          }}
          animate={{ duration: 500 }}
        />
        <VictoryScatter
          data={processedData}
          size={4}
          style={{
            data: { fill: color }
          }}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium as any,
    marginBottom: theme.spacing.sm,
    color: theme.colors.dark,
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.gray,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.danger,
    textAlign: 'center',
    padding: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.gray,
    textAlign: 'center',
  }
});

export default LineChart;
