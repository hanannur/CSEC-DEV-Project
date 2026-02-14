// import { Response } from 'express';
// import ChatHistory from '../models/ChatHistory';
//  import { AuthRequest } from '../middlewares/auth';
//  import * as ragService from '../services/ragService';

// export const askAI = async (req: AuthRequest, res: Response) => {
    
//     try {
//         if (!req.user) {
//             return res.status(401).json({ message: 'Not authorized. Please log in.' });
//         }
//         const { question } = req.body;
//         const query = question || req.body.query;

//         if (!query) {
//             return res.status(400).json({ message: 'Question is required' });
//         }

//         let context = '';
//         try {
//                       if (typeof ragService.getRelevantContext !== 'function') {
//                 console.error('ragService.getRelevantContext is not a function', Object.keys(ragService));
//                 return res.status(500).json({ message: 'Failed to retrieve context/embeddings. ragService.getRelevantContext is not available' });
//             }
//             context = await ragService.getRelevantContext(query, 5);
//         } catch (err: any) {
//             console.error('Embedding/context error:', err);
//             return res.status(500).json({ message: 'Failed to retrieve context/embeddings. ' + (err.message || err) });
//         }

//         let answer = '';
//         try {
//              if (typeof ragService.generateAIResponse !== 'function') {
//                 console.error('ragService.generateAIResponse is not a function', Object.keys(ragService));
//                 return res.status(500).json({ message: 'Failed to generate answer. ragService.generateAIResponse is not available' });
//             }
//             answer = await ragService.generateAIResponse(query, context);
//         } catch (err: any) {
//             console.error('Gemini/generation error:', err);
//             return res.status(500).json({ message: 'Failed to generate answer. ' + (err.message || err) });
//         }

//         try {
//             let history = await ChatHistory.findOne({ userId: req.user._id });
//             if (!history) {
//                 history = new ChatHistory({ userId: req.user._id, messages: [] });
//             }
//             history.messages.push({ role: 'user', content: query, timestamp: new Date() });
//             history.messages.push({ role: 'assistant', content: answer, timestamp: new Date() });
//             history.lastInteraction = new Date();
//             await history.save();
//         } catch (err: any) {
//             console.error('Chat history save error:', err);
//             // Don't block answer on history save
//         }

//         res.json({ answer });
//     } catch (error) {
//         console.error('Chat AI Error:', error);
//         res.status(500).json({ message: 'Unknown server error: ' + (error as Error).message });
//     }
// };

// export const getHistory = async (req: AuthRequest, res: Response) => {
//     try {
//         const history = await ChatHistory.findOne({ userId: req.user!._id });
//         if (!history) {
//             return res.json({ messages: [] });
//         }
//         res.json(history);
//     } catch (error) {
//         res.status(500).json({ message: (error as Error).message });
//     }
// };

// export const clearHistory = async (req: AuthRequest, res: Response) => {
//     try {
//         await ChatHistory.findOneAndDelete({ userId: req.user!._id });
//         res.json({ message: 'History cleared' });
//     } catch (error) {
//         res.status(500).json({ message: (error as Error).message });
//     }
// };



import { Response } from 'express';
import ChatHistory from '../models/ChatHistory';
import { AuthRequest } from '../middlewares/auth';
import * as ragService from '../services/ragService';

/**
 * Handles asking a question. 
 * If sessionId is provided, it continues that chat. 
 * If not, it creates a new ChatHistory document (a new session).
 */
export const askAI = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized. Please log in.' });
        }

        const { question, sessionId } = req.body;
        const query = question || req.body.query;

        if (!query) {
            return res.status(400).json({ message: 'Question is required' });
        }

        // 1. Retrieve Context from RAG
        let context = '';
        try {
            if (typeof ragService.getRelevantContext !== 'function') {
                return res.status(500).json({ message: 'ragService.getRelevantContext is not available' });
            }
            context = await ragService.getRelevantContext(query, 5);
        } catch (err: any) {
            console.error('Context error:', err);
            return res.status(500).json({ message: 'Failed to retrieve context: ' + err.message });
        }

        // 2. Generate Answer via LLM
        let answer = '';
        try {
            if (typeof ragService.generateAIResponse !== 'function') {
                return res.status(500).json({ message: 'ragService.generateAIResponse is not available' });
            }
            answer = await ragService.generateAIResponse(query, context);
        } catch (err: any) {
            console.error('Generation error:', err);
            return res.status(500).json({ message: 'Failed to generate answer: ' + err.message });
        }

        // 3. Handle Session Logic
        let history;
        try {
            if (sessionId) {
                // Continue existing session
                history = await ChatHistory.findOne({ _id: sessionId, userId: req.user._id });
            }

            if (!history) {
                // Create a NEW session document
                // We use the first question (truncated) as the default title
                const defaultTitle = query.length > 30 ? query.substring(0, 30) + "..." : query;
                history = new ChatHistory({ 
                    userId: req.user._id, 
                    title: defaultTitle, 
                    messages: [] 
                });
            }

            history.messages.push({ role: 'user', content: query, timestamp: new Date() });
            history.messages.push({ role: 'assistant', content: answer, timestamp: new Date() });
            history.lastInteraction = new Date();
            await history.save();
        } catch (err: any) {
            console.error('Chat history save error:', err);
        }

        // Return answer AND the sessionId so the frontend can keep track
        res.json({ answer, sessionId: history?._id });
    } catch (error) {
        console.error('Chat AI Error:', error);
        res.status(500).json({ message: 'Unknown server error: ' + (error as Error).message });
    }
};

/**
 * GET /api/chat/sessions
 * Returns a list of all chat sessions for the sidebar
 */
export const getChatSessions = async (req: AuthRequest, res: Response) => {
    try {
        const sessions = await ChatHistory.find({ userId: req.user!._id })
            .sort({ updatedAt: -1 }) // Latest updated chat first
            .select('title updatedAt createdAt'); // Don't send full messages to save bandwidth
        
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

/**
 * GET /api/chat/history/:sessionId
 * Returns the full message history for one specific session
 */
export const getSessionHistory = async (req: AuthRequest, res: Response) => {
    try {
        const { sessionId } = req.params;
        const history = await ChatHistory.findOne({ _id: sessionId, userId: req.user!._id });
        
        if (!history) {
            return res.status(404).json({ message: 'Session not found' });
        }
        
        res.json({ messages: history.messages });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

/**
 * DELETE /api/chat/sessions/:id
 * Deletes a specific session
 */
export const deleteSession = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const result = await ChatHistory.findOneAndDelete({ _id: id, userId: req.user!._id });
        
        if (!result) {
            return res.status(404).json({ message: 'Session not found' });
        }
        
        res.json({ message: 'Conversation deleted' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

/**
 * PATCH /api/chat/sessions/:id
 * Renames a specific session
 */
export const renameSession = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        
        const history = await ChatHistory.findOneAndUpdate(
            { _id: id, userId: req.user!._id },
            { title },
            { new: true }
        );

        if (!history) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};