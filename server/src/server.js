import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[CRITICAL] Uncaught Exception:', error.message);
  console.error(error.stack);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB database then start HTTP server
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 FinTrack 360 API Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`❤️  Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`=================================================`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, _promise) => {
      console.error('[CRITICAL] Unhandled Rejection:', reason);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful Shutdown
    const gracefulShutdown = (signal) => {
      console.log(`\n[SYSTEM] Received ${signal}. Shutting down HTTP server gracefully...`);
      server.close(() => {
        console.log('[SYSTEM] HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (err) {
    console.error('[CRITICAL] Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
