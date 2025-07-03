
// Entry point to run the TypeScript server
require('ts-node').register({
  project: './server/tsconfig.json'
});
require('./index.ts');
