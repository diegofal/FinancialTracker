import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CustomTable, { ColumnConfig } from '../components/CustomTable';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorView from '../components/ErrorView';
import useStore from '../store';
import theme from '../constants/theme';
import { formatCurrency } from '../utils/formatters';
import { BalanceItem } from '../services/api';

const AccountsReceivableScreen = () => {
  const { 
    balances, 
    isBalancesLoading, 
    balancesError, 
    fetchAllAccountsReceivableData 
  } = useStore();
  
  // Fetch accounts receivable data on initial load
  useEffect(() => {
    fetchAllAccountsReceivableData();
  }, []);
  
  // Define table columns
  const columns: ColumnConfig<BalanceItem>[] = [
    {
      title: 'Nombre',
      key: 'Name',
      width: '40%',
      style: { fontWeight: '500' }
    },
    {
      title: 'Saldo',
      key: 'Amount',
      width: '30%',
      render: (item) => (
        <Text style={{ color: theme.colors.dark }}>
          {formatCurrency(item.Amount)}
        </Text>
      )
    },
    {
      title: 'Saldo Vencido $',
      key: 'Due',
      width: '30%',
      render: (item) => (
        <Text style={{ color: item.Due > 0 ? theme.colors.debt : theme.colors.dark }}>
          {formatCurrency(item.Due)}
        </Text>
      )
    }
  ];
  
  // Determine if a row should be highlighted (Type === 0)
  const isRowHighlighted = (item: BalanceItem) => item.Type === 0;
  
  if (isBalancesLoading) {
    return <LoadingIndicator fullScreen message="Cargando cuentas corriente..." />;
  }
  
  if (balancesError) {
    return (
      <ErrorView 
        message={`Error al cargar las cuentas corriente: ${balancesError}`}
        onRetry={fetchAllAccountsReceivableData}
      />
    );
  }
  
  return (
    <View style={styles.container}>
      <CustomTable<BalanceItem>
        data={balances}
        columns={columns}
        keyExtractor={(item) => item.Name}
        highlightedRow={isRowHighlighted}
        highlightStyle={styles.highlightedRow}
        enablePagination
        pageSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  highlightedRow: {
    backgroundColor: '#ffeeee', // Light red background for debt rows
  }
});

export default AccountsReceivableScreen;
