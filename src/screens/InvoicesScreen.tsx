import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LineChart from '../components/LineChart';
import CustomTable, { ColumnConfig } from '../components/CustomTable';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorView from '../components/ErrorView';
import useStore from '../store';
import theme from '../constants/theme';
import { formatCurrency, formatDate } from '../utils/formatters';
import { BillItem, BillLineItem } from '../services/api';

const InvoicesScreen = () => {
  const { 
    billsHistory,
    bills, 
    billItems,
    selectedOrderNo,
    billFilterPeriod,
    
    isBillsHistoryLoading,
    isBillsLoading,
    isBillItemsLoading,
    
    billsHistoryError,
    billsError,
    billItemsError,
    
    fetchAllInvoicesData,
    setBillFilterPeriod,
    fetchBills,
    fetchBillItems,
    setSelectedOrderNo
  } = useStore();
  
  // Fetch invoices data on initial load
  useEffect(() => {
    fetchAllInvoicesData();
  }, []);
  
  // Refetch bills when filter period changes
  useEffect(() => {
    fetchBills();
  }, [billFilterPeriod]);
  
  // Convert bills history to chart format
  const chartData = billsHistory.map(item => ({
    x: new Date(item.MonthYear),
    y: item.Amount
  }));
  
  // Define invoices table columns
  const invoiceColumns: ColumnConfig<BillItem>[] = [
    {
      title: 'Fecha',
      key: 'invoiceDate',
      width: '25%',
      render: (item) => (
        <Text style={styles.cellText}>
          {formatDate(item.invoiceDate, 'short')}
        </Text>
      )
    },
    {
      title: 'Cliente',
      key: 'customerName',
      width: '40%',
      style: { fontWeight: '500' }
    },
    {
      title: 'Número',
      key: 'invoiceNumber',
      width: '20%'
    },
    {
      title: 'Monto',
      key: 'totalAmount',
      width: '15%',
      render: (item) => (
        <Text style={styles.cellText}>
          {formatCurrency(item.totalAmount)}
        </Text>
      )
    }
  ];
  
  // Define bill items table columns
  const billItemColumns: ColumnConfig<BillLineItem>[] = [
    {
      title: 'Descripción',
      key: 'description',
      width: '70%',
      style: { fontWeight: '500' }
    },
    {
      title: 'Cant. enviada',
      key: 'qty_sent',
      width: '30%',
      render: (item) => (
        <Text style={styles.cellText}>
          {item.qty_sent}
        </Text>
      )
    }
  ];
  
  // Handle invoice row selection
  const handleInvoiceSelect = (item: BillItem) => {
    fetchBillItems(item.order_no);
  };
  
  // Clear selected invoice and items
  const clearSelection = () => {
    setSelectedOrderNo(null);
  };
  
  // Filter button component
  const FilterButton = ({ 
    label, 
    active, 
    onPress 
  }: { 
    label: string; 
    active: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.filterButton, active && styles.activeFilterButton]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, active && styles.activeFilterButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      {/* Billing History Chart */}
      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          title="Historial de Facturación Mensual"
          color={theme.colors.debt}
          height={200}
          loading={isBillsHistoryLoading}
          error={billsHistoryError}
        />
      </View>
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FilterButton
          label="Facturado en el Mes"
          active={billFilterPeriod === 'month'}
          onPress={() => setBillFilterPeriod('month')}
        />
        <FilterButton
          label="Facturado Hoy"
          active={billFilterPeriod === 'day'}
          onPress={() => setBillFilterPeriod('day')}
        />
        <FilterButton
          label="Todos"
          active={billFilterPeriod === 'all'}
          onPress={() => setBillFilterPeriod('all')}
        />
      </View>
      
      {/* Invoices Table */}
      <View style={styles.tableContainer}>
        <CustomTable<BillItem>
          data={bills}
          columns={invoiceColumns}
          keyExtractor={(item) => item.order_no}
          onRowPress={handleInvoiceSelect}
          loading={isBillsLoading}
          error={billsError}
          onRetry={fetchBills}
          emptyMessage={`No hay facturas para el período seleccionado: ${
            billFilterPeriod === 'month' ? 'Mes actual' : 
            billFilterPeriod === 'day' ? 'Hoy' : 'Todos'
          }`}
          enablePagination
          pageSize={5}
        />
      </View>
      
      {/* Bill Items Table (shown when an invoice is selected) */}
      {selectedOrderNo && (
        <View style={styles.detailsContainer}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>Detalles de la Factura</Text>
            <TouchableOpacity onPress={clearSelection}>
              <Text style={styles.closeButton}>Cerrar</Text>
            </TouchableOpacity>
          </View>
          
          <CustomTable<BillLineItem>
            data={billItems}
            columns={billItemColumns}
            keyExtractor={(item) => `${item.stk_code}-${item.description}`}
            loading={isBillItemsLoading}
            error={billItemsError}
            onRetry={() => fetchBillItems(selectedOrderNo)}
            emptyMessage="No hay ítems para esta factura"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  chartContainer: {
    marginBottom: theme.spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  filterButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    ...theme.shadows.small
  },
  activeFilterButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark,
  },
  activeFilterButtonText: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeights.medium as any,
  },
  tableContainer: {
    flex: 1,
    marginBottom: theme.spacing.md,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.small
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  detailsTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.medium as any,
    color: theme.colors.dark,
  },
  closeButton: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.primary,
  },
  cellText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.dark,
  }
});

export default InvoicesScreen;
