import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes (with brute force protection)
router.post('/login', authLimiter, authController.login);
router.post('/register', authLimiter, authController.register);

// Protected routes
router.get('/me', authenticateToken, authController.getMe);

// Verification route for RBAC testing
router.get('/admin-check', authenticateToken, authorizeRoles('admin'), (req, res) => {
  return sendSuccess(res, 'Otorisasi peran Admin berhasil divalidasi', {
    authorizedUser: req.user
  });
});

export default router;
