import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

export interface IChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface IChatHistory extends MongooseDocument {
    userId: mongoose.Types.ObjectId;
     title: string;
    messages: IChatMessage[];
    lastInteraction: Date;
    
}

const ChatHistorySchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    messages: [{
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    lastInteraction: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
