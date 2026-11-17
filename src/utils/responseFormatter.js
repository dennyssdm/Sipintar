/**
 * Standardized success response helper
 * @param {import('express').Response} res
 * @param {string} message
 * @param {any} data
 * @param {object|null} meta
 * @param {number} statusCode
 */
export function sendSuccess(res, message, data = null, meta = null, statusCode = 200) {
  const payload = {
    success: true,
    message
  };

  if (data !== null) {
    payload.data = data;
  }

  if (meta !== null) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
}

/**
 * Standardized error response helper
 * @param {import('express').Response} res
 * @param {string} code - e.g. UNAUTHORIZED, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR, INTERNAL_SERVER_ERROR
 * @param {string} message
 * @param {Array<any>} details
 * @param {number} statusCode
 */
export function sendError(res, code, message, details = [], statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details
    }
  });
}

