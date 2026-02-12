import { Response } from 'express';
import ChatHistory from '../models/ChatHistory';
import { generateAIResponse, getRelevantContext } from '../services/ragService';
import { AuthRequest } from '../middlewares/auth';

export const askAI = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized. Please log in.' });
        }
        const { question } = req.body;
        const query = question || req.body.query;

        if (!query) {
            return res.status(400).json({ message: 'Question is required' });
        }

        let context = '';
        try {
            context = await getRelevantContext(query, 5);
        } catch (err: any) {
            console.error('Embedding/context error:', err);
            return res.status(500).json({ message: 'Failed to retrieve context/embeddings. ' + (err.message || err) });
        }

        let answer = '';
        try {
            answer = await generateAIResponse(query, context);
        } catch (err: any) {
            console.error('Gemini/generation error:', err);
            return res.status(500).json({ message: 'Failed to generate answer. ' + (err.message || err) });
        }

        try {
            let history = await ChatHistory.findOne({ userId: req.user._id });
            if (!history) {
                history = new ChatHistory({ userId: req.user._id, messages: [] });
            }
            history.messages.push({ role: 'user', content: query, timestamp: new Date() });
            history.messages.push({ role: 'assistant', content: answer, timestamp: new Date() });
            history.lastInteraction = new Date();
            await history.save();
        } catch (err: any) {
            console.error('Chat history save error:', err);
            // Don't block answer on history save
        }

        res.json({ answer });
    } catch (error) {
        console.error('Chat AI Error:', error);
        res.status(500).json({ message: 'Unknown server error: ' + (error as Error).message });
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
