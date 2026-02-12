"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEvents = exports.getUpcomingEvents = void 0;
const CalendarEvent_1 = __importDefault(require("../models/CalendarEvent"));
const getUpcomingEvents = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const events = await CalendarEvent_1.default.find({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUpcomingEvents = getUpcomingEvents;
const getAllEvents = async (req, res) => {
    try {
        const events = await CalendarEvent_1.default.find().sort({ date: 1 });
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllEvents = getAllEvents;
