// Configuration for Azure SQL Database connections
// SPISA Database Configuration
const spisaConfig = {
  user: process.env.SPISA_SQL_USER || '',
  password: process.env.SPISA_SQL_PASSWORD || '',
  server: process.env.SPISA_SQL_SERVER || '',
  database: process.env.SPISA_SQL_DATABASE || '',
  options: {
    encrypt: true, // For Azure SQL
    trustServerCertificate: false, // Change to true for local dev / self-signed certs
    enableArithAbort: true,
    requestTimeout: 30000 // 30 seconds timeout
  }
};

// XERP Database Configuration
const xerpConfig = {
  user: process.env.XERP_SQL_USER || '',
  password: process.env.XERP_SQL_PASSWORD || '',
  server: process.env.XERP_SQL_SERVER || '',
  database: process.env.XERP_SQL_DATABASE || '',
  options: {
    encrypt: true, // For Azure SQL
    trustServerCertificate: false, // Change to true for local dev / self-signed certs
    enableArithAbort: true,
    requestTimeout: 30000 // 30 seconds timeout
  }
};

// Export both configurations
module.exports = {
  spisa: spisaConfig,
  xerp: xerpConfig
};