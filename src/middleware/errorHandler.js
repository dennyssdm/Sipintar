import { sendError } from '../utils/responseFormatter.js';

/**
 * Handle 404 for undefined routes
 */
export function notFoundHandler(req, res, next) {
  return sendError(
    res,
    'NOT_FOUND',
    `Rute ${req.method} ${req.originalUrl} tidak ditemukan`,
    [],
    404
  );
}

/**
 * Global application error handler
 */
export function globalErrorHandler(err, req, res, next) {
  console.error('Unhandled Application Error:', err);

  // Check for Bad JSON body parse error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(
      res,
      'VALIDATION_ERROR',
      'Format JSON pada body request tidak valid',
      [err.message],
      400
    );
  }

  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 400 ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR');
  const message = err.message || 'Terjadi kesalahan internal pada server';
  const details = err.details || [];

  return sendError(res, errorCode, message, details, statusCode);
}

