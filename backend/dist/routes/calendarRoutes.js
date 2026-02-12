"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calendarController_1 = require("../controllers/calendarController");
const router = express_1.default.Router();
router.get('/upcoming', calendarController_1.getUpcomingEvents);
router.get('/all', calendarController_1.getAllEvents);
exports.default = router;
