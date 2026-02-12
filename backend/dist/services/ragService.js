"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractCalendarEvents = exports.generateAIResponse = exports.getRelevantContext = exports.cosineSimilarity = exports.generateEmbedding = exports.chunkText = exports.extractTextFromFile = void 0;
const generative_ai_1 = require("@google/generative-ai");
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const Embedding_1 = __importDefault(require("../models/Embedding"));
const CalendarEvent_1 = __importDefault(require("../models/CalendarEvent"));
dotenv_1.default.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables. RAG service will not function correctly.');
}
if (!GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not defined in environment variables. RAG service will not function correctly.');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY || '');
const extractTextFromFile = async (filePath) => {
    const ext = path_1.default.extname(filePath).toLowerCase();
    const dataBuffer = fs_1.default.readFileSync(filePath);
    if (ext === '.pdf') {
        const data = await (0, pdf_parse_1.default)(dataBuffer);
        return data.text;
    }
    else if (ext === '.txt') {
        return dataBuffer.toString();
    }
    return '';
};
exports.extractTextFromFile = extractTextFromFile;
const chunkText = (text, size = 600, overlap = 100) => {
    const chunks = [];
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
exports.chunkText = chunkText;
const generateEmbedding = async (text) => {
    try {
        console.log(`[RAG] Generating embedding via Gemini: embedding-001`);
        const model = genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    }
    catch (error) {
        console.error('Gemini Embedding Error:', error);
        throw new Error(`Embedding failed: ${error.message}`);
    }
};
exports.generateEmbedding = generateEmbedding;
const cosineSimilarity = (vecA, vecB) => {
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
exports.cosineSimilarity = cosineSimilarity;
const getRelevantContext = async (query, topK = 5) => {
    const queryEmbedding = await (0, exports.generateEmbedding)(query);
    const allEmbeddings = await Embedding_1.default.find();
    const similarities = allEmbeddings.map(emb => ({
        text: emb.text,
        similarity: (0, exports.cosineSimilarity)(queryEmbedding, emb.embedding)
    }));
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities
        .slice(0, topK)
        .map(s => s.text)
        .join('\n\n---\n\n');
};
exports.getRelevantContext = getRelevantContext;
const generateAIResponse = async (query, context) => {
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
exports.generateAIResponse = generateAIResponse;
const extractCalendarEvents = async (text) => {
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
        let events = [];
        try {
            events = JSON.parse(jsonText);
        }
        catch (e) {
            console.error('Failed to parse calendar JSON:', jsonText);
            return;
        }
        if (Array.isArray(events) && events.length > 0) {
            // Clear old events to avoid duplicates when re-uploading
            await CalendarEvent_1.default.deleteMany({});
            const eventsToSave = events.map(event => ({
                title: event.title,
                date: new Date(event.date),
                description: event.description,
            }));
            await CalendarEvent_1.default.insertMany(eventsToSave);
            console.log(`Successfully extracted ${eventsToSave.length} calendar events.`);
        }
    }
    catch (error) {
        console.error('Error extracting calendar events:', error);
    }
};
exports.extractCalendarEvents = extractCalendarEvents;
