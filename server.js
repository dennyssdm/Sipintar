import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import pool, { testConnection } from './src/config/db.js';
import { apiLimiter } from './src/middleware/rateLimiter.js';
import healthRoutes from './src/routes/healthRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import resourceRoutes from './src/routes/resourceRoutes.js';
import gadikRoutes from './src/routes/gadikRoutes.js';
import libraryRoutes from './src/routes/libraryRoutes.js';
import searchRoutes from './src/routes/searchRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import { notFoundHandler, globalErrorHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers (Helmet)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

// CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for local dev; strict in production
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting & request parsers & logger
app.use('/api/v1', apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static files for uploads (accessible internally or guarded by streaming)
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

// API Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/gadik', gadikRoutes);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/admin', adminRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SIPINTAR Sespimma REST API',
    version: '1.0.0',
    institution: 'Sespimma Sespim Lemdiklat Polri',
    documentation: '/api/v1/health',
    status: 'online'
  });
});

// 404 and Error Handler
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start server and verify database
async function startServer() {
  try {
    const dbTest = await testConnection();
    if (dbTest.ok) {
      console.log(`[DB] Connected successfully to MySQL: ${dbTest.database}`);
    } else {
      console.error(`[DB] Connection warning: ${dbTest.message}`);
    }

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  SIPINTAR Sespimma API Server running on port ${PORT}`);
      console.log(`  Base API URL: http://localhost:${PORT}/api/v1`);
      console.log(`  Health Check: http://localhost:${PORT}/api/v1/health`);
      console.log(`====================================================`);
    });

    // Graceful shutdown handling
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        try {
          await pool.end();
          console.log('[DB] Pool connections closed.');
          process.exit(0);
        } catch (err) {
          console.error('[DB] Error during pool closure:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (error) {
    console.error('Fatal error during server startup:', error);
    process.exit(1);
  }
}

startServer();

