import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  const conn = await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
};
