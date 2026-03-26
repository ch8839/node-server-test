import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import type { ApiResponse } from '../types';
import { config } from '../config';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      code: err.statusCode,
      data: null,
      message: err.message,
    });
    return;
  }

  console.error('[UnhandledError]', err);

  res.status(500).json({
    code: 500,
    data: null,
    message: config.isDev ? err.message : 'Internal Server Error',
  });
}
