// import express from 'express';
// import { askAI, getHistory, clearHistory } from '../controllers/chatController';
// import { protect } from '../middlewares/auth';

// const router = express.Router();

// router.use(protect);

// router.post('/ask', askAI);
// router.get('/history', getHistory);
// router.delete('/history', clearHistory);

// export default router;


import express from 'express';
import { 
    askAI, 
    getChatSessions, 
    getSessionHistory, 
    deleteSession, 
    renameSession 
} from '../controllers/chatController';
import { protect } from '../middlewares/auth';

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// 1. Ask a question (Handles creating new sessions or continuing old ones)
router.post('/ask', askAI);

// 2. Get all session summaries (For the "Today", "Yesterday" sidebar list)
router.get('/sessions', getChatSessions);

// 3. Get full message history for a specific session (When a user clicks a chat in history)
router.get('/history/:sessionId', getSessionHistory);

// 4. Update session title (Rename icon)
router.patch('/sessions/:id', renameSession);

// 5. Delete a specific conversation (Trash icon)
router.delete('/sessions/:id', deleteSession);

export default router;