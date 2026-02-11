import mongoose from 'mongoose';
import User from './src/models/User';
import dotenv from 'dotenv';
dotenv.config();

const checkUsers = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jemari-ai');
    const users = await User.find({}, 'name email role');
    console.log('Registered Users:');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
};

checkUsers();
