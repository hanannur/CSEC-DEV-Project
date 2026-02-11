import mongoose, { Schema, Document } from 'mongoose';

export interface ICalendarEvent extends Document {
    title: string;
    date: Date;
    description: string;
    isToday: boolean;
    createdAt: Date;
}

const CalendarEventSchema: Schema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    isToday: { type: Boolean, default: false }
}, { timestamps: true });

// Index for date-based retrieval
CalendarEventSchema.index({ date: 1 });

export default mongoose.model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
