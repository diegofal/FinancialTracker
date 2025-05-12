import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';

// Components
const KpiCard = ({ title, primaryValue, primaryColor = '#FF3B30', secondaryValue, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.kpiCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={styles.kpiTitle}>{title}</Text>
      <Text style={[styles.kpiValue, { color: primaryColor }]}>{primaryValue}</Text>
      {secondaryValue && <Text style={styles.kpiSecondary}>{secondaryValue}</Text>}
    </TouchableOpacity>
  );
};

const CustomTable = ({ data, columns, highlightCondition }) => {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {columns.map((column, index) => (
          <Text 
            key={`header-${index}`} 
            style={[
              styles.tableCell, 
              styles.headerCell, 
              { flex: column.flex || 1 }
            ]}
          >
            {column.title}
          </Text>
        ))}
      </View>
      
      {data.map((item, rowIndex) => (
        <View 
          key={`row-${rowIndex}`} 
          style={[
            styles.tableRow, 
            highlightCondition && highlightCondition(item) ? styles.highlightedRow : null
          ]}
        >
          {columns.map((column, cellIndex) => (
            <Text 
              key={`cell-${rowIndex}-${cellIndex}`}
              style={[
                styles.tableCell, 
                column.textStyle ? column.textStyle(item) : null,
                { flex: column.flex || 1 }
              ]}
            >
              {column.render ? column.render(item) : item[column.key]}
            </Text>
          ))}
        </View>
      ))}
      
      <View style={styles.tableFooter}>
        <Text style={styles.tableFooterText}>{data.length} results</Text>
      </View>
    </View>
  );
};

// Fake line chart component
const LineChart = ({ title }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContent}>
        <View style={styles.lineChartFake}>
          <View style={[styles.linePoint, { left: '10%', top: '60%' }]} />
          <View style={[styles.linePoint, { left: '20%', top: '40%' }]} />
          <View style={[styles.linePoint, { left: '30%', top: '30%' }]} />
          <View style={[styles.linePoint, { left: '40%', top: '50%' }]} />
          <View style={[styles.linePoint, { left: '50%', top: '45%' }]} />
          <View style={[styles.linePoint, { left: '60%', top: '35%' }]} />
          <View style={[styles.linePoint, { left: '70%', top: '40%' }]} />
          <View style={[styles.linePoint, { left: '80%', top: '30%' }]} />
          <View style={[styles.linePoint, { left: '90%', top: '35%' }]} />
          
          <View style={styles.lineConnector} />
        </View>
      </View>
    </View>
  );
};

