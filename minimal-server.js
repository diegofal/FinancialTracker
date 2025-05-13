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
app.get('/api/accounts/balances', (req, res) => {
  res.json({ 
    message: 'This endpoint will return account balances from SPISA database once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/accounts/future-payments', (req, res) => {
  res.json({ 
    message: 'This endpoint will return future payments data from SPISA database once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/accounts/due-balance', (req, res) => {
  res.json({ 
    message: 'This endpoint will return due balance data from SPISA database once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

// Invoices endpoints
app.get('/api/invoices/spisa-billed', (req, res) => {
  const period = req.query.period || 'month';
  res.json({ 
    message: `This endpoint will return SPISA billed amount for period ${period} once firewall access is granted`,
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/invoices/xerp-billed', (req, res) => {
  const period = req.query.period || 'month';
  res.json({ 
    message: `This endpoint will return XERP billed amount for period ${period} once firewall access is granted`,
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/invoices/history', (req, res) => {
  res.json({ 
    message: 'This endpoint will return XERP bills history once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/invoices/bills', (req, res) => {
  const period = req.query.period || 'month';
  res.json({ 
    message: `This endpoint will return XERP bills for period ${period} once firewall access is granted`,
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/invoices/bill-items/:orderNo', (req, res) => {
  const orderNo = req.params.orderNo;
  res.json({ 
    message: `This endpoint will return XERP bill items for order ${orderNo} once firewall access is granted`,
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

// Stock endpoints
app.get('/api/stock/items', (req, res) => {
  res.json({ 
    message: 'This endpoint will return SPISA stock items once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/stock/value-by-category', (req, res) => {
  const yearsSoldIn = parseInt(req.query.yearsSoldIn) || 2;
  res.json({ 
    message: `This endpoint will return SPISA stock value by category for years sold in ${yearsSoldIn} once firewall access is granted`,
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/stock/snapshots', (req, res) => {
  res.json({ 
    message: 'This endpoint will return SPISA stock snapshots once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/stock/discontinued', (req, res) => {
  const yearsNotSold = parseInt(req.query.yearsNotSold) || 10;
  res.json({ 
    message: `This endpoint will return SPISA discontinued stock for years not sold ${yearsNotSold} once firewall access is granted`,
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/stock/discontinued-grouped', (req, res) => {
  const yearsNotSold = parseInt(req.query.yearsNotSold) || 10;
  res.json({ 
    message: `This endpoint will return SPISA discontinued stock grouped by category for years not sold ${yearsNotSold} once firewall access is granted`,
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

// Filter options endpoints
app.get('/api/filters/categories', (req, res) => {
  res.json({ 
    message: 'This endpoint will return stock categories once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/filters/providers', (req, res) => {
  res.json({ 
    message: 'This endpoint will return stock providers once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

app.get('/api/filters/countries', (req, res) => {
  res.json({ 
    message: 'This endpoint will return stock countries once firewall access is granted',
    status: 'pending_firewall_access',
    ip: '34.74.143.228'
  });
});

// Root route - serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});