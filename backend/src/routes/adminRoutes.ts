import express from 'express';
import { uploadDocument, getDocuments, deleteDocument, embedText, getEmbedding } from '../controllers/adminController';
import { protect, admin } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/documents', getDocuments);
router.post('/documents/upload', upload.single('document'), uploadDocument);
router.post('/documents/embed-text', embedText);
router.get('/embeddings/:id', getEmbedding);
router.delete('/documents/:id', deleteDocument);

export default router;
