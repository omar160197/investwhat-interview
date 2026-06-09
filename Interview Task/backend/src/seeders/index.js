import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { seed as seedTopics } from '../modules/topics/topics.service.js';
import { seedUsers } from './users.seeder.js';

const run = async () => {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');

  await seedTopics();
  await seedUsers();

  await mongoose.disconnect();
  console.log('\nSeeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
