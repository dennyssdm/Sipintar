import * as adminService from '../services/adminService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

function getRequestMeta(req) {
  return {
    ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    userAgent: req.headers['user-agent']
  };
}

/**
 * POST /api/v1/admin/resources
 * Create new draft resource (supports Multer file upload)
 */
export async function createResource(req, res, next) {
  try {
    const meta = getRequestMeta(req);
    const result = await adminService.createResource(req.body, req.file, req.user, meta);
    return sendSuccess(res, 'Sumber belajar berhasil dibuat sebagai draf', result, null, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/resources/:id
 * Update resource metadata & optional replacement file
 */
export async function updateResource(req, res, next) {
  try {
    const { id } = req.params;
    const meta = getRequestMeta(req);
    const result = await adminService.updateResource(id, req.body, req.file, req.user, meta);
    return sendSuccess(res, 'Data sumber belajar berhasil diperbarui', result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/resources/:id/archive
 * Transition resource lifecycle to 'Arsip'
 */
export async function archiveResource(req, res, next) {
  try {
    const { id } = req.params;
    const meta = getRequestMeta(req);
    const result = await adminService.archiveResource(id, req.user, meta);
    return sendSuccess(res, 'Sumber belajar berhasil diarsipkan', result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/verification/queue
 * List items awaiting review by Bag Jarlat
 */
export async function getVerificationQueue(req, res, next) {
  try {
    const { items, pagination } = await adminService.getVerificationQueue(req.query);
    return sendSuccess(res, 'Antrean verifikasi naskah ajar berhasil diambil', items, pagination, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/verification/:id/review
 * Approve, request revision, or reject resource
 */
export async function reviewResource(req, res, next) {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body;
    const meta = getRequestMeta(req);
    const result = await adminService.reviewResource(id, decision, notes, req.user, meta);
    return sendSuccess(res, `Verifikasi naskah berhasil diproses: ${result.action_result}`, result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/users
 * List users with filtering
 */
export async function listUsers(req, res, next) {
  try {
    const { items, pagination } = await adminService.getUsers(req.query);
    return sendSuccess(res, 'Daftar pengguna berhasil diambil', items, pagination, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/users/:id/role
 * Update role of a user
 */
export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params;
    const roleIdentifier = req.body.role_id || req.body.role_code || req.body.role;
    const meta = getRequestMeta(req);
    const result = await adminService.updateUserRole(id, roleIdentifier, req.user, meta);
    return sendSuccess(res, 'Peran pengguna berhasil diperbarui', result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/users/:id/status
 * Activate or deactivate user account
 */
export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const meta = getRequestMeta(req);
    const result = await adminService.updateUserStatus(id, is_active, req.user, meta);
    return sendSuccess(res, `Status akun pengguna berhasil ${result.is_active ? 'diaktifkan' : 'dinonaktifkan'}`, result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/monitoring/stats
 * Get comprehensive monitoring statistics
 */
export async function getMonitoringStats(req, res, next) {
  try {
    const stats = await adminService.getMonitoringStats();
    return sendSuccess(res, 'Statistik monitoring sistem berhasil diambil', stats, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/monitoring/logs
 * Query activity logs, search logs, and verification logs
 */
export async function getAuditLogs(req, res, next) {
  try {
    const { items, pagination } = await adminService.getAuditLogs(req.query);
    return sendSuccess(res, 'Log audit sistem berhasil diambil', items, pagination, 200);
  } catch (error) {
    next(error);
  }
}

