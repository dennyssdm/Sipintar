import { verifyToken } from '../config/jwt.js';
import { sendError } from '../utils/responseFormatter.js';
import pool from '../config/db.js';

/**
 * Helper to extract JWT token from Authorization header or URL query parameter (for direct file streams/iframes)
 */
export function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.query && req.query.token) {
    return req.query.token;
  }
  if (req.query && req.query.auth_token) {
    return req.query.auth_token;
  }
  return null;
}

/**
 * Authentication middleware to verify JWT in Authorization header or query parameter
 */
export async function authenticateToken(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return sendError(
      res,
      'UNAUTHORIZED',
      'Akses ditolak: Token autentikasi tidak ditemukan atau format tidak sesuai (gunakan: Bearer <token> atau ?token=<token>)',
      [],
      401
    );
  }

  try {
    const decoded = verifyToken(token);

    // Verify user existence and active status in database
    const [rows] = await pool.query(
      `SELECT u.id, u.uuid, u.nrp_nip, u.nama_lengkap, u.email, u.role_id, u.is_active, 
              r.role_code, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return sendError(res, 'UNAUTHORIZED', 'Pengguna tidak ditemukan dalam sistem', [], 401);
    }

    const user = rows[0];

    if (!user.is_active) {
      return sendError(
        res,
        'FORBIDDEN',
        'Akun Anda telah dinonaktifkan. Silakan hubungi Administrator Sistem.',
        [],
        403
      );
    }

    req.user = {
      id: user.id,
      uuid: user.uuid,
      nrp_nip: user.nrp_nip,
      nama_lengkap: user.nama_lengkap,
      email: user.email,
      role_id: user.role_id,
      role_code: user.role_code,
      role_name: user.role_name
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(
        res,
        'UNAUTHORIZED',
        'Sesi Anda telah berakhir. Silakan login kembali.',
        [],
        401
      );
    }

    return sendError(
      res,
      'UNAUTHORIZED',
      'Token autentikasi tidak valid atau telah dimodifikasi.',
      [error.message],
      401
    );
  }
}

/**
 * Optional authentication middleware:
 * Populates req.user if a valid token is provided in header or query, otherwise leaves req.user = null without throwing error.
 */
export async function optionalAuthenticateToken(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const [rows] = await pool.query(
      `SELECT u.id, u.uuid, u.nrp_nip, u.nama_lengkap, u.email, u.role_id, u.is_active, 
              r.role_code, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [decoded.id]
    );

    if (rows.length > 0 && rows[0].is_active) {
      const user = rows[0];
      req.user = {
        id: user.id,
        uuid: user.uuid,
        nrp_nip: user.nrp_nip,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role_id: user.role_id,
        role_code: user.role_code,
        role_name: user.role_name
      };
    } else {
      req.user = null;
    }
  } catch (err) {
    req.user = null;
  }

  next();
}

export default authenticateToken;

