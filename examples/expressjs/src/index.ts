import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestLoggingMiddleware, errorLoggingMiddleware } from './middleware';
import userRoutes from './routes/users';
import databaseRoutes from './routes/database';
import { requestLogger } from './loggers';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(requestLoggingMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/database', databaseRoutes);

// Demo endpoint to test logging
app.get('/api/demo', async (req, res) => {
  const correlationId = req.headers['x-correlation-id'] as string;
  
  // Test different log levels
  await requestLogger.debug('Debug message for demo', {
    method: 'GET',
    path: '/api/demo',
    correlationId,
    statusCode: 200
  });
  
  await requestLogger.info('Info message for demo', {
    method: 'GET',
    path: '/api/demo',
    correlationId,
    statusCode: 200
  });
  
  await requestLogger.warn('Warning message for demo', {
    method: 'GET',
    path: '/api/demo',
    correlationId,
    statusCode: 200
  });
  
  // Test console methods
  requestLogger.table('Demo Data', [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
    { id: 3, name: 'Item 3', value: 300 }
  ]);
  
  requestLogger.group('Demo Operations');
  requestLogger.time('Demo Timer');
  
  setTimeout(() => {
    requestLogger.timeEnd('Demo Timer');
    requestLogger.groupEnd();
  }, 1000);
  
  res.json({
    success: true,
    message: 'Demo completed - check console for logging examples',
    correlationId,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorLoggingMiddleware);

// 404 handler
app.use('*', (req, res) => {
  const correlationId = req.headers['x-correlation-id'] as string;
  
  requestLogger.warn('Route not found', {
    method: req.method,
    path: req.path,
    correlationId,
    statusCode: 404
  });
  
  res.status(404).json({
    success: false,
    error: 'Route not found',
    correlationId
  });
});

// Start server
app.listen(PORT, () => {
  requestLogger.info('Express server started', {
    method: 'SERVER',
    path: 'startup',
    correlationId: 'server-start',
    statusCode: 200
  });
  
  console.log(`🚀 Express server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Demo endpoint: http://localhost:${PORT}/api/demo`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`🗄️  Database API: http://localhost:${PORT}/api/database`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  requestLogger.info('SIGTERM received, shutting down gracefully', {
    method: 'SERVER',
    path: 'shutdown',
    correlationId: 'server-shutdown',
    statusCode: 200
  });
  
  await requestLogger.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  requestLogger.info('SIGINT received, shutting down gracefully', {
    method: 'SERVER',
    path: 'shutdown',
    correlationId: 'server-shutdown',
    statusCode: 200
  });
  
  await requestLogger.shutdown();
  process.exit(0);
});
