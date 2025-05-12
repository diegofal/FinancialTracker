import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import CustomTable, { ColumnConfig } from '../components/CustomTable';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import FilterSection, { SwitchFilter, NumberSelectionFilter } from '../components/FilterSection';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorView from '../components/ErrorView';
import useStore from '../store';
import theme from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StockItem } from '../services/api';

const CurrentStockScreen = () => {
  const { 
    // Data
    stock,
    stockValueByCategory,
    stockSnapshots,
    stockCategories,
    stockProviders,
    stockCountries,
    
    // Filters
    stockYearsSoldIn,
    stockNeedsRestock,
    stockSelectedCategoryIds,
    stockSelectedProviderIds,
    stockSelectedCountryNames,
    
    // Loading states
    isStockLoading,
    isStockValueByCategoryLoading,
    isStockSnapshotsLoading,
    isStockCategoriesLoading,
    isStockProvidersLoading,
    isStockCountriesLoading,
    
    // Error states
    stockError,
    stockValueByCategoryError,
    stockSnapshotsError,
    stockCategoriesError,
    stockProvidersError,
    stockCountriesError,
    
    // Actions
    fetchAllCurrentStockData,
    fetchStock,
    setStockYearsSoldIn,
    setStockNeedsRestock,
    setStockSelectedCategoryIds,
    setStockSelectedProviderIds,
    setStockSelectedCountryNames
  } = useStore();
  
  // Track if filters are expanded
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  
  // Fetch stock data on initial load
  useEffect(() => {
    fetchAllCurrentStockData();
  }, []);
  
  // Fetch stock when filters change
  useEffect(() => {
    fetchStock();
  }, [
    stockYearsSoldIn,
    stockNeedsRestock,
    stockSelectedCategoryIds,
    stockSelectedProviderIds,
    stockSelectedCountryNames
  ]);
  
  // Convert stock value by category to pie chart format
  const pieChartData = stockValueByCategory.map(item => ({
    x: item.category,
    y: item.stock_value
  }));
  
  // Convert stock snapshots to line chart format
  const lineChartData = stockSnapshots.map(item => ({
    x: new Date(item.Date),
    y: item.StockValue
  }));
  
  // Define stock table columns
  const stockColumns: ColumnConfig<StockItem>[] = [
    {
      title: 'Código',
      key: 'Codigo',
      width: '15%',
    },
    {
      title: 'Descripción',
      key: 'descripcion',
      width: '30%',
      style: { fontWeight: '500' }
    },
    {
      title: 'Cantidad en stock',
      key: 'cantidad_en_stock',
      width: '10%',
      render: (item) => (
        <Text style={[
          styles.cellText,
          item.cantidad_en_stock === 0 && styles.zeroStockText
        ]}>
          {item.cantidad_en_stock}
        </Text>
      )
    },
    {
      title: 'Cantidad vendida',
      key: 'cantidad_vendida_en_periodo',
      width: '10%',
    },
    {
      title: 'Costo de oportunidad',
      key: 'costo_de_oportunidad',
      width: '15%',
      render: (item) => (
        <Text style={styles.cellText}>
          {formatCurrency(item.costo_de_oportunidad)}
        </Text>
      )
    },
    {
      title: 'Última compra',
      key: 'ultima_compra',
      width: '10%',
      render: (item) => (
        <Text style={styles.cellText}>
          {formatDate(item.ultima_compra, 'short')}
        </Text>
      )
    },
    {
      title: 'Estado',
      key: 'estado',
      width: '10%',
      render: (item) => (
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.estado) }
        ]}>
          <Text style={styles.statusText}>
            {item.estado}
          </Text>
        </View>
      )
    }
  ];
  
  // Get color for status badges
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Necesita Reposicion':
        return theme.colors.stockNeedsReposition;
      case 'Bajo Stock':
        return theme.colors.stockLow;
      case 'Stock Optimo':
        return theme.colors.stockOptimal;
      case 'OK':
        return theme.colors.stockOk;
      default:
        return theme.colors.gray;
    }
  };
  
  // Loading state for all filters
  const isFiltersLoading = 
    isStockCategoriesLoading || 
    isStockProvidersLoading || 
    isStockCountriesLoading;
  
  // Toggle filters expanded state
  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.filtersRow}>
        <NumberSelectionFilter
          label="Vendido en años"
          value={stockYearsSoldIn}
          onValueChange={setStockYearsSoldIn}
          minValue={1}
          maxValue={10}
          style={styles.yearsFilter}
        />
        
        <TouchableOpacity 
          style={styles.filtersButton}
          onPress={toggleFilters}
        >
          <Text style={styles.filtersButtonText}>
            {filtersExpanded ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Filters Section */}
      {filtersExpanded && (
        <View style={styles.filtersContainer}>
          <SwitchFilter
            label="Necesita Reposición"
            value={stockNeedsRestock}
            onValueChange={setStockNeedsRestock}
            style={styles.switchFilter}
          />
          
          {isFiltersLoading ? (
            <ActivityIndicator 
              size="small" 
              color={theme.colors.primary} 
              style={styles.filtersLoading} 
            />
          ) : (
            <>
              <FilterSection
                title="Buscar por Categoría"
                options={stockCategories}
                selectedIds={stockSelectedCategoryIds}
                onSelectionChange={setStockSelectedCategoryIds}
                loading={isStockCategoriesLoading}
                multiSelect={true}
                style={styles.filterSection}
              />
              
              <FilterSection
                title="Buscar por Proveedor"
                options={stockProviders}
                selectedIds={stockSelectedProviderIds}
                onSelectionChange={setStockSelectedProviderIds}
                loading={isStockProvidersLoading}
                multiSelect={true}
                style={styles.filterSection}
              />
              
              <FilterSection
                title="Buscar por País"
                options={stockCountries}
                selectedIds={stockSelectedCountryNames}
                onSelectionChange={setStockSelectedCountryNames}
                loading={isStockCountriesLoading}
                multiSelect={true}
                style={styles.filterSection}
              />
            </>
          )}
        </View>
      )}
      
      {/* Charts Row */}
      <View style={styles.chartsContainer}>
        <View style={styles.chartWrapper}>
          <PieChart
            data={pieChartData}
            title="Valor de Stock por Categoría"
            loading={isStockValueByCategoryLoading}
            error={stockValueByCategoryError}
            legendPosition="right"
            height={220}
          />
        </View>
        
        <View style={styles.chartWrapper}>
          <LineChart
            data={lineChartData}
            title="Evolución del Valor de Stock"
            color={theme.colors.primary}
            loading={isStockSnapshotsLoading}
            error={stockSnapshotsError}
            height={220}
          />
        </View>
      </View>
      
      {/* Stock Table */}
      <View style={styles.tableContainer}>
        <CustomTable<StockItem>
          data={stock}
          columns={stockColumns}
          keyExtractor={(item) => item.idArticulo.toString()}
          loading={isStockLoading}
          error={stockError}
          onRetry={fetchStock}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  yearsFilter: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  filtersButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small
  },
  filtersButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.medium as any,
    fontSize: theme.typography.fontSizes.sm,
  },
  filtersContainer: {
    marginBottom: theme.spacing.md,
  },
  switchFilter: {
    marginBottom: theme.spacing.md,
  },
  filterSection: {
    marginBottom: theme.spacing.md,
  },
  filtersLoading: {
    padding: theme.spacing.lg,
  },
  chartsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  chartWrapper: {
    width: '100%',
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
  },
  zeroStockText: {
    color: theme.colors.debt,
    fontWeight: theme.typography.fontWeights.bold as any,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  statusText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: theme.typography.fontWeights.medium as any,
  }
});

export default CurrentStockScreen;
