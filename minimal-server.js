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

// Root route - serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});