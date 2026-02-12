"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controllers/studentController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.get('/news', studentController_1.getAnnouncements);
router.get('/schedule', studentController_1.getStudentSchedule);
router.get('/knowledge-base', studentController_1.getKnowledgeBase);
exports.default = router;
