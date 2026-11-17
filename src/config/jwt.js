import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'sipintar_sespimma_secret_jwt_key_2026_super_secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate a JWT token for an authenticated user
 * @param {object} payload - User identification and role data
 * @param {string} [expiresIn] - Token expiration duration (default: 24h)
 * @returns {string} Signed JWT token
 */
export function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT string
 * @returns {object} Decoded payload
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export default {
  generateToken,
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRES_IN
};

