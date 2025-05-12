import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Financial & Inventory Dashboard</Text>
        </View>
        
        <View style={styles.kpiContainer}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>Total Debt</Text>
            <Text style={styles.kpiValue}>$13,354,799.20</Text>
            <Text style={styles.kpiSecondary}>$4,319,116.10</Text>
          </View>
          
          <View style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>Receivables</Text>
            <Text style={[styles.kpiValue, styles.kpiValueBlue]}>$5,895,980.53</Text>
          </View>
          
          <View style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>Overdue Debt</Text>
            <Text style={styles.kpiValue}>$4,662,863.01</Text>
          </View>
          
          <View style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>Billed in May</Text>
            <Text style={styles.kpiValue}>$16,018,545.55</Text>
            <Text style={styles.kpiSecondary}>$2,544,409.84</Text>
          </View>
          
          <View style={styles.kpiCard}>
            <Text style={styles.kpiTitle}>Billed Today</Text>
            <Text style={styles.kpiValue}>$0.00</Text>
            <Text style={styles.kpiSecondary}>$0.00</Text>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <View style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Accounts</Text>
            </View>
            <View style={styles.tab}>
              <Text style={styles.tabText}>Invoices</Text>
            </View>
            <View style={styles.tab}>
              <Text style={styles.tabText}>Stock</Text>
            </View>
          </View>
          
          <View style={styles.tabContent}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.headerCell, { flex: 2 }]}>Name</Text>
                <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>Balance</Text>
                <Text style={[styles.tableCell, styles.headerCell, { flex: 1 }]}>Due Balance</Text>
              </View>
              
              <View style={[styles.tableRow, styles.highlightedRow]}>
                <Text style={[styles.tableCell, { flex: 2 }]}>INDUSTRIAL DAX</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>$2,321,899.15</Text>
                <Text style={[styles.tableCell, styles.redText, { flex: 1 }]}>$2,321,899.15</Text>
              </View>
              
              <View style={[styles.tableRow, styles.highlightedRow]}>
                <Text style={[styles.tableCell, { flex: 2 }]}>BRICOD CONTADO</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>$2,977,776.20</Text>
                <Text style={[styles.tableCell, styles.redText, { flex: 1 }]}>$2,295,247.96</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>CANOGIDER</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>$2,292,897.10</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>$0.00</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>FERNANDEZ</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>$252,110.03</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>$0.00</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>BREND</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>$66,652.41</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>$0.00</Text>
              </View>
              
              <View style={styles.tableFooter}>
                <Text style={styles.tableFooterText}>19 results</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 5,
  },
  kpiValueBlue: {
    color: '#007AFF',
  },
  kpiSecondary: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tabsContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  tabContent: {
    padding: 15,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  highlightedRow: {
    backgroundColor: '#ffeeee',
  },
  tableCell: {
    fontSize: 12,
    color: '#000',
  },
  redText: {
    color: '#FF3B30',
  },
  tableFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
  },
  tableFooterText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});