import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends MongooseDocument {
    name: string;
    email: string;
    password?: string;
    role: 'student' | 'admin';
    avatar: string;
    provider: 'google' | 'github' | 'email';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop' },
    provider: { type: String, enum: ['google', 'github', 'email'], default: 'email' }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password!, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
