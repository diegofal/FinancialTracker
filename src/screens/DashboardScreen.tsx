import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import MainTabs from '../navigation/MainTabs';
import KpiCard from '../components/KpiCard';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorView from '../components/ErrorView';
import useStore from '../store';
import theme from '../constants/theme';
import { formatCurrency, getCurrentMonthYear, formatDate } from '../utils/formatters';

const DashboardScreen = () => {
  const { 
    // Data
    balances,
    futurePayments,
    dueBalance,
    spisaBilledMonth,
    spisaBilledDay,
    xerpBilledMonth,
    xerpBilledDay,
    
    // Loading states
    isBalancesLoading,
    isFuturePaymentsLoading,
    isDueBalanceLoading,
    isSpisaBilledLoading,
    isXerpBilledLoading,
    
    // Error states
    balancesError,
    futurePaymentsError,
    dueBalanceError,
    spisaBilledError,
    xerpBilledError,
    
    // Actions
    fetchAllDashboardData,
    setBillFilterPeriod,
  } = useStore();
  
  // Fetch all dashboard data on initial load
  useEffect(() => {
    fetchAllDashboardData();
  }, []);
  
  // Calculate debt total (Type = 0)
  const debtTotal = balances
    .filter(item => item.Type === 0)
    .reduce((sum, item) => sum + item.Amount, 0);
  
  // Calculate credit total (Type = 1)
  const creditTotal = balances
    .filter(item => item.Type === 1)
    .reduce((sum, item) => sum + item.Amount, 0);
  
  // Format current date for "Total de deuda al [current date]"
  const currentDate = formatDate(new Date(), 'short');
  
  // Check if KPI data is still loading
  const isKpisLoading = 
    isBalancesLoading || 
    isFuturePaymentsLoading || 
    isDueBalanceLoading || 
    isSpisaBilledLoading || 
    isXerpBilledLoading;
  
  // Check if there are any errors loading the KPI data
  const hasKpiErrors = 
    balancesError || 
    futurePaymentsError || 
    dueBalanceError || 
    spisaBilledError || 
    xerpBilledError;
  
  // If there are errors with any KPI data, show error view
  if (hasKpiErrors) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorView
          message="Error al cargar los datos del dashboard"
          onRetry={fetchAllDashboardData}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={theme.colors.white} barStyle="dark-content" />
      
      <ScrollView style={styles.container}>
        {isKpisLoading ? (
          <LoadingIndicator message="Cargando indicadores..." />
        ) : (
          <View style={styles.kpiContainer}>
            {/* KPI 1: Total de deuda */}
            <KpiCard
              title={`Total de deuda al ${currentDate}`}
              primaryValue={formatCurrency(debtTotal)}
              primaryValueColor={theme.colors.debt}
              secondaryValue={formatCurrency(creditTotal)}
              secondaryValueColor={theme.colors.neutral}
              iconName="dollar-sign"
              iconLibrary="FontAwesome"
              iconColor={theme.colors.debt}
              style={styles.kpiCard}
            />
            
            {/* KPI 2: Valores por Cobrar */}
            <KpiCard
              title="Valores por Cobrar"
              primaryValue={formatCurrency(futurePayments?.PaymentAmount[0] || 0)}
              primaryValueColor={theme.colors.credit}
              iconName="sack-dollar"
              iconLibrary="FontAwesome5"
              iconColor={theme.colors.credit}
              onPress={() => fetchAllDashboardData()}
              style={styles.kpiCard}
            />
            
            {/* KPI 3: Total Deuda Vencida */}
            <KpiCard
              title="Total Deuda Vencida"
              primaryValue={formatCurrency(dueBalance?.Due[0] || 0)}
              primaryValueColor={theme.colors.debt}
              iconName="file-invoice-dollar"
              iconLibrary="FontAwesome5"
              iconColor={theme.colors.debt}
              style={styles.kpiCard}
            />
            
            {/* KPI 4: Facturado en [Current Month] */}
            <KpiCard
              title={`Facturado en ${getCurrentMonthYear()}`}
              primaryValue={formatCurrency(xerpBilledMonth?.BilledMonthly || 0)}
              primaryValueColor={theme.colors.debt}
              secondaryValue={formatCurrency(spisaBilledMonth?.InvoiceAmount || 0)}
              secondaryValueColor={theme.colors.neutral}
              iconName="chart-line"
              iconLibrary="FontAwesome"
              iconColor={theme.colors.debt}
              onPress={() => {
                setBillFilterPeriod('month');
                // Note: Navigation to "Facturas" tab is handled by MainTabs.tsx
              }}
              style={styles.kpiCard}
            />
            
            {/* KPI 5: Facturado Hoy */}
            <KpiCard
              title="Facturado Hoy"
              primaryValue={formatCurrency(xerpBilledDay?.BilledToday || 0)}
              primaryValueColor={theme.colors.debt}
              secondaryValue={formatCurrency(spisaBilledDay?.InvoiceAmount || 0)}
              secondaryValueColor={theme.colors.neutral}
              iconName="calendar-day"
              iconLibrary="FontAwesome"
              iconColor={theme.colors.debt}
              onPress={() => {
                setBillFilterPeriod('day');
                // Note: Navigation to "Facturas" tab is handled by MainTabs.tsx
              }}
              style={styles.kpiCard}
            />
          </View>
        )}
        
        {/* Main Tabs Navigator */}
        <View style={styles.tabsContainer}>
          <MainTabs />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: '48%', // Approx half width minus margins
    marginBottom: theme.spacing.md,
  },
  tabsContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
});

export default DashboardScreen;
