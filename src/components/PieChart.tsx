import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { VictoryPie, VictoryLegend } from 'victory-native';
import theme from '../constants/theme';

interface DataPoint {
  x: string;
  y: number;
  // Optional color for custom slice coloring
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  title?: string;
  colorScale?: string[];
  height?: number;
  legendPosition?: 'right' | 'bottom';
  showLabels?: boolean;
  showPercentages?: boolean;
  loading?: boolean;
  error?: string | null;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  colorScale = ['#007AFF', '#34C759', '#5856D6', '#FF9500', '#FF2D55', '#5AC8FA', '#A2845E', '#8E8E93'],
  height = 250,
  legendPosition = 'right',
  showLabels = false,
  showPercentages = true,
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
  
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.y, 0);
  
  // Format data with percentages if needed
  const formattedData = data.map(item => {
    const percentage = (item.y / total * 100).toFixed(1);
    return {
      ...item,
      label: showLabels ? `${item.x}: ${percentage}%` : '',
      x: showPercentages ? `${item.x}\n${percentage}%` : item.x
    };
  });
  
  // Create legend data
  const legendData = data.map((item, index) => ({
    name: `${item.x} (${(item.y / total * 100).toFixed(1)}%)`,
    symbol: { fill: item.color || colorScale[index % colorScale.length] }
  }));
  
  // Determine layout based on legend position
  const chartWidth = legendPosition === 'right' ? '60%' : '100%';
  const legendWidth = legendPosition === 'right' ? '40%' : '100%';
  
  return (
    <View style={[styles.container, { height }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={[styles.chartContainer, 
        legendPosition === 'right' ? styles.rowLayout : styles.columnLayout
      ]}>
        <View style={{ width: chartWidth }}>
          <VictoryPie
            data={formattedData}
            colorScale={colorScale}
            style={{
              labels: {
                fontSize: 10,
                fill: theme.colors.white
              }
            }}
            animate={{ duration: 500 }}
            width={legendPosition === 'right' ? height * 1.2 : height * 1.5}
            height={legendPosition === 'right' ? height * 0.8 : height * 0.6}
            padding={legendPosition === 'right' ? 10 : 30}
            labelRadius={({ radius }) => radius * 0.6}
          />
        </View>
        
        <View style={{ width: legendWidth }}>
          <VictoryLegend
            colorScale={colorScale}
            data={legendData}
            orientation={legendPosition === 'right' ? 'vertical' : 'horizontal'}
            gutter={10}
            style={{
              labels: { fontSize: 10 }
            }}
            width={legendPosition === 'right' ? height * 0.8 : height * 1.5}
            height={legendPosition === 'right' ? height * 0.8 : height * 0.3}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.small
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium as any,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    color: theme.colors.dark,
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLayout: {
    flexDirection: 'row',
  },
  columnLayout: {
    flexDirection: 'column',
  },
  loadingText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.gray,
    textAlign: 'center',
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

export default PieChart;
