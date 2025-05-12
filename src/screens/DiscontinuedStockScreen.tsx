import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView 
} from 'react-native';
import CustomTable, { ColumnConfig } from '../components/CustomTable';
import PieChart from '../components/PieChart';
import { NumberSelectionFilter } from '../components/FilterSection';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorView from '../components/ErrorView';
import useStore from '../store';
import theme from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/formatters';
import { DiscontinuedStockItem } from '../services/api';

const DiscontinuedStockScreen = () => {
  const { 
    // Data
    stockDiscontinued,
    stockDiscontinuedGrouped,
    
    // Filters
    stockDiscontinuedYearsNotSold,
    
    // Loading states
    isStockDiscontinuedLoading,
    isStockDiscontinuedGroupedLoading,
    
    // Error states
    stockDiscontinuedError,
    stockDiscontinuedGroupedError,
    
    // Actions
    fetchAllDiscontinuedStockData,
    fetchStockDiscontinued,
    fetchStockDiscontinuedGrouped,
    setStockDiscontinuedYearsNotSold
  } = useStore();
  
  // Fetch discontinued stock data on initial load
  useEffect(() => {
    fetchAllDiscontinuedStockData();
  }, []);
  
  // Fetch discontinued stock when years filter changes
  useEffect(() => {
    fetchStockDiscontinued();
    fetchStockDiscontinuedGrouped();
  }, [stockDiscontinuedYearsNotSold]);
  
  // Convert discontinued stock by category to pie chart format
  const pieChartData = stockDiscontinuedGrouped.map(item => ({
    x: item.category,
    y: item.stock_value
  }));
  
  // Define discontinued stock table columns
  const stockColumns: ColumnConfig<DiscontinuedStockItem>[] = [
    {
      title: 'Código',
      key: 'codigo',
      width: '15%',
    },
    {
      title: 'Descripción',
      key: 'descripcion',
      width: '40%',
      style: { fontWeight: '500' }
    },
    {
      title: 'Cantidad',
      key: 'cantidad',
      width: '10%',
    },
    {
      title: 'Categoría',
      key: 'categoria',
      width: '15%',
    },
    {
      title: 'Última Venta',
      key: 'ultima_venta',
      width: '10%',
      render: (item) => (
        <Text style={styles.cellText}>
          {formatDate(item.ultima_venta, 'short')}
        </Text>
      )
    },
    {
      title: 'Valor Estimado',
      key: 'valor_estimado',
      width: '10%',
      render: (item) => (
        <Text style={styles.cellText}>
          {formatCurrency(item.valor_estimado)}
        </Text>
      )
    }
  ];
  
  return (
    <ScrollView style={styles.container}>
      {/* Years Filter */}
      <View style={styles.filtersRow}>
        <NumberSelectionFilter
          label="No vendido en años"
          value={stockDiscontinuedYearsNotSold}
          onValueChange={setStockDiscontinuedYearsNotSold}
          minValue={2}
          maxValue={20}
          style={styles.yearsFilter}
        />
      </View>
      
      {/* Pie Chart for Discontinued Stock by Category */}
      <View style={styles.chartContainer}>
        <PieChart
          data={pieChartData}
          title="Valor de Stock Discontinuado por Categoría"
          loading={isStockDiscontinuedGroupedLoading}
          error={stockDiscontinuedGroupedError}
          legendPosition="right"
          height={220}
        />
      </View>
      
      {/* Discontinued Stock Table */}
      <View style={styles.tableContainer}>
        <CustomTable<DiscontinuedStockItem>
          data={stockDiscontinued}
          columns={stockColumns}
          keyExtractor={(item) => `${item.codigo}-${item.descripcion}`}
          loading={isStockDiscontinuedLoading}
          error={stockDiscontinuedError}
          onRetry={fetchStockDiscontinued}
          enablePagination
          pageSize={10}
          style={styles.table}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  filtersRow: {
    marginBottom: theme.spacing.md,
  },
  yearsFilter: {
    width: '100%',
  },
  chartContainer: {
    marginBottom: theme.spacing.md,
  },
  tableContainer: {
    flex: 1,
  },
  table: {
    marginBottom: theme.spacing.lg,
  },
  cellText: {
    fontSize: theme.typography.fontSizes.sm,
  }
});

// Import Text component that was missing
import { Text } from 'react-native';

export default DiscontinuedStockScreen;
