import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import path from 'path';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('MongoDB connected');
    app.listen(env.port, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
