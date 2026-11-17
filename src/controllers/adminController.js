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

/**
 * DELETE /api/v1/admin/resources/:id
 */
export async function deleteResource(req, res, next) {
  try {
    const { id } = req.params;
    const { hard } = req.query;
    const meta = getRequestMeta(req);
    const result = await adminService.deleteResource(id, req.user, hard === 'true', meta);
    return sendSuccess(res, 'Sumber belajar berhasil dihapus', result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/admin/resources/:id/status
 */
export async function updateResourceStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, lifecycle_status } = req.body;
    const newStatus = status || lifecycle_status;
    const meta = getRequestMeta(req);
    const result = await adminService.updateResourceStatus(id, newStatus, req.user, meta);
    return sendSuccess(res, `Status naskah berhasil diubah menjadi ${newStatus}`, result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/books
 */
export async function createBook(req, res, next) {
  try {
    const meta = getRequestMeta(req);
    const result = await adminService.createBook(req.body, req.file, req.user, meta);
    return sendSuccess(res, 'Buku perpustakaan berhasil ditambahkan', result, null, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/v1/admin/books/:id
 */
export async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const meta = getRequestMeta(req);
    const result = await adminService.updateBook(id, req.body, req.file, req.user, meta);
    return sendSuccess(res, 'Buku perpustakaan berhasil diperbarui', result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/admin/books/:id
 */
export async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;
    const meta = getRequestMeta(req);
    const result = await adminService.deleteBook(id, req.user, meta);
    return sendSuccess(res, 'Buku perpustakaan berhasil dihapus', result, null, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/users
 */
export async function createUser(req, res, next) {
  try {
    const meta = getRequestMeta(req);
    const result = await adminService.createUser(req.body, req.user, meta);
    return sendSuccess(res, 'Pengguna baru berhasil didaftarkan', result, null, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/admin/export/:entity
 */
export async function exportData(req, res, next) {
  try {
    const { entity } = req.params;
    const result = await adminService.exportData(entity, req.user);
    return sendSuccess(res, `Data ${entity} berhasil diekspor`, result.data, { total: result.count }, 200);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/admin/import/:entity
 */
export async function importData(req, res, next) {
  try {
    const { entity } = req.params;
    const meta = getRequestMeta(req);
    const items = req.body.items || req.body;
    
    let result;
    if (entity === 'resources') {
      result = await adminService.importResources(items, req.user, meta);
    } else if (entity === 'books') {
      result = await adminService.importBooks(items, req.user, meta);
    } else if (entity === 'users') {
      result = await adminService.importUsers(items, req.user, meta);
    } else {
      const error = new Error(`Entity '${entity}' tidak valid untuk import`);
      error.statusCode = 400;
      throw error;
    }

    return sendSuccess(res, `Import data ${entity} selesai diproses`, result, null, 200);
  } catch (error) {
    next(error);
  }
}

