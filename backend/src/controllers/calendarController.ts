import { Request, Response } from 'express';
import CalendarEvent from '../models/CalendarEvent';

export const getUpcomingEvents = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const events = await CalendarEvent.find({
            date: { $gte: today }
        })
            .sort({ date: 1 })
            .limit(3);

        const formattedEvents = events.map(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);

            return {
                title: event.title,
                date: event.date.toISOString().split('T')[0],
                description: event.description,
                isToday: eventDate.getTime() === today.getTime()
            };
        });

        res.json({ upcoming: formattedEvents });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        const events = await CalendarEvent.find().sort({ date: 1 });
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const formattedEvents = events.map(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);

            return {
                title: event.title,
                date: event.date.toISOString().split('T')[0],
                description: event.description,
                isToday: eventDate.getTime() === today.getTime()
            };
        });

        res.json(formattedEvents);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
