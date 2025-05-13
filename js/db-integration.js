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

// Track which areas of the dashboard have data loading errors
window.dataLoadingErrors = {
  kpi: false,
  accounts: false,
  invoices: false,
  stock: false,
  discontinued: false,
  filters: false
};

/**
 * Fetch API data with error handling
 * @param {string} endpoint - API endpoint to fetch
 * @param {string} area - Dashboard area this data belongs to
 * @returns {Promise<Object>} - API response or error indicator
 */
async function fetchData(endpoint, area = 'general') {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    
    // Check if the API indicates an error
    if (data && (data.error === true || data.status === 'pending_firewall_access')) {
      console.log(`Database connection error for ${endpoint}:`, data.message || 'Unknown error');
      
      // If the server returned an error message, include the IP
      const currentIP = '35.229.86.58'; // Current IP that needs to be added to firewall
      
      // Mark this area as having loading errors
      markAreaAsError(area);
      
      // Return an object that indicates loading error
      return { 
        error: true, 
        errorType: 'database_access',
        message: `Database connection not available. Add IP ${currentIP} to your Azure SQL firewall rules.`,
        endpoint: endpoint,
        ip: currentIP
      };
    }
    
    // If we got here, data loaded successfully
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    
    // Mark this area as having loading errors
    markAreaAsError(area);
    
    // Return an object that indicates loading error
    return { 
      error: true, 
      errorType: 'fetch_error',
      message: error.message,
      endpoint: endpoint
    };
  }
}

/**
 * Mark a dashboard area as having a data loading error
 * @param {string} area - Dashboard area name
 */
function markAreaAsError(area) {
  switch(area) {
    case 'kpi':
      window.dataLoadingErrors.kpi = true;
      break;
    case 'accounts':
      window.dataLoadingErrors.accounts = true;
      break;
    case 'invoices':
      window.dataLoadingErrors.invoices = true;
      break;
    case 'stock':
      window.dataLoadingErrors.stock = true;
      break;
    case 'discontinued':
      window.dataLoadingErrors.discontinued = true;
      break;
    case 'filters':
      window.dataLoadingErrors.filters = true;
      break;
    default:
      // General error
      break;
  }
  
  // After marking an area as error, apply visual indication
  applyErrorStyling();
}

/**
 * Apply visual styling to indicate data loading errors
 * This grays out areas that couldn't load data from the backend
 */
function applyErrorStyling() {
  // Apply error styling when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Add required CSS for error styling
    addErrorStyles();
    
    // Apply grayed out styling to specific dashboard areas with errors
    if (window.dataLoadingErrors.kpi) {
      document.querySelectorAll('.kpi-card').forEach(card => {
        card.classList.add('data-error');
      });
    }
    
    if (window.dataLoadingErrors.accounts) {
      const accountsTab = document.getElementById('accounts-tab');
      if (accountsTab) {
        accountsTab.classList.add('data-error');
      }
    }
    
    if (window.dataLoadingErrors.invoices) {
      const invoicesTab = document.getElementById('invoices-tab');
      if (invoicesTab) {
        invoicesTab.classList.add('data-error');
      }
    }
    
    if (window.dataLoadingErrors.stock) {
      const currentStockTab = document.getElementById('current-stock-tab');
      if (currentStockTab) {
        currentStockTab.classList.add('data-error');
      }
    }
    
    if (window.dataLoadingErrors.discontinued) {
      const discontinuedStockTab = document.getElementById('discontinued-stock-tab');
      if (discontinuedStockTab) {
        discontinuedStockTab.classList.add('data-error');
      }
    }
  });
}

/**
 * Add CSS styles for error indication
 */
function addErrorStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .data-error {
      position: relative;
      pointer-events: none;
      opacity: 0.7;
    }
    
    .data-error::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(229, 231, 235, 0.7);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: inherit;
    }
    
    .data-error::after {
      content: 'Data unavailable - Database access required';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
      background-color: rgba(229, 231, 235, 0.9);
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      color: #4b5563;
      white-space: nowrap;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Get appropriate error data for an endpoint
 * This function is used when an API request fails
 * @param {string} endpoint - API endpoint
 * @returns {Object} - Error data for the endpoint
 */
function getPlaceholderForEndpoint(endpoint) {
  // Return object with error information
  return { 
    error: true, 
    errorType: 'database_access',
    message: 'Database connection not available. Add the IP in the banner to your Azure SQL firewall rules.',
    endpoint: endpoint
  };
}

/**
 * Get KPI data for dashboard
 * @returns {Promise<Object>} - KPI data
 */
async function getKpiData() {
  const totalDebtData = await fetchData('/api/accounts/balances', 'kpi');
  if (totalDebtData.error) {
    return {
      error: true,
      errorType: totalDebtData.errorType,
      message: totalDebtData.message
    };
  }
  
  const futurePaymentsData = await fetchData('/api/accounts/future-payments', 'kpi');
  const dueBalanceData = await fetchData('/api/accounts/due-balance', 'kpi');
  const spisaBilledData = await fetchData('/api/invoices/spisa-billed?period=month', 'kpi');
  const xerpBilledData = await fetchData('/api/invoices/xerp-billed?period=month', 'kpi');
  
  // Calculated total debt from balances
  let totalDebt = 0, overdueDebt = 0;
  if (Array.isArray(totalDebtData)) {
    totalDebtData.forEach(account => {
      if (account.balance) {
        // Remove $ and commas, then parse to float
        const balance = parseFloat(account.balance.replace('$', '').replace(/,/g, ''));
        totalDebt += isNaN(balance) ? 0 : balance;
        
        if (account.type === 0 && account.due) {
          const due = parseFloat(account.due.replace('$', '').replace(/,/g, ''));
          overdueDebt += isNaN(due) ? 0 : due;
        }
      }
    });
  }
  
  // Format currency values
  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  });
  
  return {
    totalDebt: {
      value: formatter.format(totalDebt),
      secondary: formatter.format(overdueDebt),
      trend: "neutral"
    },
    receivables: {
      value: futurePaymentsData && futurePaymentsData.PaymentAmount && futurePaymentsData.PaymentAmount.length > 0 
        ? formatter.format(futurePaymentsData.PaymentAmount[0]) 
        : "$0.00",
      secondary: "Proyección a 30 días",
      trend: "neutral"
    },
    overdueDebt: {
      value: formatter.format(overdueDebt),
      secondary: "Deuda vencida actual",
      trend: "neutral"
    },
    billedMonth: {
      value: xerpBilledData && xerpBilledData.BilledMonthly ? formatter.format(xerpBilledData.BilledMonthly) : "$0.00",
      secondary: spisaBilledData && spisaBilledData.InvoiceAmount ? formatter.format(spisaBilledData.InvoiceAmount) : "$0.00",
      trend: "neutral"
    },
    billedToday: {
      value: xerpBilledData && xerpBilledData.BilledToday ? formatter.format(xerpBilledData.BilledToday) : "$0.00",
      secondary: "Facturación del día",
      trend: "neutral"
    }
  };
}

/**
 * Get accounts data for accounts receivable table
 * @returns {Promise<Array>} - Account data
 */
async function getAccountsData() {
  const data = await fetchData('/api/accounts/balances', 'accounts');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  return data; // Return the actual API response
}

/**
 * Get invoices data
 * @param {string} period - 'month', 'day', or 'all'
 * @returns {Promise<Array>} - Invoice data
 */
async function getInvoicesData(period = 'month') {
  const data = await fetchData(`/api/invoices/bills?period=${period}`, 'invoices');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  return data; // Return the actual API response
}

/**
 * Get bills history data for chart
 * @returns {Promise<Array>} - Bill history data
 */
async function getBillsHistoryData() {
  const data = await fetchData('/api/invoices/history', 'invoices');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  return data; // Return the actual API response
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
  const data = await fetchData(`/api/stock/items${queryString}`, 'stock');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  return [
    { code: "TR12X6", description: "Tee de Reducción STD 1/2x3/4", stock: "0", sold: "5", cost: "$7,687.00", date: "30/08/2023", status: "Necesita Reposicion" },
    { code: "BSS15014", description: "Bridas S-150 SORF de 1/4", stock: "23", sold: "39", cost: "$6,707.04", date: "25/03/2025", status: "Necesita Reposicion" },
    { code: "BSS3006", description: "Bridas S-300 SORF de 6", stock: "9", sold: "42", cost: "$5,383.19", date: "13/12/2024", status: "Necesita Reposicion" },
    { code: "ES/BX3/4", description: "Espárragos R7 de 3/4 Cabeza Hexagonal", stock: "29", sold: "2004", cost: "$4,917.75", date: "10/02/2025", status: "Necesita Reposicion" }
  ];
}

/**
 * Get discontinued stock data
 * @param {number} yearsNotSold - Years not sold filter
 * @returns {Promise<Array>} - Discontinued stock data
 */
async function getDiscontinuedStockData(yearsNotSold = 10) {
  const data = await fetchData(`/api/stock/discontinued?yearsNotSold=${yearsNotSold}`, 'discontinued');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  return data; // Return the actual API response
}

/**
 * Get stock value by category
 * @param {number} yearsSoldIn - Years sold in filter
 * @returns {Promise<Array>} - Stock value by category
 */
async function getStockValueByCategory(yearsSoldIn = 2) {
  const data = await fetchData(`/api/stock/value-by-category?yearsSoldIn=${yearsSoldIn}`, 'stock');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  return data; // Return the actual API response
}

/**
 * Get stock snapshots data for chart
 * @returns {Promise<Array>} - Stock snapshots
 */
async function getStockSnapshotsData() {
  const data = await fetchData('/api/stock/snapshots', 'stock');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  return data; // Return the actual API response
}

/**
 * Get discontinued stock grouped by category
 * @param {number} yearsNotSold - Years not sold filter
 * @returns {Promise<Array>} - Discontinued stock by category
 */
async function getDiscontinuedStockGrouped(yearsNotSold = 10) {
  const data = await fetchData(`/api/stock/discontinued-grouped?yearsNotSold=${yearsNotSold}`, 'discontinued');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  return data; // Return the actual API response
}

/**
 * Get filter options
 * @param {string} filterType - 'categories', 'providers', or 'countries'
 * @returns {Promise<Array>} - Filter options
 */
async function getFilterOptions(filterType) {
  const data = await fetchData(`/api/filters/${filterType}`, 'filters');
  
  if (data.error) {
    return {
      error: true,
      errorType: data.errorType,
      message: data.message
    };
  }
  
  // Return the actual API response
  return data;
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