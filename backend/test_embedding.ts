import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is missing.');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function listModels() {
    try {
        console.log('Fetching available models...');
        // Access the model service directly if possible, or try to get a model and inspect
        // The Node SDK doesn't expose listModels directly on genAI instance easily in all versions,
        // but let's try a direct fetch if the SDK method isn't obvious, or just try to use a known working model.
        // Actually, let's just try to embed with 'embedding-001' as a test.

        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        console.log('Testing embedding-001...');
        const result = await model.embedContent("Test string");
        console.log('Success! embedding-001 is working.');
        console.log('Embedding length:', result.embedding.values.length);

    } catch (error: any) {
        console.error('Error testing embedding-001:', error.message);
    }
}

listModels();
