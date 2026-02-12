import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Document from '../models/Document';
import fs from 'fs';
import pdf from 'pdf-parse';
import { chunkText, generateEmbedding, extractCalendarEvents, extractTextFromFile } from '../services/ragService';
import Embedding from '../models/Embedding';

export const embedText = async (req: any, res: Response) => {
    try {
        const { text, name, category } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Text content is required' });
        }

        // 1. Create a "Virtual" Document record for tracking
        const document = await Document.create({
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
        const chunks = chunkText(text);
        const embeddingIds: any[] = [];
        for (const chunk of chunks) {
            const vector = await generateEmbedding(chunk);
            const emb = await Embedding.create({
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
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getEmbedding = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        console.log(`getEmbedding called with id=${id}`);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid embedding id' });
        }

        const embedding = await Embedding.findById(id);
        if (!embedding) {
            const count = await Embedding.countDocuments({ _id: id });
            const total = await Embedding.countDocuments();
            const sample = await Embedding.findOne().select('_id').lean();
            console.warn(`Embedding ${id} not found (countDocuments=${count}). Total embeddings=${total}, sampleId=${sample?._id}`);
            return res.status(404).json({ message: 'Embedding not found' });
        }
        res.json({
            id: embedding._id,
            text: embedding.text,
            dimensions: embedding.embedding.length,
            vector: embedding.embedding // This will be the 1024 items
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const uploadDocument = async (req: any, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { name, category } = req.body;

        // Create document record
        const document = await Document.create({
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
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const documents = await Document.find().populate('metadata.uploadedBy', 'name');
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Remove embeddings associated with this document
        await Embedding.deleteMany({ documentId: document._id });

        // Remove file from disk
        if (fs.existsSync(document.path)) {
            fs.unlinkSync(document.path);
        }

        await document.deleteOne();
        res.json({ message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Internal utility to process document
const processDocument = async (docId: string): Promise<number> => {
    try {
        const doc = await Document.findById(docId);
        if (!doc) return 0;

        const dataBuffer = fs.readFileSync(doc.path);
        let extractedText = '';

        // Basic text extraction for PDF and TXT
        if (doc.type === 'application/pdf') {
            const data = await pdf(dataBuffer);
            extractedText = data.text;
        } else if (doc.type === 'text/plain') {
            extractedText = dataBuffer.toString();
        }

        let chunkCount = 0;
        if (extractedText) {
            // 1. Chunk text
            const chunks = chunkText(extractedText);
            chunkCount = chunks.length;

            // 2. Clear old embeddings if any (re-processing)
            await Embedding.deleteMany({ documentId: doc._id });

            // 3. Generate and save embeddings for each chunk
            const embeddingIds: any[] = [];
            for (const chunk of chunks) {
                const vector = await generateEmbedding(chunk);
                const emb = await Embedding.create({
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
                await extractCalendarEvents(extractedText);
            }
        }

        doc.status = 'Indexed';
        await doc.save();
        return chunkCount;
    } catch (error) {
        console.error(`Error processing document ${docId}:`, error);
        await Document.findByIdAndUpdate(docId, {
            status: 'Error',
            errorMessage: (error as Error).message || 'Unknown error occurred'
        });
        return 0;
    }
};
