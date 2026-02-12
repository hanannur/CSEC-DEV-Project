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

// export const chunkText = (text: string, size: number = 600, overlap: number = 100): string[] => {
//     const chunks: string[] = [];
//     const words = text.split(/\s+/);
//     let currentChunk = '';

//     for (const word of words) {
//         if ((currentChunk + word).length > size && currentChunk.length > 0) {
//             chunks.push(currentChunk.trim());
//             currentChunk = currentChunk.substring(currentChunk.length - overlap);
//         }
//         currentChunk += ` ${word}`;
//     }

//     if (currentChunk.trim().length > 0) {
//         chunks.push(currentChunk.trim());
//     }

//     return chunks;
// };

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

// export const generateEmbedding = async (text: string): Promise<number[]> => {
//     try {
//         console.log(`[RAG] Generating embedding via Gemini: embedding-001`);
//         const model = genAI.getGenerativeModel({ model: "embedding-001" });
//         const result = await model.embedContent(text);
//         const embedding = result.embedding;
//         return embedding.values;
//     } catch (error: any) {
//         console.error('Gemini Embedding Error:', error);
//         throw new Error(`Embedding failed: ${error.message}`);
//     }
// };
let cachedEmbeddingModel: string | null = null;

const discoverEmbeddingModel = async (): Promise<string> => {
    if (cachedEmbeddingModel) return cachedEmbeddingModel;
    try {
        const apiKey = GEMINI_API_KEY;
        const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const models = res.data.models || [];
        // Prefer models that explicitly include embedContent support and have 'embed' or 'embedding' in name
        const candidate = models.find((m: any) => m.supportedGenerationMethods?.includes('embedContent') && /embed/i.test(m.name));
        const fallback = models.find((m: any) => m.supportedGenerationMethods?.includes('embedContent'));
        const chosen = (candidate || fallback)?.name;
        if (!chosen) {
            console.warn('No embedding-capable models found from ListModels');
            throw new Error('No embedding model available');
        }
        cachedEmbeddingModel = chosen;
        console.log(`[RAG] Using embedding model: ${cachedEmbeddingModel}`);
        return cachedEmbeddingModel;
    } catch (err: any) {
        console.error('Failed to discover embedding model:', err?.response?.data || err.message || err);
        throw new Error('Failed to discover embedding model');
    }
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
    const endpointsToTry = [
        // prefer v1beta embedContent
        (model: string) => `https://generativelanguage.googleapis.com/v1beta/${model}:embedContent?key=${GEMINI_API_KEY}`,
        // try v1 beta embedText
        (model: string) => `https://generativelanguage.googleapis.com/v1beta/${model}:embedText?key=${GEMINI_API_KEY}`,
        // try v1 embedText
        (model: string) => `https://generativelanguage.googleapis.com/v1/${model}:embedText?key=${GEMINI_API_KEY}`,
        // try v1 embedContent
        (model: string) => `https://generativelanguage.googleapis.com/v1/${model}:embedContent?key=${GEMINI_API_KEY}`,
    ];

    const payloads = [
        { content: { parts: [{ text }] } },
        { input: text },
        { instances: [{ input: text }] },
    ];

    const modelName = await discoverEmbeddingModel();
    // modelName may be like 'models/gemini-embedding-001' or just 'gemini-embedding-001'
    const canonicalModel = modelName.startsWith('models/') ? modelName : `models/${modelName}`;

    // 1) Try SDK method first using common embedding model names
    const sdkCandidates = [
        'embedding-001',
        'gemini-embedding-001',
        canonicalModel.replace(/^models\//, ''),
    ];
    for (const sdkModelName of sdkCandidates) {
        try {
            const sdkModel = genAI.getGenerativeModel({ model: sdkModelName });
            if (sdkModel && typeof sdkModel.embedContent === 'function') {
                try {
                    const sdkRes: any = await sdkModel.embedContent(text);
                    const embedding = sdkRes?.embedding?.values || sdkRes?.embedding;
                    if (Array.isArray(embedding) && typeof embedding[0] === 'number') {
                        console.log(`[RAG] SDK embedding using ${sdkModelName}, length: ${embedding.length}`);
                        return embedding as number[];
                    }
                    console.warn(`[RAG] SDK ${sdkModelName} returned unexpected embedding shape:`, sdkRes);
                } catch (sdkCallErr) {
                    console.warn(`[RAG] SDK ${sdkModelName} embedContent call failed:`, sdkCallErr?.response?.data || sdkCallErr?.message || sdkCallErr);
                }
            } else {
                console.warn(`[RAG] SDK model ${sdkModelName} does not support embedContent`);
            }
        } catch (sdkErr) {
            console.warn(`[RAG] SDK getGenerativeModel(${sdkModelName}) failed:`, sdkErr?.message || sdkErr);
        }
    }

    for (const makeUrl of endpointsToTry) {
        const url = makeUrl(canonicalModel);
        for (const payload of payloads) {
            try {
                const response = await axios.post(url, payload);

                // Try several possible response shapes
                const embedding = response.data?.embedding?.values
                    || response.data?.result?.embedding?.values
                    || response.data?.data?.[0]?.embedding
                    || response.data?.data?.[0]?.embedding?.values
                    || response.data?.embedding;

                if (Array.isArray(embedding) && embedding.length > 0 && typeof embedding[0] === 'number') {
                    console.log(`[RAG] REST embedding length from ${url}: ${embedding.length}`);
                    return embedding as number[];
                }

                // Some endpoints return nested objects
                if (response.data?.data && Array.isArray(response.data.data) && response.data.data[0]?.embedding) {
                    const emb = response.data.data[0].embedding;
                    if (Array.isArray(emb)) return emb;
                    if (emb?.values) return emb.values;
                }

                console.warn('[RAG] Unexpected embedding response shape from', url, payload, response.data);
            } catch (err: any) {
                // If 404 for this endpoint, continue trying others
                const status = err?.response?.status;
                if (status === 404 || status === 400 || status === 401 || status === 403) {
                    console.warn(`[RAG] Embedding attempt failed (${status}) for ${url}:`, err?.response?.data || err.message);
                    // try next
                    continue;
                }
                console.error('[RAG] Embedding request error for', url, err?.response?.data || err.message || err);
            }
        }
    }

    throw new Error('Embedding failed for all tried endpoints. Check API key and model access.');
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
