
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testEmbeddingDirect() {
    try {
        console.log('Testing embedding via direct axios call...');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`;
        const data = {
            content: {
                parts: [{ text: "Hello world" }]
            }
        };
        const response = await axios.post(url, data);
        console.log('✅ SUCCESS! Embedding values length:', response.data.embedding?.values?.length);
    } catch (error: any) {
        console.error('❌ FAILED direct call:', error.response?.data || error.message);
    }
}

testEmbeddingDirect();
