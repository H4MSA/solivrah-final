
import dotenv from 'dotenv';
import { startServer } from './server';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL', 
  'SUPABASE_KEY', 
  'OPENROUTER_API_KEY',
  'AI_MODEL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: Missing environment variable: ${envVar}`);
    
    // Set defaults for development if needed
    if (envVar === 'AI_MODEL') {
      process.env.AI_MODEL = 'deepseek/deepseek-coder';
      console.log('Using default AI model: deepseek/deepseek-coder');
    } 
    
    // Exit for critical variables
    if (['SUPABASE_URL', 'SUPABASE_KEY', 'OPENROUTER_API_KEY'].includes(envVar)) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

console.log('Starting server with configuration:');
console.log(`- AI Model: ${process.env.AI_MODEL}`);
console.log(`- Supabase URL: ${process.env.SUPABASE_URL?.substring(0, 20)}...`);

startServer();
