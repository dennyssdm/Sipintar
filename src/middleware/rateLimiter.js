import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/responseFormatter.js';

/**
 * Global rate limiter for all general API endpoints
 * 500 requests per 15-minute window per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'TOO_MANY_REQUESTS',
      'Terlalu banyak permintaan ke server SIPINTAR. Silakan tunggu beberapa saat sebelum mencoba kembali.',
      ['Batas limit: 500 permintaan per 15 menit per alamat IP'],
      429
    );
  }
});

/**
 * Strict rate limiter for authentication routes to prevent brute force
 * 30 attempts per 15-minute window per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'TOO_MANY_REQUESTS',
      'Terlalu banyak percobaan autentikasi dari alamat IP ini. Akun dilindungi demi keamanan.',
      ['Batas limit login/register: 30 percobaan per 15 menit'],
      429
    );
  }
});

export default {
  apiLimiter,
  authLimiter
};

