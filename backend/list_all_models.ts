import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function main() {
    try {
        // Direct REST usage to list models because SDK might hide them or make it hard to list
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        console.log('Available Models:');
        if (data.models) {
            data.models.forEach((m: any) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('embedContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log('No models found or error listing models:', data);
        }
    } catch (err) {
        console.error(err);
    }
}

main();
