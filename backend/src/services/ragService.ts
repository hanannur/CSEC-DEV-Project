import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import pdf from 'pdf-parse';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface RAGResult {
    text: string;
    sources: string[];
}

export const extractTextFromFile = async (filePath: string): Promise<string> => {
    const ext = path.extname(filePath).toLowerCase();
    const dataBuffer = fs.readFileSync(filePath);

    if (ext === '.pdf') {
        const data = await pdf(dataBuffer);
        return data.text;
    } else if (ext === '.txt') {
        return dataBuffer.toString();
    }

    return '';
};

export const chunkText = (text: string, size: number = 1000, overlap: number = 200): string[] => {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + size, text.length);
        chunks.push(text.substring(start, end));
        start += size - overlap;
    }

    return chunks;
};

// Note: For a real vector store, we'd use something like Pinecone or ChromaDB.
// Here, we'll implement a simple in-memory semantic search or just use plain LLM if small.
// For this task, I'll store chunks in local files/DB and use cosine similarity on embeddings.

export const generateAIResponse = async (query: string, context: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    You are ጀማሪAI, an academic assistant for Adama Science and Technology University.
    Use the following context to answer the student's question accurately.
    If the information is not in the context, say you don't know based on the documents.
    
    Context:
    ${context}
    
    Question: ${query}
    
    Answer:
  `;

    const result = await model.generateContent(prompt);
    return result.response.text();
};
