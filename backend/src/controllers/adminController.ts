import { Request, Response } from 'express';
import Document from '../models/Document';
import fs from 'fs';
import pdf from 'pdf-parse';
import { chunkText, generateEmbedding } from '../services/ragService';
import Embedding from '../models/Embedding';

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
            for (const chunk of chunks) {
                const vector = await generateEmbedding(chunk);
                await Embedding.create({
                    documentId: doc._id,
                    text: chunk,
                    embedding: vector
                });
            }

            console.log(`Indexed ${chunks.length} chunks for ${doc.name}`);
        }

        doc.status = 'Indexed';
        await doc.save();
        return chunkCount;
    } catch (error) {
        console.error(`Error processing document ${docId}:`, error);
        await Document.findByIdAndUpdate(docId, { status: 'Error' });
        return 0;
    }
};
