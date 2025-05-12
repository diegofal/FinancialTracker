const sql = require('mssql');
const dbConfig = require('./dbconfig');

// Pools to manage database connections
let spisaPool = null;
let xerpPool = null;

/**
 * Get connection pool for SPISA database
 * @returns {Promise<sql.ConnectionPool>} - SQL connection pool
 */
async function getSpisaPool() {
  if (!spisaPool) {
    try {
      spisaPool = await new sql.ConnectionPool(dbConfig.spisa).connect();
      console.log('Connected to SPISA database');
    } catch (err) {
      console.error('Error connecting to SPISA database:', err);
      throw err;
    }
  }
  return spisaPool;
}

/**
 * Get connection pool for XERP database
 * @returns {Promise<sql.ConnectionPool>} - SQL connection pool
 */
async function getXerpPool() {
  if (!xerpPool) {
    try {
      xerpPool = await new sql.ConnectionPool(dbConfig.xerp).connect();
      console.log('Connected to XERP database');
    } catch (err) {
      console.error('Error connecting to XERP database:', err);
      throw err;
    }
  }
  return xerpPool;
}

/**
 * Execute a stored procedure with parameters on SPISA database
 * @param {string} procedureName - Name of the stored procedure to execute
 * @param {Array} params - Array of parameter objects with name, type and value
 * @returns {Promise<any>} - Query results
 */
async function executeSpisaStoredProcedure(procedureName, params = []) {
  try {
    let pool = await getSpisaPool();
    let request = pool.request();

    // Add parameters to request
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });

    // Execute the stored procedure
    console.log(`Executing SPISA stored procedure: ${procedureName}`);
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (error) {
    console.error(`Error executing SPISA stored procedure ${procedureName}:`, error);
    throw error;
  }
}

/**
 * Execute a stored procedure with parameters on XERP database
 * @param {string} procedureName - Name of the stored procedure to execute
 * @param {Array} params - Array of parameter objects with name, type and value
 * @returns {Promise<any>} - Query results
 */
async function executeXerpStoredProcedure(procedureName, params = []) {
  try {
    let pool = await getXerpPool();
    let request = pool.request();

    // Add parameters to request
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });

    // Execute the stored procedure
    console.log(`Executing XERP stored procedure: ${procedureName}`);
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (error) {
    console.error(`Error executing XERP stored procedure ${procedureName}:`, error);
    throw error;
  }
}

// *** ACCOUNTS RECEIVABLE SERVICES ***

/**
 * Fetch SPISA balances (Accounts Receivable)
 * @returns {Promise<Array>} - List of balance items
 */
async function fetchSpisaBalances() {
  // Stored procedure: sp_GetSpisaBalances
  return executeSpisaStoredProcedure('sp_GetSpisaBalances');
}

/**
 * Fetch SPISA future payments
 * @returns {Promise<Object>} - Future payment data
 */
async function fetchSpisaFuturePayments() {
  // Stored procedure: sp_GetSpisaFuturePayments
  return executeSpisaStoredProcedure('sp_GetSpisaFuturePayments');
}

/**
 * Fetch SPISA due balance
 * @returns {Promise<Object>} - Due balance data
 */
async function fetchSpisaDueBalance() {
  // Stored procedure: sp_GetSpisaDueBalance
  return executeSpisaStoredProcedure('sp_GetSpisaDueBalance');
}

// *** INVOICES SERVICES ***

/**
 * Fetch SPISA billed amount for period
 * @param {string} period - 'month' or 'day'
 * @returns {Promise<Object>} - Billed amount data
 */
async function fetchSpisaBilled(period) {
  // Stored procedure: sp_GetSpisaBilled
  return executeSpisaStoredProcedure('sp_GetSpisaBilled', [
    { name: 'Period', type: sql.VarChar, value: period }
  ]);
}

/**
 * Fetch XERP billed amount for period
 * @param {string} period - 'month' or 'day'
 * @returns {Promise<Object>} - Billed amount data
 */
async function fetchXerpBilled(period) {
  // Stored procedure: sp_GetXerpBilled
  return executeXerpStoredProcedure('sp_GetXerpBilled', [
    { name: 'Period', type: sql.VarChar, value: period }
  ]);
}

/**
 * Fetch XERP bills history (monthly)
 * @returns {Promise<Array>} - Bill history items
 */
async function fetchXerpBillsHistory() {
  // Stored procedure: sp_GetXerpBillsHistory
  return executeXerpStoredProcedure('sp_GetXerpBillsHistory');
}

/**
 * Fetch XERP bills (invoices)
 * @param {string} filterPeriod - 'month', 'day', or 'all'
 * @returns {Promise<Array>} - Bill items
 */
async function fetchXerpBills(filterPeriod) {
  // Stored procedure: sp_GetXerpBills
  return executeXerpStoredProcedure('sp_GetXerpBills', [
    { name: 'FilterPeriod', type: sql.VarChar, value: filterPeriod }
  ]);
}

