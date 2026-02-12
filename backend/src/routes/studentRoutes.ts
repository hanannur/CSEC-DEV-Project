import express from 'express';
import { getAnnouncements, getStudentSchedule, getKnowledgeBase, getDepartmentDocuments } from '../controllers/studentController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.use(protect);

router.get('/news', getAnnouncements);
router.get('/schedule', getStudentSchedule);

// Get documents by department/category
router.get('/documents', getDepartmentDocuments);

export default router;
