/**
 * Database Integration Module for Financial Dashboard
 * This module handles the integration with the backend API and provides
 * fallback functionality when database access is not available.
 */

// Placeholder data used when database connectivity is not available
const placeholderData = {
  // KPI cards data
  kpiData: {
    totalDebt: {
      value: "$13,354,799.20",
      secondary: "$4,319,116.10",
      trend: "down"
    },
    receivables: {
      value: "$5,895,980.53",
      secondary: "12.5% vs. Abril",
      trend: "up"
    },
    overdueDebt: {
      value: "$4,662,863.01",
      secondary: "5.2% este mes",
      trend: "up"
    },
    billedMonth: {
      value: "$16,018,545.55",
      secondary: "$2,544,409.84 vs. Abril",
      trend: "up"
    },
    billedToday: {
      value: "$0.00",
      secondary: "Sin facturación registrada",
      trend: "neutral"
    }
  },
  
  // Accounts receivable data
  accountsData: [
    { name: "INDUSTRIAL DAX", balance: "$2,321,899.15", due: "$2,321,899.15", type: 0 },
    { name: "BRICOD CONTADO", balance: "$2,977,776.20", due: "$2,295,247.96", type: 0 },
    { name: "INDUSTRIAL CONVER", balance: "$45,618.91", due: "$45,618.91", type: 0 },
    { name: "CANOGIDER", balance: "$2,292,897.10", due: "$0.00", type: 1 },
    { name: "FERNANDEZ", balance: "$252,110.03", due: "$0.00", type: 1 },
    { name: "BREND", balance: "$66,652.41", due: "$0.00", type: 1 },
    { name: "BRICAVAL", balance: "$488,488.09", due: "$0.00", type: 1 },
    { name: "CONTIVAL", balance: "$145,222.41", due: "$0.00", type: 1 }
  ],
  
  // Invoices data
  invoicesData: [
    { date: "12/05/2025", customer: "Cliente Ejemplo SA", invoice: "FC-A001-00012345", amount: "$121,000.00" },
    { date: "11/05/2025", customer: "Distribuidora Industrial", invoice: "FC-A001-00012346", amount: "$345,200.00" },
    { date: "10/05/2025", customer: "Bridas Argentinas", invoice: "FC-A001-00012347", amount: "$188,650.00" },
    { date: "09/05/2025", customer: "Metalúrgica del Sur", invoice: "FC-A001-00012348", amount: "$475,900.00" }
  ],
  
  // Stock data
  stockData: [
    { code: "TR12X6", description: "Tee de Reducción STD 1/2x3/4", stock: "0", sold: "5", cost: "$7,687.00", date: "30/08/2023", status: "Necesita Reposicion" },
    { code: "BSS15014", description: "Bridas S-150 SORF de 1/4", stock: "23", sold: "39", cost: "$6,707.04", date: "25/03/2025", status: "Necesita Reposicion" },
    { code: "BSS3006", description: "Bridas S-300 SORF de 6", stock: "9", sold: "42", cost: "$5,383.19", date: "13/12/2024", status: "Necesita Reposicion" },
    { code: "ES/BX3/4", description: "Espárragos R7 de 3/4 Cabeza Hexagonal", stock: "29", sold: "2004", cost: "$4,917.75", date: "10/02/2025", status: "Necesita Reposicion" }
  ],
  
  // Discontinued stock data
  discontinuedData: [
    { code: "BS15012", description: "Brida S-150 SORF 1/2", stock: "15", category: "Bridas", lastSale: "10/05/2020", value: "$25,000.00" },
    { code: "EB7-5/8X4", description: "Espárrago B7 de 5/8 x 4", stock: "50", category: "Accesorios", lastSale: "22/11/2019", value: "$15,000.00" },
    { code: "TR2X1", description: "Tee de Reducción STD 2x1", stock: "8", category: "Accesorio Forjado", lastSale: "15/02/2021", value: "$12,000.00" }
  ],
  
  // Category data for stock by category
  categoryData: [
    { category: "Bridas", value: 46.6 },
    { category: "Accesorios", value: 27.2 },
    { category: "Otros", value: 26.2 }
  ],
  
  // Filter options
  filterOptions: {
    categories: [
      { id: "1", name: "Bridas" },
      { id: "2", name: "Accesorios" },
      { id: "3", name: "Válvulas" },
      { id: "4", name: "Espárragos" }
    ],
    providers: [
      { id: "1", name: "Proveedor 1" },
      { id: "2", name: "Proveedor 2" },
      { id: "3", name: "Proveedor 3" }
    ],
    countries: [
      { id: "1", name: "Argentina" },
      { id: "2", name: "Brasil" },
      { id: "3", name: "China" },
      { id: "4", name: "Italia" }
    ]
  }
};

