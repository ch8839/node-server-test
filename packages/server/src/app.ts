import express from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import type { ApiResponse } from './types';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

app.use((_req, res) => {
  const body: ApiResponse<null> = { code: 404, data: null, message: 'Not Found' };
  res.status(404).json(body);
});

app.use(errorHandler);

export default app;
