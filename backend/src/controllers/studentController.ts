import { Request, Response } from 'express';
import { Announcement, Schedule } from '../models/Academic';
import Document from '../models/Document';
import { AuthRequest } from '../middlewares/auth';

export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getStudentSchedule = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const schedule = await Schedule.find({ userId: req.user._id });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};


// Get all knowledge base documents
export const getKnowledgeBase = async (req: Request, res: Response) => {
    try {
        const docs = await Document.find({ status: 'Indexed' }).select('name metadata createdAt');
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Get documents by department/category
export const getDepartmentDocuments = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        if (!category) {
            return res.status(400).json({ message: 'Category is required' });
        }
        // Try to fetch real documents
        const docs = await Document.find({ status: 'Indexed', 'metadata.category': category }).select('name filename path createdAt');
        if (docs.length > 0) {
            return res.json(docs);
        }
        // If no real docs, return dummy data for demo
        // You can add more dummy entries as needed
        if (category === 'Applied Mathematics') {
            return res.json([
                {
                    name: 'Applied Mathematics Syllabus 2026',
                    filename: 'applied-math-syllabus.pdf',
                    path: '/static/dummy/applied-math-syllabus.pdf',
                    createdAt: new Date().toISOString()
                },
                {
                    name: 'Mathematics Student Guide',
                    filename: 'math-guide.pdf',
                    path: '/static/dummy/math-guide.pdf',
                    createdAt: new Date().toISOString()
                }
            ]);
        }
        // Default: no docs
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
