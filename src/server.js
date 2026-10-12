import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import contactsRouter from './routers/contacts.routes.js';
import { getEnvVar } from './utils/getEnvVar.js';

dotenv.config();
const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: { target: 'pino-pretty' },
    }),
  );
  app.use((req, res, next) => {
    req.id = randomUUID();
    next();
  });
  app.use('/contacts', contactsRouter);

  app.get('/', (req, res) => {
    res.send('The API works! Use /contacts');
  });

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found contact',
      status: 404,
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
