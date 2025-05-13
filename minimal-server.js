const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Database configurations
const spisaConfig = {
  user: process.env.SPISA_SQL_USER || '',
  password: process.env.SPISA_SQL_PASSWORD || '',
  server: process.env.SPISA_SQL_SERVER || '',
  database: process.env.SPISA_SQL_DATABASE || '',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000
  }
};

const xerpConfig = {
  user: process.env.XERP_SQL_USER || '',
  password: process.env.XERP_SQL_PASSWORD || '',
  server: process.env.XERP_SQL_SERVER || '',
  database: process.env.XERP_SQL_DATABASE || '',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectTimeout: 30000
  }
};

// Simple route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Check environment variables
app.get('/api/env', (req, res) => {
  res.json({
    spisa: {
      user: process.env.SPISA_SQL_USER ? 'Set' : 'Not set',
      password: process.env.SPISA_SQL_PASSWORD ? 'Set' : 'Not set',
      server: process.env.SPISA_SQL_SERVER ? 'Set' : 'Not set',
      database: process.env.SPISA_SQL_DATABASE ? 'Set' : 'Not set'
    },
    xerp: {
      user: process.env.XERP_SQL_USER ? 'Set' : 'Not set',
      password: process.env.XERP_SQL_PASSWORD ? 'Set' : 'Not set',
      server: process.env.XERP_SQL_SERVER ? 'Set' : 'Not set',
      database: process.env.XERP_SQL_DATABASE ? 'Set' : 'Not set'
    }
  });
});

// Test SPISA connection
app.get('/api/connect/spisa', async (req, res) => {
  try {
    console.log('Attempting to connect to SPISA database...');
    const pool = await sql.connect(spisaConfig);
    console.log('Connected to SPISA database.');
    
    // Test a simple query
    const result = await pool.request().query('SELECT 1 as test');
    
    res.json({
      success: true,
      message: 'Successfully connected to SPISA database',
      data: result.recordset,
      config: {
        server: spisaConfig.server,
        database: spisaConfig.database,
        user: spisaConfig.user ? 'Provided' : 'Missing'
      }
    });
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('SPISA connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to SPISA database',
      error: error.message
    });
  }
});

// Test XERP connection
app.get('/api/connect/xerp', async (req, res) => {
  try {
    console.log('Attempting to connect to XERP database...');
    const pool = await sql.connect(xerpConfig);
    console.log('Connected to XERP database.');
    
    // Test a simple query
    const result = await pool.request().query('SELECT 1 as test');
    
    res.json({
      success: true,
      message: 'Successfully connected to XERP database',
      data: result.recordset,
      config: {
        server: xerpConfig.server,
        database: xerpConfig.database,
        user: xerpConfig.user ? 'Provided' : 'Missing'
      }
    });
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('XERP connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to XERP database',
      error: error.message
    });
  }
});

// API endpoints for the dashboard data (placeholders for now)
// These will be connected to actual database calls once firewall access is granted

