import dotenv from 'dotenv';
import path from 'path';

// Load env from the correct path (backend root)
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Checking Environment Variables...');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Present' : 'MISSING');

if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is missing.');
    process.exit(1);
} else {
    console.log('SUCCESS: All required API keys are present.');
}
