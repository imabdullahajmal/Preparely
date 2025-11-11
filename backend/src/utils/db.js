import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function connectDB(uri){
  const mongoUri = uri || process.env.MONGODB_URI;
  if(!mongoUri) throw new Error('MONGODB_URI not provided (set MONGODB_URI in .env)');
  await mongoose.connect(mongoUri, {
    // mongoose 7 has sane defaults
  });
  console.log('Connected to MongoDB');
}
