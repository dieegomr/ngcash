import { NextFunction, Request, Response } from 'express';
import { AppError, UnauthorizedError } from '../utils/appError';

export class globalErrorHandler {
  errorMiddleware = (
    err: Error & Partial<AppError>,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const statusCode = err.statusCode ?? 500;
    const message = err.statusCode ? err.message : 'Internal Server Error';

    const handleJWTError = () =>
      new UnauthorizedError('Invalid token. Please log in again');

    const handleJWTExpired = () =>
      new UnauthorizedError('Your token has expired. Please log in again');

    const sendErrorDev = (err: Error & Partial<AppError>, res: Response) => {
      res.status(statusCode).json({
        errorObj: err,
        error: { status: err.status, message: err.message, stack: err.stack },
      });
    };

    const sendErrorProd = (err: Error & Partial<AppError>, res: Response) => {
      if (err.isOperational) {
        res.status(statusCode).json({
          error: { status: err.status, message: message },
        });
      } else {
        console.error('ERROR', err);
        res.status(500).json({
          status: 'error',
          message: 'Something went very wrong',
        });
      }
    };

    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.name = err.name;
      if (error.name === 'JsonWebTokenError') error = handleJWTError();
      if (error.name === 'TokenExpiredError') error = handleJWTExpired();
      sendErrorProd(error, res);
    }
  };
}
