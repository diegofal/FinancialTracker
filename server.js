const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

// Simple HTTP server to serve our files
const server = http.createServer((req, res) => {
  // Get the file path
  let filePath = req.url;
  
  // Default to index.html if the root path is requested
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Get the absolute path to the file
  filePath = path.join(__dirname, filePath);
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Set the content type based on file extension
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
  }
  
  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Page not found
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success - return the file content
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});