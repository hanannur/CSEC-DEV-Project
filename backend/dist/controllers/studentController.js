"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKnowledgeBase = exports.getStudentSchedule = exports.getAnnouncements = void 0;
const Academic_1 = require("../models/Academic");
const Document_1 = __importDefault(require("../models/Document"));
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Academic_1.Announcement.find().sort({ createdAt: -1 });
        res.json(announcements);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAnnouncements = getAnnouncements;
const getStudentSchedule = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const schedule = await Academic_1.Schedule.find({ userId: req.user._id });
        res.json(schedule);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getStudentSchedule = getStudentSchedule;
const getKnowledgeBase = async (req, res) => {
    try {
        const docs = await Document_1.default.find({ status: 'Indexed' }).select('name metadata createdAt');
        res.json(docs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getKnowledgeBase = getKnowledgeBase;
