"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const auth_1 = require("../middlewares/auth");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = express_1.default.Router();
router.use(auth_1.protect);
router.use(auth_1.admin);
router.get('/documents', adminController_1.getDocuments);
router.post('/documents/upload', upload_1.default.single('document'), adminController_1.uploadDocument);
router.post('/documents/embed-text', adminController_1.embedText);
router.get('/embeddings/:id', adminController_1.getEmbedding);
router.delete('/documents/:id', adminController_1.deleteDocument);
exports.default = router;
