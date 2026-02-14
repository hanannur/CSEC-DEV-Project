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
const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY;
if (!GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables. RAG service will not function correctly.');
}

if (VOYAGE_API_KEY) {
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



export const chunkText = (text: string, size = 600, overlap = 100): string[] => {
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    let start = 0;

    while (start < words.length) {
        const end = Math.min(start + size, words.length);
        chunks.push(words.slice(start, end).join(" "));
        start += (size - overlap);
    }

    return chunks;
};




export const generateEmbedding = async (text: string): Promise<number[]> => {
    
      if (!VOYAGE_API_KEY) throw new Error('VOYAGE_API_KEY is not set in environment variables.');
    try {
        const response = await axios.post(
            'https://api.voyageai.com/v1/embeddings',
            {
                model: 'voyage-3-large',
                input: text
            },
            {
                headers: {
                    'Authorization': `Bearer ${VOYAGE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
            );
        let embedding = response.data?.data?.[0]?.embedding;
        if (Array.isArray(embedding) && embedding.length === 1024) {
            console.log('[RAG] Voyage embedding length:', embedding.length);
            return embedding;
        }

        // If batch, use first
        if (Array.isArray(embedding) && Array.isArray(embedding[0]) && embedding[0].length === 1024) {
            console.warn('[RAG] Voyage returned batch, using first vector.');
            return embedding[0];
        }
        throw new Error('Voyage API did not return a 1024-dim embedding.');
    } catch (err: any) {
        console.error('[RAG] Voyage embedding error:', err?.response?.data || err.message || err);
        throw new Error('Voyage embedding failed.');
    }
};


    export const logAllEmbeddingLengths = async () => {
    const all = await Embedding.find({}, { embedding: 1 });
    const dimCounts: Record<string, number> = {};
    all.forEach(e => {
        const len = Array.isArray(e.embedding) ? e.embedding.length : 'not-array';
        dimCounts[len] = (dimCounts[len] || 0) + 1;
    });
    console.log('Embedding dimension counts in DB:', dimCounts);
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


export const searchSimilarEmbeddings = async (query: string, topK: number = 5): Promise<string> => {
        // Generate embedding for the query
        const queryEmbedding = await generateEmbedding(query);
        // Use MongoDB Atlas vector search index for efficient similarity search
        const results = await Embedding.aggregate([
            {
                $vectorSearch: {
                    index: "default", // Change if your index name is different
                    path: "embedding",
                    queryVector: queryEmbedding,
                    numCandidates: 100, // Adjust as needed for recall/performance
                    limit: topK,
                    //similarity: "cosine"
                }
            },
            {
                $project: {
                    text: 1,
                    similarity: { $meta: "vectorSearchScore" }
                }
            }
        ]);
        return results.map(r => r.text).join('\n\n---\n\n');
    };
    
    // Backwards-compatible wrapper used by chatController
    export const getRelevantContext = async (query: string, topK: number = 5): Promise<string> => {
        return await searchSimilarEmbeddings(query, topK);
    };


export const generateAIResponse = async (query: string, context: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
