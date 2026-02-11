import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';

// Announcement Model
export interface IAnnouncement extends MongooseDocument {
    title: string;
    date: string;
    category: 'Academics' | 'Research' | 'Events' | 'Social' | 'Emergency';
    content: string;
}

const AnnouncementSchema: Schema = new Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    category: {
        type: String,
        enum: ['Academics', 'Research', 'Events', 'Social', 'Emergency'],
        default: 'Academics'
    },
    content: { type: String, required: true }
}, { timestamps: true });

export const Announcement = mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

// Schedule Model
export interface ISchedule extends MongooseDocument {
    userId: mongoose.Types.ObjectId;
    title: string;
    time: string;
    location: string;
    color: string;
}

const ScheduleSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    color: { type: String, default: 'bg-teal-500' }
}, { timestamps: true });

export const Schedule = mongoose.model<ISchedule>('Schedule', ScheduleSchema);