/**
 * Fetch API data with fallback to placeholder
 * @param {string} endpoint - API endpoint to fetch
 * @returns {Promise<Object>} - API response or placeholder data
 */
async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    
    // Check if the API indicates pending database access
    if (data && data.status === 'pending_firewall_access') {
      console.log(`Database connection not available (IP: ${data.ip}). Using placeholder data.`);
      
      // Return appropriate placeholder data based on endpoint
      return getPlaceholderForEndpoint(endpoint);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Fallback to placeholder data
    return getPlaceholderForEndpoint(endpoint);
  }
}

/**
 * Get appropriate placeholder data for an endpoint
 * @param {string} endpoint - API endpoint
 * @returns {Object} - Placeholder data for the endpoint
 */
function getPlaceholderForEndpoint(endpoint) {
  if (endpoint.includes('/api/accounts/balances')) {
    return placeholderData.accountsData;
  } else if (endpoint.includes('/api/accounts/future-payments')) {
    return { PaymentAmount: [1250000, 950000, 3200000] };
  } else if (endpoint.includes('/api/accounts/due-balance')) {
    return { Due: [4662863.01] };
  } else if (endpoint.includes('/api/invoices/spisa-billed')) {
    return { InvoiceAmount: 16018545.55 };
  } else if (endpoint.includes('/api/invoices/xerp-billed')) {
    return { BilledMonthly: 16018545.55, BilledToday: 0 };
  } else if (endpoint.includes('/api/invoices/history')) {
    return [
      { MonthYear: "2025-01-01", Amount: 12500000 },
      { MonthYear: "2025-02-01", Amount: 14200000 },
      { MonthYear: "2025-03-01", Amount: 13600000 },
      { MonthYear: "2025-04-01", Amount: 15450000 },
      { MonthYear: "2025-05-01", Amount: 16018545.55 }
    ];
  } else if (endpoint.includes('/api/invoices/bills')) {
    return placeholderData.invoicesData;
  } else if (endpoint.includes('/api/invoices/bill-items/')) {
    return [
      { stk_code: "BS15012", description: "Brida S-150 SORF 1/2", qty_sent: 5 },
      { stk_code: "TR12X6", description: "Tee de Reducción STD 1/2x3/4", qty_sent: 3 }
    ];
  } else if (endpoint.includes('/api/stock/items')) {
    return placeholderData.stockData;
  } else if (endpoint.includes('/api/stock/value-by-category')) {
    return placeholderData.categoryData.map(item => ({ 
      category: item.category, 
      stock_value: item.value * 10000 
    }));
  } else if (endpoint.includes('/api/stock/snapshots')) {
    return [
      { Date: "2025-01-01", StockValue: 4200000 },
      { Date: "2025-02-01", StockValue: 4350000 },
      { Date: "2025-03-01", StockValue: 4100000 },
      { Date: "2025-04-01", StockValue: 4250000 },
      { Date: "2025-05-01", StockValue: 4450000 }
    ];
  } else if (endpoint.includes('/api/stock/discontinued')) {
    return placeholderData.discontinuedData;
  } else if (endpoint.includes('/api/stock/discontinued-grouped')) {
    return [
      { category: "Bridas", stock_value: 500000 },
      { category: "Accesorios", stock_value: 300000 },
      { category: "Accesorio Forjado", stock_value: 200000 }
    ];
  } else if (endpoint.includes('/api/filters/categories')) {
    return placeholderData.filterOptions.categories;
  } else if (endpoint.includes('/api/filters/providers')) {
    return placeholderData.filterOptions.providers;
  } else if (endpoint.includes('/api/filters/countries')) {
    return placeholderData.filterOptions.countries;
  }
  
  // Default placeholder
  return { message: "Placeholder data not available for this endpoint" };
}

