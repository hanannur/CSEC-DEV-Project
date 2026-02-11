import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';
dotenv.config();

const promoteUser = async (email: string) => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jemari-ai');
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (user) {
        console.log(`User ${email} promoted to ADMIN successfully.`);
    } else {
        console.log(`User ${email} not found.`);
    }
    process.exit(0);
};

promoteUser('abaya@seller.com');
