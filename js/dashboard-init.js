/**
 * Dashboard initialization and data loading
 */

document.addEventListener('DOMContentLoaded', async function() {
  console.log('Dashboard loaded and animated');
  
  // Initialize the close banner button
  initCloseBanner();
  
  // Initialize the database status indicator
  await checkDatabaseStatus();
  
  // Load all data with error handling
  loadDashboardData();
});

/**
 * Initialize close button functionality for the status banner
 */
function initCloseBanner() {
  const closeButton = document.getElementById('close-banner');
  const banner = document.getElementById('db-status-banner');
  
  if (closeButton && banner) {
    closeButton.addEventListener('click', function() {
      banner.style.display = 'none';
    });
  }
}

/**
 * Check database connection status
 */
async function checkDatabaseStatus() {
  try {
    // Check SPISA connection
    const spisaResponse = await fetch('/api/connect/spisa');
    const spisaData = await spisaResponse.json();
    
    // Check XERP connection
    const xerpResponse = await fetch('/api/connect/xerp');
    const xerpData = await xerpResponse.json();
    
    // Update the status banner based on connection results
    updateStatusBanner(spisaData.success && xerpData.success);
  } catch (error) {
    console.error('Error checking database status:', error);
    // If there's an error, update banner to show connection failed
    updateStatusBanner(false);
  }
}

/**
 * Update the database status banner based on connection status
 * @param {boolean} connected - Whether database connection was successful
 */
function updateStatusBanner(connected) {
  const banner = document.getElementById('db-status-banner');
  if (!banner) return;
  
  if (connected) {
    // Connection successful
    banner.style.backgroundColor = '#d1fae5';
    banner.style.color = '#064e3b';
    
    const messageSpan = banner.querySelector('span');
    if (messageSpan) {
      messageSpan.innerHTML = `
        <strong>Database Connection Status:</strong> 
        Connected successfully to both SPISA and XERP databases.
      `;
    }
    
    const icon = banner.querySelector('i');
    if (icon) {
      icon.className = 'fas fa-check-circle';
      icon.style.color = '#059669';
    }
  } else {
    // Connection failed or pending
    // Banner already has the default warning styles from HTML
  }
}

/**
 * Load all dashboard data with error handling
 */