/**
 * Get KPI data for dashboard
 * @returns {Promise<Object>} - KPI data
 */
async function getKpiData() {
  // In a real implementation, this would fetch from multiple endpoints
  // For now, return the placeholder data
  return placeholderData.kpiData;
}

/**
 * Get accounts data for accounts receivable table
 * @returns {Promise<Array>} - Account data
 */
async function getAccountsData() {
  return fetchData('/api/accounts/balances');
}

/**
 * Get invoices data
 * @param {string} period - 'month', 'day', or 'all'
 * @returns {Promise<Array>} - Invoice data
 */
async function getInvoicesData(period = 'month') {
  return fetchData(`/api/invoices/bills?period=${period}`);
}

/**
 * Get bills history data for chart
 * @returns {Promise<Array>} - Bill history data
 */
async function getBillsHistoryData() {
  return fetchData('/api/invoices/history');
}

/**
 * Get stock data with filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Array>} - Stock data
 */
async function getStockData(filters = {}) {
  const queryParams = new URLSearchParams();
  
  if (filters.yearsSoldIn) queryParams.set('yearsSoldIn', filters.yearsSoldIn);
  if (filters.needsRestock) queryParams.set('needsRestock', filters.needsRestock);
  if (filters.categoryIds) queryParams.set('categoryIds', filters.categoryIds.join(','));
  if (filters.providerIds) queryParams.set('providerIds', filters.providerIds.join(','));
  if (filters.countryNames) queryParams.set('countryNames', filters.countryNames.join(','));
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchData(`/api/stock/items${queryString}`);
}

/**
 * Get discontinued stock data
 * @param {number} yearsNotSold - Years not sold filter
 * @returns {Promise<Array>} - Discontinued stock data
 */
async function getDiscontinuedStockData(yearsNotSold = 10) {
  return fetchData(`/api/stock/discontinued?yearsNotSold=${yearsNotSold}`);
}

/**
 * Get stock value by category
 * @param {number} yearsSoldIn - Years sold in filter
 * @returns {Promise<Array>} - Stock value by category
 */
async function getStockValueByCategory(yearsSoldIn = 2) {
  return fetchData(`/api/stock/value-by-category?yearsSoldIn=${yearsSoldIn}`);
}

/**
 * Get stock snapshots data for chart
 * @returns {Promise<Array>} - Stock snapshots
 */
async function getStockSnapshotsData() {
  return fetchData('/api/stock/snapshots');
}

/**
 * Get discontinued stock grouped by category
 * @param {number} yearsNotSold - Years not sold filter
 * @returns {Promise<Array>} - Discontinued stock by category
 */
async function getDiscontinuedStockGrouped(yearsNotSold = 10) {
  return fetchData(`/api/stock/discontinued-grouped?yearsNotSold=${yearsNotSold}`);
}

/**
 * Get filter options
 * @param {string} filterType - 'categories', 'providers', or 'countries'
 * @returns {Promise<Array>} - Filter options
 */
async function getFilterOptions(filterType) {
  return fetchData(`/api/filters/${filterType}`);
}

// Export API functions
window.DatabaseAPI = {
  getKpiData,
  getAccountsData,
  getInvoicesData,
  getBillsHistoryData,
  getStockData,
  getDiscontinuedStockData,
  getStockValueByCategory,
  getStockSnapshotsData,
  getDiscontinuedStockGrouped,
  getFilterOptions
};