// Fake pie chart component
const PieChart = ({ title }) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContent}>
        <View style={styles.pieContainer}>
          <View style={styles.pieChart}>
            <View style={[styles.pieSlice, { backgroundColor: '#007AFF', transform: [{ rotate: '0deg' }], zIndex: 5 }]} />
            <View style={[styles.pieSlice, { backgroundColor: '#34C759', transform: [{ rotate: '120deg' }], zIndex: 4 }]} />
            <View style={[styles.pieSlice, { backgroundColor: '#FF9500', transform: [{ rotate: '240deg' }], zIndex: 3 }]} />
          </View>
          
          <View style={styles.pieLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#007AFF' }]} />
              <Text style={styles.legendText}>Bridas (46.6%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#34C759' }]} />
              <Text style={styles.legendText}>Accesorios (27.2%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF9500' }]} />
              <Text style={styles.legendText}>Otros (26.2%)</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Main App Component
export default function App() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [activeStockTab, setActiveStockTab] = useState('current');
  
  // Mock data
  const accountsData = [
    { name: "INDUSTRIAL DAX", balance: "$2,321,899.15", due: "$2,321,899.15", type: 0 },
    { name: "BRICOD CONTADO", balance: "$2,977,776.20", due: "$2,295,247.96", type: 0 },
    { name: "INDUSTRIAL CONVER", balance: "$45,618.91", due: "$45,618.91", type: 0 },
    { name: "CANOGIDER", balance: "$2,292,897.10", due: "$0.00", type: 1 },
    { name: "FERNANDEZ", balance: "$252,110.03", due: "$0.00", type: 1 },
    { name: "BREND", balance: "$66,652.41", due: "$0.00", type: 1 },
    { name: "BRICAVAL", balance: "$488,488.09", due: "$0.00", type: 1 },
    { name: "CONTIVAL", balance: "$145,222.41", due: "$0.00", type: 1 }
  ];
  
  const invoicesData = [
    { date: "12/05/2025", customer: "Cliente Ejemplo SA", invoice: "FC-A001-00012345", amount: "$121,000.00" },
    { date: "11/05/2025", customer: "Distribuidora Industrial", invoice: "FC-A001-00012346", amount: "$345,200.00" },
    { date: "10/05/2025", customer: "Bridas Argentinas", invoice: "FC-A001-00012347", amount: "$188,650.00" },
    { date: "09/05/2025", customer: "Metalúrgica del Sur", invoice: "FC-A001-00012348", amount: "$475,900.00" }
  ];
  
  const stockData = [
    { code: "TR12X6", description: "Tee de Reducción STD 1/2x3/4", stock: "0", sold: "5", cost: "$7,687.00", date: "30/08/2023", status: "Necesita Reposicion" },
    { code: "BSS15014", description: "Bridas S-150 SORF de 1/4", stock: "23", sold: "39", cost: "$6,707.04", date: "25/03/2025", status: "Necesita Reposicion" },
    { code: "BSS3006", description: "Bridas S-300 SORF de 6", stock: "9", sold: "42", cost: "$5,383.19", date: "13/12/2024", status: "Necesita Reposicion" },
    { code: "ES/BX3/4", description: "Espárragos R7 de 3/4 Cabeza Hexagonal", stock: "29", sold: "2004", cost: "$4,917.75", date: "10/02/2025", status: "Necesita Reposicion" }
  ];
  
  const discontinuedData = [
    { code: "BS15012", description: "Brida S-150 SORF 1/2", stock: "15", category: "Bridas", lastSale: "10/05/2020", value: "$25,000.00" },
    { code: "EB7-5/8X4", description: "Espárrago B7 de 5/8 x 4", stock: "50", category: "Accesorios", lastSale: "22/11/2019", value: "$15,000.00" },
    { code: "TR2X1", description: "Tee de Reducción STD 2x1", stock: "8", category: "Accesorio Forjado", lastSale: "15/02/2021", value: "$12,000.00" }
  ];
  
  // Table column configurations
  const accountsColumns = [
    { title: "Name", key: "name", flex: 2 },
    { title: "Balance", key: "balance", flex: 1 },
    { title: "Due Balance", key: "due", flex: 1, textStyle: (item) => item.type === 0 ? styles.redText : null }
  ];
  
  const invoicesColumns = [
    { title: "Date", key: "date", flex: 1 },
    { title: "Customer", key: "customer", flex: 2 },
    { title: "Invoice #", key: "invoice", flex: 1 },
    { title: "Amount", key: "amount", flex: 1 }
  ];
  
  const stockColumns = [
    { title: "Code", key: "code", flex: 1 },
    { title: "Description", key: "description", flex: 2 },
    { title: "Stock", key: "stock", flex: 0.7, textStyle: (item) => item.stock === "0" ? styles.redText : null },
    { title: "Sold", key: "sold", flex: 0.7 },
    { title: "Cost", key: "cost", flex: 1 },
    { title: "Status", key: "status", flex: 1.5, render: (item) => (
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    )}
  ];
  
  const discontinuedColumns = [
    { title: "Code", key: "code", flex: 1 },
    { title: "Description", key: "description", flex: 2 },
    { title: "Stock", key: "stock", flex: 0.7 },
    { title: "Category", key: "category", flex: 1 },
    { title: "Last Sale", key: "lastSale", flex: 1 },
    { title: "Value", key: "value", flex: 1 }
  ];
  
  // Helper function to determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Necesita Reposicion': return '#FF3B30';
      case 'Bajo Stock': return '#FF9500';
      case 'Stock Optimo': return '#007AFF';
      case 'OK': return '#34C759';
      default: return '#8E8E93';
    }
  };
  
  // Filter components for Stock screens
  const FilterSection = () => {
    return (
      <View style={styles.filterSection}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Vendido en años:</Text>
          <View style={styles.filterControls}>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.filterValue}>2</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Necesita Reposición</Text>
          <View style={styles.switchTrack}>
            <View style={styles.switchThumb} />
          </View>
        </View>
        
        <View style={styles.multiSelectFilter}>
          <Text style={styles.filterSectionTitle}>Buscar por Categoría</Text>
          <View style={styles.multiSelectItem}>
            <Text style={styles.multiSelectText}>Bridas</Text>
            <View style={styles.checkbox}></View>
          </View>
          <View style={styles.multiSelectItem}>
            <Text style={styles.multiSelectText}>Accesorios</Text>
            <View style={styles.checkbox}></View>
          </View>
        </View>
      </View>
    );
  };
  
  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'accounts':
        return (
          <View style={styles.tabContent}>
            <CustomTable 
              data={accountsData} 
              columns={accountsColumns}
              highlightCondition={(item) => item.type === 0}
            />
          </View>
        );
        
      case 'invoices':
        return (
          <View style={styles.tabContent}>
            <LineChart title="Historial de Facturación Mensual" />
            
            <View style={styles.filterButtons}>
              <TouchableOpacity style={[styles.periodButton, styles.activePeriodButton]}>
                <Text style={styles.activePeriodText}>Facturado en el Mes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.periodButton}>
                <Text style={styles.periodText}>Facturado Hoy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.periodButton}>
                <Text style={styles.periodText}>Todos</Text>
              </TouchableOpacity>
            </View>
            
            <CustomTable 
              data={invoicesData} 
              columns={invoicesColumns}
            />
          </View>
        );
        
      case 'stock':
        return (
          <View style={styles.tabContent}>
            <View style={styles.stockTabs}>
              <TouchableOpacity 
                style={[styles.stockTab, activeStockTab === 'current' ? styles.activeStockTab : null]}
                onPress={() => setActiveStockTab('current')}
              >
                <Text style={[styles.stockTabText, activeStockTab === 'current' ? styles.activeStockTabText : null]}>
                  Actual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.stockTab, activeStockTab === 'discontinued' ? styles.activeStockTab : null]}
                onPress={() => setActiveStockTab('discontinued')}
              >
                <Text style={[styles.stockTabText, activeStockTab === 'discontinued' ? styles.activeStockTabText : null]}>
                  Discontinuado
                </Text>
              </TouchableOpacity>
            </View>
            
            {activeStockTab === 'current' ? (
              <>
                <FilterSection />
                
                <View style={styles.chartsRow}>
                  <PieChart title="Valor de Stock por Categoría" />
                  <LineChart title="Evolución del Valor de Stock" />
                </View>
                
                <CustomTable 
                  data={stockData} 
                  columns={stockColumns}
                />
              </>
            ) : (
              <>
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>No vendido en años:</Text>
                  <View style={styles.filterControls}>
                    <TouchableOpacity style={styles.filterButton}>
                      <Text style={styles.filterButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.filterValue}>10</Text>
                    <TouchableOpacity style={styles.filterButton}>
                      <Text style={styles.filterButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <PieChart title="Valor de Stock Discontinuado por Categoría" />
                
                <CustomTable 
                  data={discontinuedData} 
                  columns={discontinuedColumns}
                />
              </>
            )}
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Financial & Inventory Dashboard</Text>
        </View>
        
        <View style={styles.kpiContainer}>
          <KpiCard 
            title="Total de deuda al 12/05/2025" 
            primaryValue="$13,354,799.20" 
            secondaryValue="$4,319,116.10" 
          />
          
          <KpiCard 
            title="Valores por Cobrar" 
            primaryValue="$5,895,980.53" 
            primaryColor="#007AFF" 
          />
          
          <KpiCard 
            title="Total Deuda Vencida" 
            primaryValue="$4,662,863.01" 
          />
          
          <KpiCard 
            title="Facturado en Mayo 2025" 
            primaryValue="$16,018,545.55" 
            secondaryValue="$2,544,409.84" 
            onPress={() => setActiveTab('invoices')}
          />
          
          <KpiCard 
            title="Facturado Hoy" 
            primaryValue="$0.00" 
            secondaryValue="$0.00" 
            onPress={() => setActiveTab('invoices')}
          />
        </View>
        
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'accounts' ? styles.activeTab : null]}
              onPress={() => setActiveTab('accounts')}
            >
              <Text style={[styles.tabText, activeTab === 'accounts' ? styles.activeTabText : null]}>
                Cuentas Corriente
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'invoices' ? styles.activeTab : null]}
              onPress={() => setActiveTab('invoices')}
            >
              <Text style={[styles.tabText, activeTab === 'invoices' ? styles.activeTabText : null]}>
                Facturas
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'stock' ? styles.activeTab : null]}
              onPress={() => setActiveTab('stock')}
            >
              <Text style={[styles.tabText, activeTab === 'stock' ? styles.activeTabText : null]}>
                Stock
              </Text>
            </TouchableOpacity>
          </View>
          
          {renderTabContent()}
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
  // Stock tabs
  stockTabs: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  stockTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeStockTab: {
    backgroundColor: '#FFF',
  },
  stockTabText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activeStockTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // Charts
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  chartContent: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineChartFake: {
    width: '100%',
    height: 150,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#D1D1D6',
    position: 'relative',
  },
  linePoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    position: 'absolute',
  },
  lineConnector: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: '#007AFF',
    top: '40%',
    left: '10%',
  },
  pieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    overflow: 'hidden',
    position: 'relative',
  },
  pieSlice: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    left: 0,
    top: 0,
    /* Only showing 1/3 of the pie slice */
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',
  },
  pieLegend: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#000',
  },
  chartsRow: {
    flexDirection: 'column',
  },
  // Filter styles
  filterSection: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 14,
    color: '#000',
  },
  filterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  filterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  // Switch
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 14,
    color: '#000',
  },
  switchTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1D1D6',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  // MultiSelect
  multiSelectFilter: {
    marginBottom: 15,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  multiSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
  },
  multiSelectText: {
    fontSize: 14,
    color: '#000',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  // Period filter buttons
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#D1D1D6',
  },
  activePeriodButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  periodText: {
    fontSize: 12,
    color: '#000',
  },
  activePeriodText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  // Status badge
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFF',
  },
});