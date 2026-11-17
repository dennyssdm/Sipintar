import { verifyToken } from '../config/jwt.js';
import { sendError } from '../utils/responseFormatter.js';
import pool from '../config/db.js';

/**
 * Authentication middleware to verify JWT in Authorization header
 */
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(
      res,
      'UNAUTHORIZED',
      'Akses ditolak: Token autentikasi tidak ditemukan atau format tidak sesuai (gunakan: Bearer <token>)',
      [],
      401
    );
  }

  const token = authHeader.split(' ')[1];

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
 * Populates req.user if a valid Bearer token is provided, otherwise leaves req.user = null without throwing error.
 */
export async function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

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

