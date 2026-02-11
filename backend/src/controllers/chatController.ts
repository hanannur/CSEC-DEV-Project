import { Request, Response } from 'express';
import ChatHistory from '../models/ChatHistory';
import Document from '../models/Document';
import { generateAIResponse, extractTextFromFile } from '../services/ragService';
import { AuthRequest } from '../middlewares/auth';

export const askAI = async (req: any, res: Response) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        // 1. Retrieve all indexed documents for context
        const docs = await Document.find({ status: 'Indexed' });
        let context = '';

        for (const doc of docs) {
            const docText = await extractTextFromFile(doc.path);
            context += `\n--- Document: ${doc.name} ---\n${docText}\n`;
            if (context.length > 10000) break;
        }

        // 2. Generate response using RAG service
        const answer = await generateAIResponse(query, context);

        // 3. Save to chat history
        let history = await ChatHistory.findOne({ userId: req.user!._id });
        if (!history) {
            history = new ChatHistory({ userId: req.user!._id, messages: [] });
        }

        history.messages.push({ role: 'user', content: query, timestamp: new Date() });
        history.messages.push({ role: 'assistant', content: answer, timestamp: new Date() });
        history.lastInteraction = new Date();
        await history.save();

        res.json({ answer, history: history.messages });
    } catch (error) {
        console.error('Chat AI Error:', error);
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
    try {
        const history = await ChatHistory.findOne({ userId: req.user!._id });
        if (!history) {
            return res.json({ messages: [] });
        }
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const clearHistory = async (req: AuthRequest, res: Response) => {
    try {
        await ChatHistory.findOneAndDelete({ userId: req.user!._id });
        res.json({ message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
