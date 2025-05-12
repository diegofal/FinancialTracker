/**
 * API client for the Financial & Inventory Dashboard
 * Handles all requests to the backend API for fetching data
 */

// Base URL for API requests
const API_BASE_URL = window.location.origin;

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  return response.json();
}

// Helper function to make GET requests
async function fetchData(endpoint, params = {}) {
  // Build query string from params
  const queryParams = Object.keys(params).length > 0
    ? '?' + new URLSearchParams(params).toString()
    : '';
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}${queryParams}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * API client object with methods for all data endpoints
 */
const api = {
  // Health check
  checkHealth: () => fetchData('/api/health'),
  
  // Accounts Receivable
  fetchBalances: () => fetchData('/api/accounts/balances'),
  fetchFuturePayments: () => fetchData('/api/accounts/future-payments'),
  fetchDueBalance: () => fetchData('/api/accounts/due-balance'),
  
  // Invoices
  fetchSpisaBilled: (period) => fetchData('/api/invoices/spisa-billed', { period }),
  fetchXerpBilled: (period) => fetchData('/api/invoices/xerp-billed', { period }),
  fetchBillsHistory: () => fetchData('/api/invoices/history'),
  fetchBills: (period) => fetchData('/api/invoices/bills', { period }),
  fetchBillItems: (orderNo) => fetchData(`/api/invoices/bill-items/${orderNo}`),
  
  // Stock
  fetchStock: (filters = {}) => fetchData('/api/stock/items', filters),
  fetchStockValueByCategory: (yearsSoldIn) => fetchData('/api/stock/value-by-category', { yearsSoldIn }),
  fetchStockSnapshots: () => fetchData('/api/stock/snapshots'),
  fetchStockDiscontinued: (yearsNotSold) => fetchData('/api/stock/discontinued', { yearsNotSold }),
  fetchStockDiscontinuedGrouped: (yearsNotSold) => fetchData('/api/stock/discontinued-grouped', { yearsNotSold }),
  
  // Filter Options
  fetchStockCategories: () => fetchData('/api/filters/categories'),
  fetchStockProviders: () => fetchData('/api/filters/providers'),
  fetchStockCountries: () => fetchData('/api/filters/countries')
};

// Make API client available globally
window.DashboardAPI = api;