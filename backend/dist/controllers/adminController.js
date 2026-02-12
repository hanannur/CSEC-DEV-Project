"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.getDocuments = exports.uploadDocument = exports.getEmbedding = exports.embedText = void 0;
const Document_1 = __importDefault(require("../models/Document"));
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const ragService_1 = require("../services/ragService");
const Embedding_1 = __importDefault(require("../models/Embedding"));
const embedText = async (req, res) => {
    try {
        const { text, name, category } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Text content is required' });
        }
        // 1. Create a "Virtual" Document record for tracking
        const document = await Document_1.default.create({
            name: name || `Text-Embed-${Date.now()}`,
            filename: 'manual_text_input',
            path: 'memory', // Not a physical file
            size: Buffer.byteLength(text),
            type: 'text/plain',
            status: 'Processing',
            metadata: {
                category: category || 'General',
                uploadedBy: req.user._id,
                isManual: true
            }
        });
        // 2. Chunk and Embed
        const chunks = (0, ragService_1.chunkText)(text);
        const embeddingIds = [];
        for (const chunk of chunks) {
            const vector = await (0, ragService_1.generateEmbedding)(chunk);
            const emb = await Embedding_1.default.create({
                documentId: document._id,
                text: chunk,
                embedding: vector
            });
            embeddingIds.push(emb._id);
        }
        document.chunks = embeddingIds;
        document.status = 'Indexed';
        await document.save();
        res.status(201).json({
            message: 'Text embedded successfully',
            documentId: document._id,
            chunks: chunks.length
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.embedText = embedText;
const getEmbedding = async (req, res) => {
    try {
        const embedding = await Embedding_1.default.findById(req.params.id);
        if (!embedding) {
            return res.status(404).json({ message: 'Embedding not found' });
        }
        res.json({
            id: embedding._id,
            text: embedding.text,
            dimensions: embedding.embedding.length,
            vector: embedding.embedding // This will be the 1024 items
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getEmbedding = getEmbedding;
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const { name, category } = req.body;
        // Create document record
        const document = await Document_1.default.create({
            name: name || req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            type: req.file.mimetype,
            status: 'Processing',
            metadata: {
                category: category || 'General',
                uploadedBy: req.user._id
            }
        });
        // Index the document (Waiting for completion as per user request to return chunk count)
        const chunksIndexed = await processDocument(document._id.toString());
        res.status(201).json({
            message: 'PDF uploaded and indexed successfully',
            chunksIndexed
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.uploadDocument = uploadDocument;
const getDocuments = async (req, res) => {
    try {
        const documents = await Document_1.default.find().populate('metadata.uploadedBy', 'name');
        res.json(documents);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDocuments = getDocuments;
const deleteDocument = async (req, res) => {
    try {
        const document = await Document_1.default.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        // Remove embeddings associated with this document
        await Embedding_1.default.deleteMany({ documentId: document._id });
        // Remove file from disk
        if (fs_1.default.existsSync(document.path)) {
            fs_1.default.unlinkSync(document.path);
        }
        await document.deleteOne();
        res.json({ message: 'Document removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteDocument = deleteDocument;
// Internal utility to process document
const processDocument = async (docId) => {
    try {
        const doc = await Document_1.default.findById(docId);
        if (!doc)
            return 0;
        const dataBuffer = fs_1.default.readFileSync(doc.path);
        let extractedText = '';
        // Basic text extraction for PDF and TXT
        if (doc.type === 'application/pdf') {
            const data = await (0, pdf_parse_1.default)(dataBuffer);
            extractedText = data.text;
        }
        else if (doc.type === 'text/plain') {
            extractedText = dataBuffer.toString();
        }
        let chunkCount = 0;
        if (extractedText) {
            // 1. Chunk text
            const chunks = (0, ragService_1.chunkText)(extractedText);
            chunkCount = chunks.length;
            // 2. Clear old embeddings if any (re-processing)
            await Embedding_1.default.deleteMany({ documentId: doc._id });
            // 3. Generate and save embeddings for each chunk
            const embeddingIds = [];
            for (const chunk of chunks) {
                const vector = await (0, ragService_1.generateEmbedding)(chunk);
                const emb = await Embedding_1.default.create({
                    documentId: doc._id,
                    text: chunk,
                    embedding: vector
                });
                embeddingIds.push(emb._id);
            }
            doc.chunks = embeddingIds;
            console.log(`Indexed ${chunks.length} chunks for ${doc.name}`);
            // 4. If it's a calendar, extract events
            const lowerName = doc.name.toLowerCase();
            if (lowerName.includes('calendar') || lowerName.includes('schedule') || extractedText.toLowerCase().includes('academic calendar')) {
                console.log(`Detecting calendar keywords in ${doc.name}, starting extraction...`);
                await (0, ragService_1.extractCalendarEvents)(extractedText);
            }
        }
        doc.status = 'Indexed';
        await doc.save();
        return chunkCount;
    }
    catch (error) {
        console.error(`Error processing document ${docId}:`, error);
        await Document_1.default.findByIdAndUpdate(docId, {
            status: 'Error',
            errorMessage: error.message || 'Unknown error occurred'
        });
        return 0;
    }
};
