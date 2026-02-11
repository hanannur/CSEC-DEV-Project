import mongoose, { Schema, Document } from 'mongoose';

export interface IEmbedding extends Document {
    documentId: mongoose.Types.ObjectId;
    text: string;
    embedding: number[];
    metadata?: any;
    createdAt: Date;
}

const EmbeddingSchema: Schema = new Schema({
    documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

// Index for faster lookups by document
EmbeddingSchema.index({ documentId: 1 });

export default mongoose.model<IEmbedding>('Embedding', EmbeddingSchema);