async function loadDashboardData() {
  try {
    // Load KPI data
    const kpiData = await window.DatabaseAPI.getKpiData();
    updateKPICards(kpiData);
    
    // Load accounts data for the accounts receivable table
    const accountsData = await window.DatabaseAPI.getAccountsData();
    updateAccountsTable(accountsData);
    
    // Load invoices data
    const invoicesData = await window.DatabaseAPI.getInvoicesData('month');
    updateInvoicesTable(invoicesData);
    
    // Load bills history data for chart
    const billsHistoryData = await window.DatabaseAPI.getBillsHistoryData();
    updateBillsHistoryChart(billsHistoryData);
    
    // Load stock data
    const stockData = await window.DatabaseAPI.getStockData();
    updateStockTable(stockData);
    
    // Load stock value by category
    const stockValueData = await window.DatabaseAPI.getStockValueByCategory();
    updateStockValueChart(stockValueData);
    
    // Load stock snapshots data
    const snapshotsData = await window.DatabaseAPI.getStockSnapshotsData();
    updateStockSnapshotsChart(snapshotsData);
    
    // Load discontinued stock data
    const discontinuedData = await window.DatabaseAPI.getDiscontinuedStockData();
    updateDiscontinuedStockTable(discontinuedData);
    
    // Load discontinued stock grouped by category
    const discontinuedGroupedData = await window.DatabaseAPI.getDiscontinuedStockGrouped();
    updateDiscontinuedGroupedChart(discontinuedGroupedData);
    
    // Load filter options (not implementing for now, as filters are static in UI)
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

/**
 * Update KPI cards with data
 * @param {Object} data - KPI data
 */
function updateKPICards(data) {
  // If there was an error fetching the data, the UI will be handled by the error styling module
  if (data.error) return;
  
  // Update total debt KPI
  const totalDebtElement = document.querySelector('[data-kpi="total-debt"]');
  if (totalDebtElement && data.totalDebt) {
    totalDebtElement.querySelector('.kpi-value').textContent = data.totalDebt.value;
    totalDebtElement.querySelector('.kpi-secondary').textContent = data.totalDebt.secondary;
    
    // Update trend indicator
    const trendIcon = totalDebtElement.querySelector('.trend-indicator i');
    if (trendIcon) {
      trendIcon.className = data.totalDebt.trend === 'up' 
        ? 'fas fa-arrow-up up' 
        : (data.totalDebt.trend === 'down' ? 'fas fa-arrow-down down' : 'fas fa-minus neutral');
    }
  }
  
  // Update receivables KPI
  const receivablesElement = document.querySelector('[data-kpi="receivables"]');
  if (receivablesElement && data.receivables) {
    receivablesElement.querySelector('.kpi-value').textContent = data.receivables.value;
    receivablesElement.querySelector('.kpi-secondary').textContent = data.receivables.secondary;
    
    // Update trend indicator
    const trendIcon = receivablesElement.querySelector('.trend-indicator i');
    if (trendIcon) {
      trendIcon.className = data.receivables.trend === 'up' 
        ? 'fas fa-arrow-up up' 
        : (data.receivables.trend === 'down' ? 'fas fa-arrow-down down' : 'fas fa-minus neutral');
    }
  }
  
  // Update overdue debt KPI
  const overdueElement = document.querySelector('[data-kpi="overdue"]');
  if (overdueElement && data.overdueDebt) {
    overdueElement.querySelector('.kpi-value').textContent = data.overdueDebt.value;
    overdueElement.querySelector('.kpi-secondary').textContent = data.overdueDebt.secondary;
    
    // Update trend indicator
    const trendIcon = overdueElement.querySelector('.trend-indicator i');
    if (trendIcon) {
      trendIcon.className = data.overdueDebt.trend === 'up' 
        ? 'fas fa-arrow-up up' 
        : (data.overdueDebt.trend === 'down' ? 'fas fa-arrow-down down' : 'fas fa-minus neutral');
    }
  }
  
  // Update billed month KPI
  const billedMonthElement = document.querySelector('[data-kpi="billed-month"]');
  if (billedMonthElement && data.billedMonth) {
    billedMonthElement.querySelector('.kpi-value').textContent = data.billedMonth.value;
    billedMonthElement.querySelector('.kpi-secondary').textContent = data.billedMonth.secondary;
    
    // Update trend indicator
    const trendIcon = billedMonthElement.querySelector('.trend-indicator i');
    if (trendIcon) {
      trendIcon.className = data.billedMonth.trend === 'up' 
        ? 'fas fa-arrow-up up' 
        : (data.billedMonth.trend === 'down' ? 'fas fa-arrow-down down' : 'fas fa-minus neutral');
    }
  }
  
  // Update billed today KPI
  const billedTodayElement = document.querySelector('[data-kpi="billed-today"]');
  if (billedTodayElement && data.billedToday) {
    billedTodayElement.querySelector('.kpi-value').textContent = data.billedToday.value;
    billedTodayElement.querySelector('.kpi-secondary').textContent = data.billedToday.secondary;
    
    // Update trend indicator
    const trendIcon = billedTodayElement.querySelector('.trend-indicator i');
    if (trendIcon) {
      trendIcon.className = data.billedToday.trend === 'up' 
        ? 'fas fa-arrow-up up' 
        : (data.billedToday.trend === 'down' ? 'fas fa-arrow-down down' : 'fas fa-minus neutral');
    }
  }
}

// The functions below would be implemented to update respective UI sections with data
// These are placeholders for now, as the focus is on error handling

function updateAccountsTable(data) {
  // Implementation would update the accounts receivable table with data
  if (data.error) return;
  console.log('Accounts data loaded successfully');
}

function updateInvoicesTable(data) {
  // Implementation would update the invoices table with data
  if (data.error) return;
  console.log('Invoices data loaded successfully');
}

function updateBillsHistoryChart(data) {
  // Implementation would update the bills history chart with data
  if (data.error) return;
  console.log('Bills history data loaded successfully');
}

function updateStockTable(data) {
  // Implementation would update the stock table with data
  if (data.error) return;
  console.log('Stock data loaded successfully');
}

function updateStockValueChart(data) {
  // Implementation would update the stock value chart with data
  if (data.error) return;
  console.log('Stock value by category data loaded successfully');
}

function updateStockSnapshotsChart(data) {
  // Implementation would update the stock snapshots chart with data
  if (data.error) return;
  console.log('Stock snapshots data loaded successfully');
}

function updateDiscontinuedStockTable(data) {
  // Implementation would update the discontinued stock table with data
  if (data.error) return;
  console.log('Discontinued stock data loaded successfully');
}

function updateDiscontinuedGroupedChart(data) {
  // Implementation would update the discontinued stock grouped chart with data
  if (data.error) return;
  console.log('Discontinued stock grouped data loaded successfully');
}