/**
 * Fetch XERP bill items (line items for an invoice)
 * @param {string} orderNo - Order number
 * @returns {Promise<Array>} - Bill line items
 */
async function fetchXerpBillItems(orderNo) {
  // Stored procedure: sp_GetXerpBillItems
  return executeXerpStoredProcedure('sp_GetXerpBillItems', [
    { name: 'OrderNo', type: sql.VarChar, value: orderNo }
  ]);
}

// *** STOCK SERVICES ***

/**
 * Fetch SPISA stock items
 * @param {Object} filters - Stock filters
 * @returns {Promise<Array>} - Stock items
 */
async function fetchSpisaStock(filters) {
  // Stored procedure: sp_GetSpisaStock
  return executeSpisaStoredProcedure('sp_GetSpisaStock', [
    { name: 'YearsSoldIn', type: sql.Int, value: filters.yearsSoldIn || 2 },
    { name: 'NeedsRestock', type: sql.Bit, value: filters.needsRestock || 0 },
    { name: 'CategoryIds', type: sql.VarChar, value: (filters.categoryIds || []).join(',') },
    { name: 'ProviderIds', type: sql.VarChar, value: (filters.providerIds || []).join(',') },
    { name: 'CountryNames', type: sql.VarChar, value: (filters.countryNames || []).join(',') }
  ]);
}

/**
 * Fetch SPISA stock value by category
 * @param {number} yearsSoldIn - Years sold in filter
 * @returns {Promise<Array>} - Stock value by category
 */
async function fetchSpisaStockValueByCategory(yearsSoldIn) {
  // Stored procedure: sp_GetSpisaStockValueByCategory
  return executeSpisaStoredProcedure('sp_GetSpisaStockValueByCategory', [
    { name: 'YearsSoldIn', type: sql.Int, value: yearsSoldIn || 2 }
  ]);
}

/**
 * Fetch SPISA stock snapshots (evolution)
 * @returns {Promise<Array>} - Stock snapshots over time
 */
async function fetchSpisaStockSnapshots() {
  // Stored procedure: sp_GetSpisaStockSnapshots
  return executeSpisaStoredProcedure('sp_GetSpisaStockSnapshots');
}

/**
 * Fetch SPISA discontinued stock items
 * @param {number} yearsNotSold - Years not sold filter
 * @returns {Promise<Array>} - Discontinued stock items
 */
async function fetchSpisaStockDiscontinued(yearsNotSold) {
  // Stored procedure: sp_GetSpisaStockDiscontinued
  return executeSpisaStoredProcedure('sp_GetSpisaStockDiscontinued', [
    { name: 'YearsNotSold', type: sql.Int, value: yearsNotSold || 10 }
  ]);
}

/**
 * Fetch SPISA discontinued stock grouped by category
 * @param {number} yearsNotSold - Years not sold filter
 * @returns {Promise<Array>} - Discontinued stock value by category
 */
async function fetchSpisaStockDiscontinuedGrouped(yearsNotSold) {
  // Stored procedure: sp_GetSpisaStockDiscontinuedGrouped
  return executeSpisaStoredProcedure('sp_GetSpisaStockDiscontinuedGrouped', [
    { name: 'YearsNotSold', type: sql.Int, value: yearsNotSold || 10 }
  ]);
}

// *** FILTER OPTION SERVICES ***

/**
 * Fetch stock categories for filtering
 * @returns {Promise<Array>} - Category filter options
 */
async function fetchStockCategories() {
  // Stored procedure: sp_GetStockCategories
  return executeSpisaStoredProcedure('sp_GetStockCategories');
}

/**
 * Fetch stock providers for filtering
 * @returns {Promise<Array>} - Provider filter options
 */
async function fetchStockProviders() {
  // Stored procedure: sp_GetStockProviders
  return executeSpisaStoredProcedure('sp_GetStockProviders');
}

/**
 * Fetch stock countries for filtering
 * @returns {Promise<Array>} - Country filter options
 */
async function fetchStockCountries() {
  // Stored procedure: sp_GetStockCountries
  return executeSpisaStoredProcedure('sp_GetStockCountries');
}

module.exports = {
  // Accounts Receivable
  fetchSpisaBalances,
  fetchSpisaFuturePayments,
  fetchSpisaDueBalance,
  
  // Invoices
  fetchSpisaBilled,
  fetchXerpBilled,
  fetchXerpBillsHistory,
  fetchXerpBills,
  fetchXerpBillItems,
  
  // Stock
  fetchSpisaStock,
  fetchSpisaStockValueByCategory,
  fetchSpisaStockSnapshots,
  fetchSpisaStockDiscontinued,
  fetchSpisaStockDiscontinuedGrouped,
  
  // Filter Options
  fetchStockCategories,
  fetchStockProviders,
  fetchStockCountries
};