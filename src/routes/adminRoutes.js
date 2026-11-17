import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/rbac.js';
import { uploadSingleFile } from '../middleware/upload.js';

const router = express.Router();

// All admin routes require authenticated user
router.use(authenticateToken);

// 1. Resource Management
router.post(
  '/resources',
  authorizeRoles('admin', 'pengelola', 'gadik'),
  uploadSingleFile,
  adminController.createResource
);

router.put(
  '/resources/:id',
  authorizeRoles('admin', 'pengelola', 'gadik'),
  uploadSingleFile,
  adminController.updateResource
);

router.patch(
  '/resources/:id/archive',
  authorizeRoles('admin', 'verifikator'),
  adminController.archiveResource
);

router.patch(
  '/resources/:id/status',
  authorizeRoles('admin', 'verifikator'),
  adminController.updateResourceStatus
);

router.delete(
  '/resources/:id',
  authorizeRoles('admin'),
  adminController.deleteResource
);

// 1.1 Book Management (CMS Perpustakaan / E-Library)
router.post(
  '/books',
  authorizeRoles('admin', 'pengelola'),
  uploadSingleFile,
  adminController.createBook
);

router.put(
  '/books/:id',
  authorizeRoles('admin', 'pengelola'),
  uploadSingleFile,
  adminController.updateBook
);

router.delete(
  '/books/:id',
  authorizeRoles('admin', 'pengelola'),
  adminController.deleteBook
);

// 2. Verification Module (Bag Jarlat & Pokja)
router.get(
  '/verification/queue',
  authorizeRoles('admin', 'verifikator'),
  adminController.getVerificationQueue
);

router.post(
  '/verification/:id/review',
  authorizeRoles('admin', 'verifikator'),
  adminController.reviewResource
);

// 3. User & Role Management
router.get(
  '/users',
  authorizeRoles('admin'),
  adminController.listUsers
);

router.post(
  '/users',
  authorizeRoles('admin'),
  adminController.createUser
);

router.patch(
  '/users/:id/role',
  authorizeRoles('admin'),
  adminController.updateUserRole
);

router.patch(
  '/users/:id/status',
  authorizeRoles('admin'),
  adminController.updateUserStatus
);

// 4. Monitoring Dashboard & Audit Logs
router.get(
  '/monitoring/stats',
  authorizeRoles('admin', 'pimpinan'),
  adminController.getMonitoringStats
);

router.get(
  '/monitoring/logs',
  authorizeRoles('admin', 'pimpinan'),
  adminController.getAuditLogs
);

export default router;

