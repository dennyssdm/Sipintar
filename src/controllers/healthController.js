import { testConnection } from '../config/db.js';
import { sendSuccess, sendError } from '../utils/responseFormatter.js';

/**
 * Health check endpoint controller
 * GET /api/v1/health
 */
export async function getHealthStatus(req, res, next) {
  try {
    const dbStatus = await testConnection();

    if (!dbStatus.ok) {
      return sendError(
        res,
        'DATABASE_CONNECTION_ERROR',
        'Layanan API aktif namun koneksi database gagal',
        [dbStatus.message],
        503
      );
    }

    const healthData = {
      status: 'healthy',
      database: 'connected',
      databaseName: dbStatus.database,
      dbTimestamp: dbStatus.timestamp,
      serverTimestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development'
    };

    return sendSuccess(
      res,
      'SIPINTAR API service is healthy and connected to MySQL',
      healthData,
      null,
      200
    );
  } catch (error) {
    next(error);
  }
}

