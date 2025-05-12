const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// First build the web app
console.log('Building the web app...');
exec('npx expo export:web', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building app: ${error}`);
    return;
  }
  
  console.log('Build completed. Starting server...');
  
  // Now start the server to serve the built files
  require('./server.js');
});