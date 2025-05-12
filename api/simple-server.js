const express = require('express');
const cors = require('cors');
const path = require('path');
const sql = require('mssql');
const dbConfig = require('./dbconfig');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Database connections
let spisaPool = null;
let xerpPool = null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API endpoint to test SPISA database connection
app.get('/api/test/spisa', async (req, res) => {
  try {
    if (!spisaPool) {
      spisaPool = await new sql.ConnectionPool(dbConfig.spisa).connect();
    }
    res.json({ 
      success: true, 
      message: 'Successfully connected to SPISA database',
      server: dbConfig.spisa.server,
      database: dbConfig.spisa.database
    });
  } catch (error) {
    console.error('SPISA connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect to SPISA database',
      error: error.message
    });
  }
});

// API endpoint to test XERP database connection
app.get('/api/test/xerp', async (req, res) => {
  try {
    if (!xerpPool) {
      xerpPool = await new sql.ConnectionPool(dbConfig.xerp).connect();
    }
    res.json({ 
      success: true, 
      message: 'Successfully connected to XERP database',
      server: dbConfig.xerp.server,
      database: dbConfig.xerp.database
    });
  } catch (error) {
    console.error('XERP connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect to XERP database',
      error: error.message
    });
  }
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