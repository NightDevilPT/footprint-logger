import { LoggerBuilder, LogLevel } from 'unilogger';

// Define custom context types for Express.js
interface RequestContext {
  method: string;
  path: string;
  userId?: string;
  correlationId: string;
  userAgent?: string;
  ip?: string;
  statusCode?: number;
  duration?: number;
}

interface UserActionContext {
  userId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'view';
  timestamp: Date;
  metadata?: {
    ip?: string;
    userAgent?: string;
    sessionId?: string;
    [key: string]: any; // Allow additional properties
  };
}

interface DatabaseContext {
  operation: 'query' | 'insert' | 'update' | 'delete';
  table: string;
  duration: number;
  recordCount?: number;
  error?: string;
}

// Create typed loggers for different contexts
const requestLogger = new LoggerBuilder<RequestContext>()
  .setAppName('express-api')
  .useFormat('styled')
  .enableColors(true)
  .setColorConfig({
    info: { color: 'green', bold: true },
    warn: { color: 'yellow', bold: true },
    error: { color: 'red', bold: true },
    debug: { color: 'blue' },
    timestamp: { color: 'gray', bold: false }
  })
  .enableChangeTracking(true)
  .setBufferSize(100)
  .setFlushInterval(2000)
  .build();

const userLogger = new LoggerBuilder<UserActionContext>()
  .setAppName('user-service')
  .useFormat('styled')
  .enableColors(true)
  .setColorConfig({
    info: { color: 'cyan', bold: true },
    warn: { color: 'orange', bold: true },
    error: { color: 'red', bold: true, underline: true },
    fatal: { color: 'red', bgColor: 'white', bold: true }
  })
  .build();

const dbLogger = new LoggerBuilder<DatabaseContext>()
  .setAppName('database')
  .useFormat('json')
  .enableColors(false)
  .build();

export { requestLogger, userLogger, dbLogger };
export type { RequestContext, UserActionContext, DatabaseContext };
