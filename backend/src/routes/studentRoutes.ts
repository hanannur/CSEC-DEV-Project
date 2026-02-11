import express from 'express';
import { getAnnouncements, getStudentSchedule, getKnowledgeBase } from '../controllers/studentController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.use(protect);

router.get('/news', getAnnouncements);
router.get('/schedule', getStudentSchedule);
router.get('/knowledge-base', getKnowledgeBase);

export default router;
