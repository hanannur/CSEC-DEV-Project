import { Response } from 'express';
import ChatHistory from '../models/ChatHistory';
import { generateAIResponse, getRelevantContext } from '../services/ragService';
import { AuthRequest } from '../middlewares/auth';

export const askAI = async (req: AuthRequest, res: Response) => {
    try {
        const { question } = req.body;
        const query = question || req.body.query; // Support both for internal refs

        if (!query) {
            return res.status(400).json({ message: 'Question is required' });
        }

        // 1. Semantic Search: Find most relevant context based on embeddings
        const context = await getRelevantContext(query, 5);

        // 2. Generate response using RAG service with strict prompt
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

        res.json({ answer });
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
