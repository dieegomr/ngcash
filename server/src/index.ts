import 'express-async-errors';
import express from 'express';
import { AppDataSource } from './data-source';
import { globalErrorHandler } from './middlewares/error';
import userRoutes from './routes/userRoutes';
import { AppError } from './utils/appError';
import cors from 'cors';

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());

  app.use(cors());
  app.use('/api/v1/user', userRoutes);

  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  });

  app.use(new globalErrorHandler().errorMiddleware);

  return app.listen(process.env.PORT, () => {
    console.log(`Serve is runnig. Port: ${process.env.PORT}`);
  });
});
