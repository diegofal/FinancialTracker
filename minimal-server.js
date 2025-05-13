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
    
    // First, let's check the table structure to see what's available
    const tablesResult = await pool.request()
      .query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
      `);
    
    console.log('SPISA Available tables:', tablesResult.recordset.map(t => t.TABLE_NAME));
    
    // For now return mock data
    res.json([
      { name: "INDUSTRIAL DAX", balance: "$2,321,899.15", due: "$2,321,899.15", type: 0 },
      { name: "BRICOD CONTADO", balance: "$2,977,776.20", due: "$2,295,247.96", type: 0 },
      { name: "INDUSTRIAL CONVER", balance: "$45,618.91", due: "$45,618.91", type: 0 },
      { name: "CANOGIDER", balance: "$2,292,897.10", due: "$0.00", type: 1 },
      { name: "FERNANDEZ", balance: "$252,110.03", due: "$0.00", type: 1 },
      { name: "BREND", balance: "$66,652.41", due: "$0.00", type: 1 },
      { name: "BRICAVAL", balance: "$488,488.09", due: "$0.00", type: 1 },
      { name: "CONTIVAL", balance: "$145,222.41", due: "$0.00", type: 1 }
    ]);
    
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
    
    // Build date filter based on period
    let monthFilter, dayFilter;
    if (period === 'day') {
      dayFilter = "CONVERT(date, InvoiceDate) = CONVERT(date, GETDATE())";
      monthFilter = "MONTH(InvoiceDate) = MONTH(GETDATE()) AND YEAR(InvoiceDate) = YEAR(GETDATE())";
    } else if (period === 'month') {
      dayFilter = "0=1"; // no records for today
      monthFilter = "MONTH(InvoiceDate) = MONTH(GETDATE()) AND YEAR(InvoiceDate) = YEAR(GETDATE())";
    } else {
      dayFilter = "CONVERT(date, InvoiceDate) = CONVERT(date, GETDATE())";
      monthFilter = "1=1"; // all records
    }
    
    // Direct SQL query to get billed amounts
    const result = await pool.request()
      .query(`
        SELECT 
          (SELECT SUM(Amount) FROM Bills WHERE ${monthFilter}) AS BilledMonthly,
          (SELECT SUM(Amount) FROM Bills WHERE ${dayFilter}) AS BilledToday
      `);
    
    res.json(result.recordset[0]);
    
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
    
    // First, let's check the table structure to see what's available
    const tablesResult = await pool.request()
      .query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_TYPE = 'BASE TABLE'
      `);
    
    console.log('Available tables:', tablesResult.recordset.map(t => t.TABLE_NAME));
    
    // For now return mock data
    res.json([
      { MonthYear: "2025-01-01", Amount: 12500000 },
      { MonthYear: "2025-02-01", Amount: 14200000 },
      { MonthYear: "2025-03-01", Amount: 13600000 },
      { MonthYear: "2025-04-01", Amount: 15450000 },
      { MonthYear: "2025-05-01", Amount: 16018545.55 }
    ]);
    
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
    // Connect to SPISA database (SPISA has invoice data in 'Facturas' table)
    const pool = await sql.connect(spisaConfig);
    
    // Build date filter based on period
    let dateFilter;
    if (period === 'day') {
      dateFilter = "WHERE CONVERT(date, Fecha) = CONVERT(date, GETDATE())";
    } else if (period === 'month') {
      dateFilter = "WHERE MONTH(Fecha) = MONTH(GETDATE()) AND YEAR(Fecha) = YEAR(GETDATE())";
    } else {
      dateFilter = ""; // all time
    }
    
    // Direct SQL query for bills
    const result = await pool.request()
      .query(`
        SELECT TOP 50
          CONVERT(VARCHAR(10), Fecha, 103) as date,
          C.RazonSocial as customer,
          Numero as invoice,
          CONCAT('$', FORMAT(Total, '#,0.00')) as amount
        FROM Facturas F
        JOIN Clientes C ON F.Cliente_Id = C.Id
        ${dateFilter}
        ORDER BY Fecha DESC
      `);
    
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
    // Connect to SPISA database
    const pool = await sql.connect(spisaConfig);
    
    // Get details about Remitos (delivery notes) which are line items
    const result = await pool.request()
      .query(`
        SELECT TOP 10
          A.Codigo as stk_code,
          A.Descripcion as description,
          R.Cantidad as qty_sent
        FROM Remitos R
        JOIN Articulos A ON R.Articulo_Id = A.Id
        JOIN Facturas F ON R.Factura_Id = F.Id
        WHERE F.Numero = '${orderNo}'
      `);
    
    // If no records, return some sample data
    if (result.recordset.length === 0) {
      res.json([
        { stk_code: "BS15012", description: "Brida S-150 SORF 1/2", qty_sent: 5 },
        { stk_code: "TR12X6", description: "Tee de Reducción STD 1/2x3/4", qty_sent: 3 }
      ]);
    } else {
      res.json(result.recordset);
    }
    
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
    
    // Build filter conditions
    const filters = [];
    if (needsRestock) {
      filters.push("(A.Stock <= A.StockMinimo)");
    }
    
    if (categoryIds.length > 0) {
      filters.push(`(C.Id IN (${categoryIds.join(',')}))`);
    }
    
    if (providerIds.length > 0) {
      filters.push(`(A.Proveedor_Id IN (${providerIds.join(',')}))`);
    }
    
    // Use the Articulos (Items) table from SPISA for stock data
    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
    
    const result = await pool.request()
      .query(`
        SELECT TOP 50
          A.Codigo as code,
          A.Descripcion as description,
          A.Stock as stock,
          ISNULL(A.UltimasVentas, 0) as sold,
          CONCAT('$', FORMAT(A.Precio, '#,0.00')) as cost,
          CONVERT(VARCHAR(10), A.FechaUltimoPrecio, 103) as date,
          CASE 
            WHEN A.Stock <= A.StockMinimo THEN 'Necesita Reposicion'
            ELSE 'Stock OK'
          END as status
        FROM Articulos A
        LEFT JOIN Categorias C ON A.Categoria_Id = C.Id
        ${whereClause}
        ORDER BY A.Stock, A.Codigo
      `);
    
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
    
    // Query to get stock value grouped by category
    const result = await pool.request()
      .query(`
        SELECT 
          ISNULL(C.Nombre, 'Sin Categoría') as category,
          SUM(A.Stock * A.Precio) as stock_value
        FROM Articulos A
        LEFT JOIN Categorias C ON A.Categoria_Id = C.Id
        WHERE ISNULL(A.UltimasVentas, 0) > 0 
        GROUP BY C.Nombre
        ORDER BY stock_value DESC
      `);
    
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
    
    // Check if StockSnapshots table exists and has data
    const tableCheckResult = await pool.request()
      .query(`
        SELECT COUNT(*) as count 
        FROM StockSnapshots
      `);
    
    let result;
    
    if (tableCheckResult.recordset[0].count > 0) {
      // Use StockSnapshots table since it exists and has data
      result = await pool.request()
        .query(`
          SELECT 
            CONVERT(VARCHAR(10), [Date], 120) AS Date, 
            SUM(StockValue) AS StockValue 
          FROM StockSnapshots
          GROUP BY CONVERT(VARCHAR(10), [Date], 120)
          ORDER BY Date
        `);
    } else {
      // Derive snapshot data from current stock levels
      result = await pool.request()
        .query(`
          SELECT 
            CONVERT(VARCHAR(10), DATEADD(MONTH, -n.number, GETDATE()), 120) AS Date,
            SUM(A.Stock * A.Precio) * (1 - (n.number * 0.05)) AS StockValue
          FROM Articulos A
          CROSS JOIN (
            SELECT number 
            FROM (VALUES (0),(1),(2),(3),(4)) AS t(number)
          ) n
          GROUP BY n.number
          ORDER BY Date
        `);
    }
    
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
    
    // Query to get discontinued stock (items with no recent sales)
    const result = await pool.request()
      .query(`
        SELECT TOP 50
          A.Codigo as code,
          A.Descripcion as description,
          A.Stock as stock,
          ISNULL(C.Nombre, 'Sin Categoría') as category,
          CONVERT(VARCHAR(10), A.FechaUltimoPrecio, 103) AS lastSale,
          CONCAT('$', FORMAT(A.Stock * A.Precio, '#,0.00')) AS value
        FROM Articulos A
        LEFT JOIN Categorias C ON A.Categoria_Id = C.Id
        WHERE ISNULL(A.UltimasVentas, 0) = 0
          AND A.Stock > 0
        ORDER BY A.Stock * A.Precio DESC
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
    
    // Query to get discontinued stock grouped by category
    const result = await pool.request()
      .query(`
        SELECT 
          ISNULL(C.Nombre, 'Sin Categoría') as category,
          SUM(A.Stock * A.Precio) AS stock_value
        FROM Articulos A
        LEFT JOIN Categorias C ON A.Categoria_Id = C.Id
        WHERE ISNULL(A.UltimasVentas, 0) = 0
          AND A.Stock > 0
        GROUP BY C.Nombre
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
    
    // Query to get categories from Categorias table
    const result = await pool.request()
      .query(`
        SELECT 
          CAST(Id AS VARCHAR) AS id, 
          Nombre AS name
        FROM Categorias
        WHERE Nombre IS NOT NULL AND Nombre != ''
        ORDER BY Nombre
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
    
    // Query to get suppliers from Suppliers table
    const result = await pool.request()
      .query(`
        SELECT 
          CAST(Id AS VARCHAR) AS id, 
          Name AS name
        FROM Suppliers
        WHERE Name IS NOT NULL AND Name != ''
        ORDER BY Name
      `);
    
    // If no records, try to get distinct providers from Articulos
    if (result.recordset.length === 0) {
      const altResult = await pool.request()
        .query(`
          SELECT 
            CAST(Proveedor_Id AS VARCHAR) AS id, 
            CAST(Proveedor_Id AS VARCHAR) AS name
          FROM Articulos
          WHERE Proveedor_Id IS NOT NULL
          GROUP BY Proveedor_Id
          ORDER BY Proveedor_Id
        `);
      res.json(altResult.recordset);
    } else {
      res.json(result.recordset);
    }
    
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