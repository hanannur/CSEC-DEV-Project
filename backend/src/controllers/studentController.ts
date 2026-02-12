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
        const docs = await Document.find({ status: 'Indexed', 'metadata.category': category }).select('name filename path createdAt');
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
