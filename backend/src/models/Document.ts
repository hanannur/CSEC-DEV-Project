import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IDocument extends MongooseDocument {
    name: string;
    filename: string;
    path: string;
    size: number;
    type: string;
    status: 'Processing' | 'Indexed' | 'Error';
    metadata: {
        category: string;
        uploadedBy: mongoose.Types.ObjectId;
    };
    chunks: string[]; // Store IDs or references to vector store items
    createdAt: Date;
}

const DocumentSchema: Schema = new Schema({
    name: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['Processing', 'Indexed', 'Error'], default: 'Processing' },
    errorMessage: { type: String },
    metadata: {
        category: { type: String, default: 'General' },
        uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    chunks: [{ type: String }]
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema);
