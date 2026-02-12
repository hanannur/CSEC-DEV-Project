"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearHistory = exports.getHistory = exports.askAI = void 0;
const ChatHistory_1 = __importDefault(require("../models/ChatHistory"));
const ragService_1 = require("../services/ragService");
const askAI = async (req, res) => {
    try {
        const { question } = req.body;
        const query = question || req.body.query; // Support both for internal refs
        if (!query) {
            return res.status(400).json({ message: 'Question is required' });
        }
        // 1. Semantic Search: Find most relevant context based on embeddings
        const context = await (0, ragService_1.getRelevantContext)(query, 5);
        // 2. Generate response using RAG service with strict prompt
        const answer = await (0, ragService_1.generateAIResponse)(query, context);
        // 3. Save to chat history
        let history = await ChatHistory_1.default.findOne({ userId: req.user._id });
        if (!history) {
            history = new ChatHistory_1.default({ userId: req.user._id, messages: [] });
        }
        history.messages.push({ role: 'user', content: query, timestamp: new Date() });
        history.messages.push({ role: 'assistant', content: answer, timestamp: new Date() });
        history.lastInteraction = new Date();
        await history.save();
        res.json({ answer });
    }
    catch (error) {
        console.error('Chat AI Error:', error);
        res.status(500).json({ message: error.message });
    }
};
exports.askAI = askAI;
const getHistory = async (req, res) => {
    try {
        const history = await ChatHistory_1.default.findOne({ userId: req.user._id });
        if (!history) {
            return res.json({ messages: [] });
        }
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getHistory = getHistory;
const clearHistory = async (req, res) => {
    try {
        await ChatHistory_1.default.findOneAndDelete({ userId: req.user._id });
        res.json({ message: 'History cleared' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.clearHistory = clearHistory;
