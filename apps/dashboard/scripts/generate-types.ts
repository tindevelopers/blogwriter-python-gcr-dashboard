import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://blog-writer-api-dev-613248238610.europe-west9.run.app';
const OPENAPI_URL = `${API_URL}/openapi.json`;
const OUTPUT_FILE = path.join(process.cwd(), 'lib/api/types.ts');

async function generateTypes() {
  console.log('🔄 Fetching OpenAPI schema from:', OPENAPI_URL);
  
  try {
    // Use npx openapi-typescript to generate types
    const command = `npx openapi-typescript ${OPENAPI_URL} -o ${OUTPUT_FILE}`;
    
    console.log('⚙️  Generating TypeScript types...');
    await execAsync(command);
    
    console.log('✅ Types generated successfully at:', OUTPUT_FILE);
    console.log('\nYou can now use these types in your API client!');
    
  } catch (error) {
    console.error('❌ Error generating types:', error);
    process.exit(1);
  }
}

generateTypes();

