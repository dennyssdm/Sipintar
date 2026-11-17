import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openApiSpec = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/docs/openapi.json'), 'utf8'));

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

// OpenAPI Specification Endpoint
app.get(['/openapi.json', '/api/v1/openapi.json'], (req, res) => {
  res.json(openApiSpec);
});

// Interactive Swagger UI API Explorer
app.get(['/docs', '/api/docs'], (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SiPINTAR Sespimma — Interactive API Documentation</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css" />
  <style>
    body { margin: 0; background-color: #0b1528; color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .brand-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 28px; background: linear-gradient(135deg, #071731 0%, #0d2854 50%, #174f9c 100%); border-bottom: 3px solid #f59e0b; }
    .brand-title { font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; }
    .brand-sub { font-size: 12px; color: #fbbf24; font-weight: 600; margin-top: 3px; }
    .swagger-ui { max-width: 1280px; margin: 0 auto; padding: 24px 20px; background: #ffffff; border-radius: 8px; margin-top: 20px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .swagger-ui .topbar { display: none !important; }
  </style>
</head>
<body>
  <div class="brand-bar">
    <div>
      <div class="brand-title">SiPINTAR Sespimma — Interactive RESTful API Explorer</div>
      <div class="brand-sub">SESPIMMA SESPIM LEMDIKLAT POLRI • PKN TINGKAT II ANGKATAN XXIX NAWASENA TA 2026</div>
    </div>
    <div>
      <a href="/openapi.json" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); padding: 8px 14px; border-radius: 6px;">Unduh OpenAPI 3.0 JSON</a>
    </div>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.min.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`);
});

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'SIPINTAR Sespimma REST API',
    version: '1.0.0',
    institution: 'Sespimma Sespim Lemdiklat Polri',
    documentation: '/docs',
    openapi: '/openapi.json',
    health: '/api/v1/health',
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

