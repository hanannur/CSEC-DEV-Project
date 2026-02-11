import { Request, Response } from 'express';
import Document from '../models/Document';
import fs from 'fs';
import pdf from 'pdf-parse';

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

        // Start background processing (OCR/Vectorization)
        processDocument(document._id.toString());

        res.status(201).json(document);
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
const processDocument = async (docId: string) => {
    try {
        const doc = await Document.findById(docId);
        if (!doc) return;

        const dataBuffer = fs.readFileSync(doc.path);

        // Basic text extraction for PDF
        if (doc.type === 'application/pdf') {
            const data = await pdf(dataBuffer);
            console.log(`Extracted text from ${doc.name}: ${data.text.substring(0, 100)}...`);
            // TODO: Chunking and Embedding with Gemini
        }

        doc.status = 'Indexed';
        await doc.save();
    } catch (error) {
        console.error(`Error processing document ${docId}:`, error);
        await Document.findByIdAndUpdate(docId, { status: 'Error' });
    }
};
