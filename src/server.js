import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandlerMiddlewares } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { requestIdMiddleware } from './middlewares/request-id-middleware.js';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();

export const setupServer = () => {
  const app = express();

  app.use(cors(), pino(), cookieParser(), requestIdMiddleware);
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandlerMiddlewares);

  const PORT = Number(getEnvVar('PORT', '3000'));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
