import mongoose from 'mongoose';

/**
 * Health Check Service
 * Encapsulates backend state check business logic.
 */
export class HealthService {
  /**
   * Retrieves systemic health status, database connection state, uptime, and system metadata.
   */
  static getHealthStatus() {
    const dbStateMap = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting',
    };

    const mongoState = mongoose.connection.readyState;
    const isDbConnected = mongoState === 1;

    return {
      status: isDbConnected ? 'healthy' : 'degraded',
      appName: 'FinTrack 360 API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStateMap[mongoState] || 'Unknown',
        connected: isDbConnected,
      },
      environment: process.env.NODE_ENV || 'development',
    };
  }
}

export default HealthService;
