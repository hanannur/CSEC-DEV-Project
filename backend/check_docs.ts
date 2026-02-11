import mongoose from 'mongoose';
import Document from './src/models/Document';
import dotenv from 'dotenv';
dotenv.config();

const checkDocs = async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jemari-ai');
    const docs = await Document.find({}, 'name status path');
    console.log('Indexed Documents:');
    console.log(JSON.stringify(docs, null, 2));
    process.exit(0);
};

checkDocs();
