
import { generateEmbedding } from './src/services/ragService';
import dotenv from 'dotenv';
dotenv.config();

async function testSrcEmbedding() {
    try {
        console.log('Testing generateEmbedding from src/services/ragService.ts...');
        const result = await generateEmbedding("This is a test.");
        console.log('✅ SUCCESS! Embedding length:', result.length);
    } catch (err: any) {
        console.error('❌ FAILED in src test:', err.message);
    }
}

testSrcEmbedding();
