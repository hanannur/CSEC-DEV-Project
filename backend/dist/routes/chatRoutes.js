"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.post('/ask', chatController_1.askAI);
router.get('/history', chatController_1.getHistory);
router.delete('/history', chatController_1.clearHistory);
exports.default = router;
