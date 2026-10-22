import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import contactsRouter from './routers/contacts.routes.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandlerMiddlewares } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

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
  app.use(errorHandlerMiddlewares);
  app.use(notFoundHandler);

  app.get('/', (req, res) => {
    res.send('The API works! Use /contacts');
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
