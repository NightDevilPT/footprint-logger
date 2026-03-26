import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requestLogger, RequestContext } from './loggers';

// Request logging middleware with typed context
export function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const correlationId = uuidv4();
  
  // Add correlation ID to request headers for downstream services
  req.headers['x-correlation-id'] = correlationId;
  
  // Log incoming request
  const requestContext: RequestContext = {
    method: req.method,
    path: req.path,
    correlationId,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress
  };
  
  requestLogger.info('Incoming request', requestContext);
  
  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  (res as any).end = function(chunk?: any, encoding?: any, cb?: any) {
    const duration = Date.now() - startTime;
    
    const responseContext: RequestContext = {
      method: req.method,
      path: req.path,
      correlationId,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };
    
    if (res.statusCode >= 400) {
      requestLogger.error('Request completed with error', new Error(`HTTP ${res.statusCode}`), responseContext);
    } else {
      requestLogger.info('Request completed successfully', responseContext);
    }
    
    originalEnd(chunk, encoding, cb);
  };
  
  next();
}

// Error logging middleware
export function errorLoggingMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers['x-correlation-id'] as string;
  
  const errorContext: RequestContext = {
    method: req.method,
    path: req.path,
    correlationId,
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    statusCode: 500
  };
  
  requestLogger.fatal('Unhandled error in request', error, errorContext);
  
  res.status(500).json({
    error: 'Internal Server Error',
    correlationId,
    timestamp: new Date().toISOString()
  });
}
