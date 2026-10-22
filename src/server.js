import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';

import contactsRouter from './routers/contacts.routes.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandlerMiddlewares } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { requestIdMiddleware } from './middlewares/request-id-middleware.js';

dotenv.config();

export const setupServer = () => {
  const app = express();

  app.use(cors(), pino(), requestIdMiddleware);
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use('/contacts', contactsRouter);
  app.use(notFoundHandler);
  app.use(errorHandlerMiddlewares);

  const PORT = Number(getEnvVar('PORT', '3000'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
