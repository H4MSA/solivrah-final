
// Entry point to run the TypeScript server
const path = require('path');

// Configure ts-node with the server's tsconfig
require('ts-node').register({
  project: path.join(__dirname, 'tsconfig.json'),
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS'
  }
});

// Load the TypeScript server
require('./index.ts');
