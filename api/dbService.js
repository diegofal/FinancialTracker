const sql = require('mssql');
const config = require('./dbconfig');

/**
 * Execute a stored procedure with parameters
 * @param {string} procedureName - Name of the stored procedure to execute
 * @param {Array} params - Array of parameter objects with name, type and value
 * @returns {Promise<any>} - Query results
 */
async function executeStoredProcedure(procedureName, params = []) {
  try {
    let pool = await sql.connect(config);
    let request = pool.request();

    // Add parameters to request
    params.forEach(param => {
      request.input(param.name, param.type, param.value);
    });

    // Execute the stored procedure
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (error) {
    console.error(`Error executing stored procedure ${procedureName}:`, error);
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
  return executeStoredProcedure('sp_GetSpisaBalances');
}

/**
 * Fetch SPISA future payments
 * @returns {Promise<Object>} - Future payment data
 */
async function fetchSpisaFuturePayments() {
  // Stored procedure: sp_GetSpisaFuturePayments
  return executeStoredProcedure('sp_GetSpisaFuturePayments');
}

/**
 * Fetch SPISA due balance
 * @returns {Promise<Object>} - Due balance data
 */
async function fetchSpisaDueBalance() {
  // Stored procedure: sp_GetSpisaDueBalance
  return executeStoredProcedure('sp_GetSpisaDueBalance');
}

// *** INVOICES SERVICES ***

/**
 * Fetch SPISA billed amount for period
 * @param {string} period - 'month' or 'day'
 * @returns {Promise<Object>} - Billed amount data
 */
async function fetchSpisaBilled(period) {
  // Stored procedure: sp_GetSpisaBilled
  return executeStoredProcedure('sp_GetSpisaBilled', [
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
  return executeStoredProcedure('sp_GetXerpBilled', [
    { name: 'Period', type: sql.VarChar, value: period }
  ]);
}

/**
 * Fetch XERP bills history (monthly)
 * @returns {Promise<Array>} - Bill history items
 */
async function fetchXerpBillsHistory() {
  // Stored procedure: sp_GetXerpBillsHistory
  return executeStoredProcedure('sp_GetXerpBillsHistory');
}

/**
 * Fetch XERP bills (invoices)
 * @param {string} filterPeriod - 'month', 'day', or 'all'
 * @returns {Promise<Array>} - Bill items
 */
async function fetchXerpBills(filterPeriod) {
  // Stored procedure: sp_GetXerpBills
  return executeStoredProcedure('sp_GetXerpBills', [
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
  return executeStoredProcedure('sp_GetXerpBillItems', [
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
  return executeStoredProcedure('sp_GetSpisaStock', [
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
  return executeStoredProcedure('sp_GetSpisaStockValueByCategory', [
    { name: 'YearsSoldIn', type: sql.Int, value: yearsSoldIn || 2 }
  ]);
}

/**
 * Fetch SPISA stock snapshots (evolution)
 * @returns {Promise<Array>} - Stock snapshots over time
 */
async function fetchSpisaStockSnapshots() {
  // Stored procedure: sp_GetSpisaStockSnapshots
  return executeStoredProcedure('sp_GetSpisaStockSnapshots');
}

/**
 * Fetch SPISA discontinued stock items
 * @param {number} yearsNotSold - Years not sold filter
 * @returns {Promise<Array>} - Discontinued stock items
 */
async function fetchSpisaStockDiscontinued(yearsNotSold) {
  // Stored procedure: sp_GetSpisaStockDiscontinued
  return executeStoredProcedure('sp_GetSpisaStockDiscontinued', [
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
  return executeStoredProcedure('sp_GetSpisaStockDiscontinuedGrouped', [
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
  return executeStoredProcedure('sp_GetStockCategories');
}

/**
 * Fetch stock providers for filtering
 * @returns {Promise<Array>} - Provider filter options
 */
async function fetchStockProviders() {
  // Stored procedure: sp_GetStockProviders
  return executeStoredProcedure('sp_GetStockProviders');
}

/**
 * Fetch stock countries for filtering
 * @returns {Promise<Array>} - Country filter options
 */
async function fetchStockCountries() {
  // Stored procedure: sp_GetStockCountries
  return executeStoredProcedure('sp_GetStockCountries');
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