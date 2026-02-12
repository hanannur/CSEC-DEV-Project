import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import pdf from 'pdf-parse';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import Embedding from '../models/Embedding';
import CalendarEvent from '../models/CalendarEvent';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables. RAG service will not function correctly.');
}

if (!GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables. RAG service will not function correctly.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

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

export const chunkText = (text: string, size: number = 600, overlap: number = 100): string[] => {
    const chunks: string[] = [];
    const words = text.split(/\s+/);
    let currentChunk = '';

    for (const word of words) {
        if ((currentChunk + word).length > size && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = currentChunk.substring(currentChunk.length - overlap);
        }
        currentChunk += ` ${word}`;
    }

    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
    try {
        // Use "embedding-001" for better compatibility
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        
        // Using the object structure is safer for the v1beta API
        const result = await model.embedContent({
            content: { role: 'user', parts: [{ text }] }
        });
        
        return result.embedding.values;
    } catch (error: any) {
        console.error('Gemini Embedding Error:', error);
        throw new Error(`Embedding failed: ${error.message}`);
    }
};

export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const getRelevantContext = async (query: string, topK: number = 5): Promise<string> => {
    const queryEmbedding = await generateEmbedding(query);
    const allEmbeddings = await Embedding.find();

    const similarities = allEmbeddings.map(emb => ({
        text: emb.text,
        similarity: cosineSimilarity(queryEmbedding, emb.embedding)
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    return similarities
        .slice(0, topK)
        .map(s => s.text)
        .join('\n\n---\n\n');
};

export const generateAIResponse = async (query: string, context: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
    You are ጀማሪAI, an academic assistant for Adama Science and Technology University.
    Answer the student's question accurately ONLY using the provided context.
    If the information is not in the context, say: "I couldn't find that in the document."
    
    Context:
    ${context}
    
    Question: ${query}
    
    Answer:
  `;

    const result = await model.generateContent(prompt);
    return result.response.text();
};

export const extractCalendarEvents = async (text: string): Promise<void> => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
        You are a data extraction expert. Extract all academic events from the following text (likely an academic calendar).
        
        Focus on these types of events:
        - Registration (start/end)
        - Semester start/end
        - Add/Drop periods
        - Mid exams
        - Final exams
        - Breaks/Holidays
        - Graduation/Result announcements
        
        Return the data ONLY as a valid JSON array of objects with this schema:
        [
          {
            "title": "String",
            "date": "YYYY-MM-DD",
            "description": "Short description"
          }
        ]
        
        Rules:
        1. Only return the JSON. No conversational text.
        2. Ensure dates are in YYYY-MM-DD format. If only a month/day is available, assume year 2026.
        3. If no events are found, return an empty array [].
        
        Text to process:
        ${text.substring(0, 15000)}
      `;

        const result = await model.generateContent(prompt);
        const jsonText = result.response.text().replace(/```json|```/g, '').trim();

        let events: any[] = [];
        try {
            events = JSON.parse(jsonText);
        } catch (e) {
            console.error('Failed to parse calendar JSON:', jsonText);
            return;
        }

        if (Array.isArray(events) && events.length > 0) {
            // Clear old events to avoid duplicates when re-uploading
            await CalendarEvent.deleteMany({});

            const eventsToSave = events.map(event => ({
                title: event.title,
                date: new Date(event.date),
                description: event.description,
            }));

            await CalendarEvent.insertMany(eventsToSave);
            console.log(`Successfully extracted ${eventsToSave.length} calendar events.`);
        }
    } catch (error) {
        console.error('Error extracting calendar events:', error);
    }
};
