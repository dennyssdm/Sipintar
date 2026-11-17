import { sendError } from '../utils/responseFormatter.js';

/**
 * Role-Based Access Control (RBAC) middleware
 * Enforces allowed roles based on user's role_code in database
 * @param  {...string|string[]} roles - Allowed role codes, e.g. 'admin', 'verifikator', 'gadik', 'serdik', 'pengelola', 'pimpinan'
 */
export function authorizeRoles(...roles) {
  // Flatten array arguments in case an array was passed
  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user) {
      return sendError(
        res,
        'UNAUTHORIZED',
        'Autentikasi diperlukan sebelum otorisasi peran.',
        [],
        401
      );
    }

    if (!allowedRoles.includes(req.user.role_code)) {
      return sendError(
        res,
        'FORBIDDEN',
        `Akses ditolak: Peran pengguna (${req.user.role_name || req.user.role_code}) tidak memiliki wewenang untuk tindakan ini.`,
        [`Peran yang diizinkan: ${allowedRoles.join(', ')}`],
        403
      );
    }

    next();
  };
}

export default authorizeRoles;

