import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import { seed } from './src/modules/topics/topics.service.js';
import app from './src/app.js';

const start = async () => {
  await connectDB();
  await seed();
  app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
};

start();
