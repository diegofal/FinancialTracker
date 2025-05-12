// Configuration for Azure SQL Database connection
const config = {
  user: process.env.SQL_USER || '',
  password: process.env.SQL_PASSWORD || '',
  server: process.env.SQL_SERVER || '',
  database: process.env.SQL_DATABASE || '',
  options: {
    encrypt: true, // For Azure SQL
    trustServerCertificate: false, // Change to true for local dev / self-signed certs
    enableArithAbort: true
  }
};

module.exports = config;