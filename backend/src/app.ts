import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import studentRoutes from './routes/studentRoutes';
import chatRoutes from './routes/chatRoutes';
import calendarRoutes from './routes/calendarRoutes';
import { uploadDocument } from './controllers/adminController';
import { protect, admin } from './middlewares/auth';
import upload from './middlewares/upload';

dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Core RAG Routes (Requested as direct endpoints)
// Core RAG Routes (Requested as direct endpoints)
// app.post('/api/upload', protect, admin, upload.single('document'), uploadDocument); // Moved to adminRoutes

// Scoped Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/calendar', calendarRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ጀማሪAI API' });
});

export default app;

