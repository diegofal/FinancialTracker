const express = require('express');
const cors = require('cors');
const dbService = require('./dbService');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Helper function to handle API responses
function handleApiResponse(res, apiCall) {
  return apiCall
    .then(data => res.json(data))
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: error.message || 'An error occurred while fetching data' });
    });
}

// *** API ROUTES ***

// Accounts Receivable
app.get('/api/accounts/balances', (req, res) => {
  handleApiResponse(res, dbService.fetchSpisaBalances());
});

app.get('/api/accounts/future-payments', (req, res) => {
  handleApiResponse(res, dbService.fetchSpisaFuturePayments());
});

app.get('/api/accounts/due-balance', (req, res) => {
  handleApiResponse(res, dbService.fetchSpisaDueBalance());
});

// Invoices
app.get('/api/invoices/spisa-billed', (req, res) => {
  const period = req.query.period || 'month';
  handleApiResponse(res, dbService.fetchSpisaBilled(period));
});

app.get('/api/invoices/xerp-billed', (req, res) => {
  const period = req.query.period || 'month';
  handleApiResponse(res, dbService.fetchXerpBilled(period));
});

app.get('/api/invoices/history', (req, res) => {
  handleApiResponse(res, dbService.fetchXerpBillsHistory());
});

app.get('/api/invoices/bills', (req, res) => {
  const period = req.query.period || 'month';
  handleApiResponse(res, dbService.fetchXerpBills(period));
});

app.get('/api/invoices/bill-items/:orderNo', (req, res) => {
  const orderNo = req.params.orderNo;
  handleApiResponse(res, dbService.fetchXerpBillItems(orderNo));
});

// Stock
app.get('/api/stock/items', (req, res) => {
  const filters = {
    yearsSoldIn: parseInt(req.query.yearsSoldIn) || 2,
    needsRestock: req.query.needsRestock === 'true' ? 1 : 0,
    categoryIds: req.query.categoryIds ? req.query.categoryIds.split(',') : [],
    providerIds: req.query.providerIds ? req.query.providerIds.split(',') : [],
    countryNames: req.query.countryNames ? req.query.countryNames.split(',') : []
  };
  handleApiResponse(res, dbService.fetchSpisaStock(filters));
});

app.get('/api/stock/value-by-category', (req, res) => {
  const yearsSoldIn = parseInt(req.query.yearsSoldIn) || 2;
  handleApiResponse(res, dbService.fetchSpisaStockValueByCategory(yearsSoldIn));
});

app.get('/api/stock/snapshots', (req, res) => {
  handleApiResponse(res, dbService.fetchSpisaStockSnapshots());
});

app.get('/api/stock/discontinued', (req, res) => {
  const yearsNotSold = parseInt(req.query.yearsNotSold) || 10;
  handleApiResponse(res, dbService.fetchSpisaStockDiscontinued(yearsNotSold));
});

app.get('/api/stock/discontinued-grouped', (req, res) => {
  const yearsNotSold = parseInt(req.query.yearsNotSold) || 10;
  handleApiResponse(res, dbService.fetchSpisaStockDiscontinuedGrouped(yearsNotSold));
});

// Filter options
app.get('/api/filters/categories', (req, res) => {
  handleApiResponse(res, dbService.fetchStockCategories());
});

app.get('/api/filters/providers', (req, res) => {
  handleApiResponse(res, dbService.fetchStockProviders());
});

app.get('/api/filters/countries', (req, res) => {
  handleApiResponse(res, dbService.fetchStockCountries());
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Serve the main HTML file for any other route (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

module.exports = app;