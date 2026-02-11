import express from 'express';
import { getUpcomingEvents, getAllEvents } from '../controllers/calendarController';

const router = express.Router();

router.get('/upcoming', getUpcomingEvents);
router.get('/all', getAllEvents);

export default router;
