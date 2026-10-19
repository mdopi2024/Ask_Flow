import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`) as AppError;
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  if (env.isDev()) {
    console.error("❌ Error:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isDev() && { stack: err.stack }),
  });
}