// Accounts Receivable endpoints
app.get('/api/accounts/balances', async (req, res) => {
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Execute query to get balance data (direct SQL instead of stored procedure)
    const result = await pool.request()
      .query(`
        SELECT 
          name,
          CONCAT('$', FORMAT(balance, '#,0.00')) AS balance,
          CONCAT('$', FORMAT(due, '#,0.00')) AS due,
          type
        FROM Accounts
        ORDER BY type, due DESC
      `);
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/accounts/future-payments', async (req, res) => {
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Direct SQL query for future payments (30, 60, 90 days)
    const result = await pool.request()
      .query(`
        SELECT
          SUM(CASE WHEN DueDate <= DATEADD(DAY, 30, GETDATE()) THEN Amount ELSE 0 END) AS PaymentAmount30,
          SUM(CASE WHEN DueDate BETWEEN DATEADD(DAY, 31, GETDATE()) AND DATEADD(DAY, 60, GETDATE()) THEN Amount ELSE 0 END) AS PaymentAmount60,
          SUM(CASE WHEN DueDate BETWEEN DATEADD(DAY, 61, GETDATE()) AND DATEADD(DAY, 90, GETDATE()) THEN Amount ELSE 0 END) AS PaymentAmount90
        FROM Payments
        WHERE DueDate <= DATEADD(DAY, 90, GETDATE()) AND Paid = 0
      `);
    
    // Format data into the expected structure
    const data = result.recordset[0];
    res.json({
      PaymentAmount: [
        data.PaymentAmount30 || 0,
        data.PaymentAmount60 || 0,
        data.PaymentAmount90 || 0
      ]
    });
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching future payments:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/accounts/due-balance', async (req, res) => {
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Direct SQL query for due balance
    const result = await pool.request()
      .query(`
        SELECT SUM(due) AS Due
        FROM Accounts
        WHERE due > 0
      `);
    
    res.json(result.recordset[0]);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching due balance:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// Invoices endpoints
app.get('/api/invoices/spisa-billed', async (req, res) => {
  const period = req.query.period || 'month';
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Build date filter based on period
    let dateFilter;
    if (period === 'day') {
      dateFilter = "WHERE CONVERT(date, InvoiceDate) = CONVERT(date, GETDATE())";
    } else if (period === 'month') {
      dateFilter = "WHERE MONTH(InvoiceDate) = MONTH(GETDATE()) AND YEAR(InvoiceDate) = YEAR(GETDATE())";
    } else {
      dateFilter = ""; // all time
    }
    
    // Direct SQL query to get billed amount
    const result = await pool.request()
      .query(`
        SELECT SUM(InvoiceAmount) AS InvoiceAmount
        FROM Invoices
        ${dateFilter}
      `);
    
    res.json(result.recordset[0]);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching SPISA billed amount:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/invoices/xerp-billed', async (req, res) => {
  const period = req.query.period || 'month';
  try {
    // Connect to XERP database
    const pool = await sql.connect(xerpConfig);
    
    // Execute stored procedure to get billed amount data
    const result = await pool.request()
      .input('period', sql.VarChar(10), period)
      .execute('sp_GetBilledAmount');
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching XERP billed amount:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/invoices/history', async (req, res) => {
  try {
    // Connect to XERP database
    const pool = await sql.connect(xerpConfig);
    
    // Execute stored procedure to get bills history data
    const result = await pool.request()
      .execute('sp_GetBillsHistory');
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching bills history:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/invoices/bills', async (req, res) => {
  const period = req.query.period || 'month';
  try {
    // Connect to XERP database
    const pool = await sql.connect(xerpConfig);
    
    // Execute stored procedure to get bills data
    const result = await pool.request()
      .input('period', sql.VarChar(10), period)
      .execute('sp_GetBills');
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/invoices/bill-items/:orderNo', async (req, res) => {
  const orderNo = req.params.orderNo;
  try {
    // Connect to XERP database
    const pool = await sql.connect(xerpConfig);
    
    // Execute stored procedure to get bill items data
    const result = await pool.request()
      .input('orderNo', sql.VarChar(50), orderNo)
      .execute('sp_GetBillItems');
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching bill items:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// Stock endpoints
app.get('/api/stock/items', async (req, res) => {
  try {
    // Get filter parameters
    const yearsSoldIn = parseInt(req.query.yearsSoldIn) || 2;
    const needsRestock = req.query.needsRestock === 'true';
    const categoryIds = req.query.categoryIds ? req.query.categoryIds.split(',') : [];
    const providerIds = req.query.providerIds ? req.query.providerIds.split(',') : [];
    const countryNames = req.query.countryNames ? req.query.countryNames.split(',') : [];
    
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Execute stored procedure to get stock items
    const request = pool.request()
      .input('yearsSoldIn', sql.Int, yearsSoldIn)
      .input('needsRestock', sql.Bit, needsRestock);
    
    // Add category filter if provided
    if (categoryIds.length > 0) {
      request.input('categoryIds', sql.VarChar(500), categoryIds.join(','));
    }
    
    // Add provider filter if provided
    if (providerIds.length > 0) {
      request.input('providerIds', sql.VarChar(500), providerIds.join(','));
    }
    
    // Add country filter if provided
    if (countryNames.length > 0) {
      request.input('countryNames', sql.VarChar(500), countryNames.join(','));
    }
    
    const result = await request.execute('sp_GetStockItems');
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching stock items:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/stock/value-by-category', async (req, res) => {
  const yearsSoldIn = parseInt(req.query.yearsSoldIn) || 2;
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Execute stored procedure to get stock value by category
    const result = await pool.request()
      .input('yearsSoldIn', sql.Int, yearsSoldIn)
      .execute('sp_GetStockValueByCategory');
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching stock value by category:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/stock/snapshots', async (req, res) => {
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Query to get stock snapshots (using direct SQL instead of stored procedure)
    const result = await pool.request()
      .query(`
        SELECT 
          CONVERT(VARCHAR(10), [Date], 120) AS Date, 
          SUM(StockValue) AS StockValue 
        FROM StockSnapshots
        GROUP BY CONVERT(VARCHAR(10), [Date], 120)
        ORDER BY Date
      `);
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching stock snapshots:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/stock/discontinued', async (req, res) => {
  const yearsNotSold = parseInt(req.query.yearsNotSold) || 10;
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Query to get discontinued stock (using direct SQL instead of stored procedure)
    const result = await pool.request()
      .input('yearsNotSold', sql.Int, yearsNotSold)
      .query(`
        SELECT 
          code,
          description,
          stock,
          category,
          CONVERT(VARCHAR(10), lastSale, 103) AS lastSale,
          CONCAT('$', FORMAT(value, '#,0.00')) AS value
        FROM Stock
        WHERE DATEDIFF(YEAR, lastSale, GETDATE()) >= @yearsNotSold
        ORDER BY value DESC
      `);
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching discontinued stock:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/stock/discontinued-grouped', async (req, res) => {
  const yearsNotSold = parseInt(req.query.yearsNotSold) || 10;
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Query to get discontinued stock grouped by category (using direct SQL instead of stored procedure)
    const result = await pool.request()
      .input('yearsNotSold', sql.Int, yearsNotSold)
      .query(`
        SELECT 
          category,
          SUM(value) AS stock_value
        FROM Stock
        WHERE DATEDIFF(YEAR, lastSale, GETDATE()) >= @yearsNotSold
        GROUP BY category
        ORDER BY stock_value DESC
      `);
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching discontinued stock grouped:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// Filter options endpoints
app.get('/api/filters/categories', async (req, res) => {
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Query to get distinct categories
    const result = await pool.request()
      .query(`
        SELECT 
          CAST(ROW_NUMBER() OVER (ORDER BY category) AS VARCHAR) AS id, 
          category AS name
        FROM (
          SELECT DISTINCT category
          FROM Stock
          WHERE category IS NOT NULL AND category != ''
        ) AS distinct_categories
        ORDER BY name
      `);
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/filters/providers', async (req, res) => {
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Query to get distinct providers
    const result = await pool.request()
      .query(`
        SELECT 
          CAST(ROW_NUMBER() OVER (ORDER BY provider) AS VARCHAR) AS id, 
          provider AS name
        FROM (
          SELECT DISTINCT provider
          FROM Stock
          WHERE provider IS NOT NULL AND provider != ''
        ) AS distinct_providers
        ORDER BY name
      `);
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

app.get('/api/filters/countries', async (req, res) => {
  try {
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Query to get distinct countries
    const result = await pool.request()
      .query(`
        SELECT 
          CAST(ROW_NUMBER() OVER (ORDER BY country) AS VARCHAR) AS id, 
          country AS name
        FROM (
          SELECT DISTINCT country
          FROM Stock
          WHERE country IS NOT NULL AND country != ''
        ) AS distinct_countries
        ORDER BY name
      `);
    
    res.json(result.recordset);
    
    // Close the connection
    pool.close();
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});

// Root route - serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});