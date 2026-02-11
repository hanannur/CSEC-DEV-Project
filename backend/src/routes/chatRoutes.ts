import express from 'express';
import { askAI, getHistory, clearHistory } from '../controllers/chatController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.use(protect);

router.post('/ask', askAI);
router.get('/history', getHistory);
router.delete('/history', clearHistory);

export default router;
