"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const calendarRoutes_1 = __importDefault(require("./routes/calendarRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Core RAG Routes (Requested as direct endpoints)
// Core RAG Routes (Requested as direct endpoints)
// app.post('/api/upload', protect, admin, upload.single('document'), uploadDocument); // Moved to adminRoutes
// Scoped Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/student', studentRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/calendar', calendarRoutes_1.default);
// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to ጀማሪAI API' });
});
exports.default = app;
