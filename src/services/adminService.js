import crypto from 'crypto';
import path from 'path';
import pool from '../config/db.js';
import { logActivity } from '../utils/logger.js';

/**
 * Format bytes to readable string (e.g. 2.4 MB)
 */
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Helper to ensure tags exist and return their IDs
 * @param {string[]|string} tagsInput
 */
async function syncTags(tagsInput, connection) {
  if (!tagsInput) return [];
  const tagNames = (Array.isArray(tagsInput) ? tagsInput : tagsInput.split(','))
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const tagIds = [];
  for (const name of tagNames) {
    const [existing] = await connection.query('SELECT id FROM tags WHERE tag_name = ?', [name]);
    if (existing.length > 0) {
      tagIds.push(existing[0].id);
    } else {
      const [insert] = await connection.query('INSERT INTO tags (tag_name) VALUES (?)', [name]);
      tagIds.push(insert.insertId);
    }
  }
  return tagIds;
}

/**
 * 1. Create a draft resource with optional uploaded file
 */
export async function createResource(data, file, user, meta = {}) {
  const {
    title,
    category_id,
    sub_category_id = null,
    sub_category_text = null,
    description = '',
    author_or_instructor,
    unit_or_source = 'Sespimma Sespim Lemdiklat Polri',
    access_classification = 'Internal',
    lifecycle_status = 'Draft',
    physical_location = null,
    tags = []
  } = data;

  if (!title || !category_id || !author_or_instructor) {
    const error = new Error('Judul, Kategori, dan Penulis/Tenaga Pendidik wajib diisi');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const resourceUuid = crypto.randomUUID();
  let hasDigitalFile = 0;
  let fileFormat = null;
  let fileSizeBytes = null;
  let fileSizeLabel = null;
  let fileUrl = null;

  if (file) {
    hasDigitalFile = 1;
    const ext = path.extname(file.originalname).toUpperCase().replace('.', '');
    fileFormat = ['PDF', 'DOCX', 'PPTX', 'MP4', 'EPUB'].includes(ext) ? ext : 'PDF';
    fileSizeBytes = file.size;
    fileSizeLabel = formatBytes(file.size);
    fileUrl = `/${file.filename}`;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const insertQuery = `
      INSERT INTO resources (
        uuid, title, category_id, sub_category_id, sub_category_text,
        description, author_or_instructor, unit_or_source,
        lifecycle_status, access_classification,
        has_digital_file, file_format, file_size_bytes, file_size_label, file_url,
        physical_location, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(insertQuery, [
      resourceUuid,
      title.trim(),
      category_id,
      sub_category_id || null,
      sub_category_text || null,
      description.trim(),
      author_or_instructor.trim(),
      unit_or_source.trim(),
      lifecycle_status,
      access_classification,
      hasDigitalFile,
      fileFormat,
      fileSizeBytes,
      fileSizeLabel,
      fileUrl,
      physical_location,
      user.id
    ]);

    const newResourceId = result.insertId;

    // Attach tags
    const tagIds = await syncTags(tags, connection);
    for (const tagId of tagIds) {
      await connection.query(
        'INSERT IGNORE INTO resource_tags (resource_id, tag_id) VALUES (?, ?)',
        [newResourceId, tagId]
      );
    }

    await connection.commit();

    // Log activity
    await logActivity({
      userId: user.id,
      userName: user.nama_lengkap,
      role: user.role_code,
      actionType: 'CREATE',
      entityType: 'resources',
      entityId: newResourceId,
      description: `Pengguna ${user.nama_lengkap} membuat sumber belajar draf: "${title.trim()}"`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent
    });

    return {
      id: newResourceId,
      uuid: resourceUuid,
      title: title.trim(),
      category_id,
      lifecycle_status,
      access_classification,
      has_digital_file: Boolean(hasDigitalFile),
      file_url: fileUrl,
      file_size_label: fileSizeLabel
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 2. Update resource metadata & optional replacement file
 */
export async function updateResource(id, data, file, user, meta = {}) {
  const [existing] = await pool.query('SELECT * FROM resources WHERE id = ?', [id]);
  if (existing.length === 0) {
    const error = new Error('Sumber belajar tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  const current = existing[0];

  // RBAC ownership check: Non-admins can only modify resources they created
  if (user.role_code !== 'admin' && current.created_by && Number(current.created_by) !== Number(user.id)) {
    const error = new Error('Anda tidak memiliki wewenang untuk mengubah materi ajar milik pengusul lain.');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  const {
    title = current.title,
    category_id = current.category_id,
    sub_category_id = current.sub_category_id,
    sub_category_text = current.sub_category_text,
    description = current.description,
    author_or_instructor = current.author_or_instructor,
    unit_or_source = current.unit_or_source,
    access_classification = current.access_classification,
    physical_location = current.physical_location,
    tags
  } = data;

  let hasDigitalFile = current.has_digital_file;
  let fileFormat = current.file_format;
  let fileSizeBytes = current.file_size_bytes;
  let fileSizeLabel = current.file_size_label;
  let fileUrl = current.file_url;

  if (file) {
    hasDigitalFile = 1;
    const ext = path.extname(file.originalname).toUpperCase().replace('.', '');
    fileFormat = ['PDF', 'DOCX', 'PPTX', 'MP4', 'EPUB'].includes(ext) ? ext : 'PDF';
    fileSizeBytes = file.size;
    fileSizeLabel = formatBytes(file.size);
    fileUrl = `/${file.filename}`;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const updateQuery = `
      UPDATE resources SET
        title = ?, category_id = ?, sub_category_id = ?, sub_category_text = ?,
        description = ?, author_or_instructor = ?, unit_or_source = ?,
        access_classification = ?, physical_location = ?,
        has_digital_file = ?, file_format = ?, file_size_bytes = ?, file_size_label = ?, file_url = ?
      WHERE id = ?
    `;

    await connection.query(updateQuery, [
      title.trim(),
      category_id,
      sub_category_id || null,
      sub_category_text || null,
      description.trim(),
      author_or_instructor.trim(),
      unit_or_source.trim(),
      access_classification,
      physical_location,
      hasDigitalFile,
      fileFormat,
      fileSizeBytes,
      fileSizeLabel,
      fileUrl,
      id
    ]);

    if (tags !== undefined) {
      await connection.query('DELETE FROM resource_tags WHERE resource_id = ?', [id]);
      const tagIds = await syncTags(tags, connection);
      for (const tagId of tagIds) {
        await connection.query(
          'INSERT IGNORE INTO resource_tags (resource_id, tag_id) VALUES (?, ?)',
          [id, tagId]
        );
      }
    }

    await connection.commit();

    await logActivity({
      userId: user.id,
      userName: user.nama_lengkap,
      role: user.role_code,
      actionType: 'UPDATE',
      entityType: 'resources',
      entityId: id,
      description: `Pengguna ${user.nama_lengkap} memperbarui data sumber belajar ID: ${id} ("${title}")`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent
    });

    return {
      id: Number(id),
      title,
      category_id,
      access_classification,
      file_url: fileUrl
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 3. Transition resource to 'Arsip' (soft delete / academic preservation)
 */
export async function archiveResource(id, user, meta = {}) {
  const [existing] = await pool.query('SELECT id, title, lifecycle_status FROM resources WHERE id = ?', [id]);
  if (existing.length === 0) {
    const error = new Error('Sumber belajar tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  const resource = existing[0];

  if (resource.lifecycle_status === 'Arsip') {
    const error = new Error('Sumber belajar sudah berada dalam status Arsip');
    error.statusCode = 400;
    error.code = 'INVALID_STATE';
    throw error;
  }

  await pool.query(
    "UPDATE resources SET lifecycle_status = 'Arsip', archived_at = NOW() WHERE id = ?",
    [id]
  );

  await logActivity({
    userId: user.id,
    userName: user.nama_lengkap,
    role: user.role_code,
    actionType: 'ARCHIVE',
    entityType: 'resources',
    entityId: id,
    description: `Pengguna ${user.nama_lengkap} mengarsipkan sumber belajar ID ${id}: "${resource.title}"`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  return {
    id: Number(id),
    title: resource.title,
    previous_status: resource.lifecycle_status,
    lifecycle_status: 'Arsip',
    archived_at: new Date().toISOString()
  };
}

/**
 * 4. Get verification queue for Bag Jarlat
 */
export async function getVerificationQueue(params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 10));
  const offset = (page - 1) * limit;

  const conditions = ["r.lifecycle_status IN ('Draft', 'Diverifikasi')"];
  const queryParams = [];

  if (params.category_id) {
    conditions.push('r.category_id = ?');
    queryParams.push(params.category_id);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM resources r ${whereClause}`,
    queryParams
  );
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / limit);

  const query = `
    SELECT r.id, r.uuid, r.title, r.lifecycle_status, r.access_classification,
           r.author_or_instructor, r.unit_or_source, r.created_at,
           c.name AS category_name, c.slug AS category_slug,
           u.nama_lengkap AS creator_name,
           DATEDIFF(NOW(), r.created_at) AS days_in_queue
    FROM resources r
    JOIN categories c ON r.category_id = c.id
    LEFT JOIN users u ON r.created_by = u.id
    ${whereClause}
    ORDER BY r.created_at ASC
    LIMIT ? OFFSET ?
  `;

  const [items] = await pool.query(query, [...queryParams, limit, offset]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

/**
 * 5. Review resource (Approve to Dipublikasikan, Revision to Draft, Reject to Tidak Aktif)
 */
export async function reviewResource(id, decision, notes = '', verifier, meta = {}) {
  const [existing] = await pool.query(
    'SELECT id, title, lifecycle_status FROM resources WHERE id = ?',
    [id]
  );

  if (existing.length === 0) {
    const error = new Error('Sumber belajar tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const resource = existing[0];
  const statusBefore = resource.lifecycle_status;

  let statusAfter = '';
  let actionResult = '';

  const dec = decision.toLowerCase();
  if (['approve', 'disetujui', 'setuju'].includes(dec)) {
    statusAfter = 'Dipublikasikan';
    actionResult = 'Disetujui';
  } else if (['revision', 'revisi'].includes(dec)) {
    statusAfter = 'Draft';
    actionResult = 'Revisi';
  } else if (['reject', 'ditolak', 'tolak'].includes(dec)) {
    statusAfter = 'Tidak Aktif';
    actionResult = 'Ditolak';
  } else {
    const error = new Error("Keputusan verifikasi tidak valid. Pilihan: 'approve', 'revision', atau 'reject'");
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let updateResourceSql = `
      UPDATE resources 
      SET lifecycle_status = ?, verified_by = ?
    `;
    const updateParams = [statusAfter, verifier.id];

    if (statusAfter === 'Dipublikasikan') {
      updateResourceSql += ', published_at = NOW()';
    }

    updateResourceSql += ' WHERE id = ?';
    updateParams.push(id);

    await connection.query(updateResourceSql, updateParams);

    // Record into verification_logs
    const insertLogSql = `
      INSERT INTO verification_logs (
        resource_id, verifier_id, status_before, status_after, action_result, notes
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.query(insertLogSql, [
      id,
      verifier.id,
      statusBefore,
      statusAfter,
      actionResult,
      notes ? notes.trim() : null
    ]);

    await connection.commit();

    // Audit activity log
    await logActivity({
      userId: verifier.id,
      userName: verifier.nama_lengkap,
      role: verifier.role_code,
      actionType: `VERIFY_${actionResult.toUpperCase()}`,
      entityType: 'resources',
      entityId: id,
      description: `Verifikator ${verifier.nama_lengkap} melakukan ${actionResult} terhadap naskah "${resource.title}" (${statusBefore} -> ${statusAfter})`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent
    });

    return {
      resource_id: Number(id),
      title: resource.title,
      status_before: statusBefore,
      status_after: statusAfter,
      action_result: actionResult,
      verifier: verifier.nama_lengkap,
      notes: notes.trim()
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * 6. Get users list with role filter
 */
export async function getUsers(params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 20));
  const offset = (page - 1) * limit;

  const conditions = [];
  const queryParams = [];

  if (params.role_code) {
    conditions.push('r.role_code = ?');
    queryParams.push(params.role_code);
  }

  if (params.role_id) {
    conditions.push('u.role_id = ?');
    queryParams.push(params.role_id);
  }

  if (params.is_active !== undefined && params.is_active !== '') {
    conditions.push('u.is_active = ?');
    queryParams.push(params.is_active === 'true' || params.is_active === '1' ? 1 : 0);
  }

  if (params.search || params.q) {
    const keyword = `%${(params.search || params.q).trim()}%`;
    conditions.push('(u.nama_lengkap LIKE ? OR u.nrp_nip LIKE ? OR u.email LIKE ?)');
    queryParams.push(keyword, keyword, keyword);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM users u JOIN roles r ON u.role_id = r.id ${whereClause}`, queryParams);
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / limit);

  const query = `
    SELECT u.id, u.uuid, u.nrp_nip, u.nama_lengkap, u.email, u.phone_number,
           u.avatar_url, u.is_active, u.last_login_at, u.created_at,
           r.id AS role_id, r.role_code, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    ${whereClause}
    ORDER BY u.id ASC
    LIMIT ? OFFSET ?
  `;

  const [items] = await pool.query(query, [...queryParams, limit, offset]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

/**
 * 7. Update user role
 */
export async function updateUserRole(userId, newRoleIdentifier, adminUser, meta = {}) {
  let roleCondition = 'id = ?';
  if (isNaN(newRoleIdentifier)) {
    roleCondition = 'role_code = ?';
  }

  const [roles] = await pool.query(`SELECT id, role_code, role_name FROM roles WHERE ${roleCondition}`, [newRoleIdentifier]);
  if (roles.length === 0) {
    const error = new Error('Peran tujuan (role) tidak valid');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }
  const targetRole = roles[0];

  const [users] = await pool.query('SELECT id, nama_lengkap, role_id FROM users WHERE id = ?', [userId]);
  if (users.length === 0) {
    const error = new Error('Pengguna tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  const user = users[0];

  await pool.query('UPDATE users SET role_id = ? WHERE id = ?', [targetRole.id, userId]);

  await logActivity({
    userId: adminUser.id,
    userName: adminUser.nama_lengkap,
    role: adminUser.role_code,
    actionType: 'UPDATE_ROLE',
    entityType: 'users',
    entityId: userId,
    description: `Admin ${adminUser.nama_lengkap} mengubah peran pengguna ${user.nama_lengkap} menjadi ${targetRole.role_name}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  return {
    user_id: Number(userId),
    user_name: user.nama_lengkap,
    new_role: targetRole.role_code,
    role_name: targetRole.role_name
  };
}

/**
 * 8. Activate / Deactivate user account
 */
export async function updateUserStatus(userId, isActive, adminUser, meta = {}) {
  const activeVal = isActive === true || isActive === 1 || isActive === '1' || isActive === 'true' ? 1 : 0;

  const [users] = await pool.query('SELECT id, nama_lengkap, is_active FROM users WHERE id = ?', [userId]);
  if (users.length === 0) {
    const error = new Error('Pengguna tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  const user = users[0];

  // Prevent admin from deactivating themselves
  if (user.id === adminUser.id && activeVal === 0) {
    const error = new Error('Anda tidak dapat menonaktifkan akun Administrator Anda sendiri');
    error.statusCode = 400;
    error.code = 'INVALID_ACTION';
    throw error;
  }

  await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [activeVal, userId]);

  const action = activeVal === 1 ? 'mengaktifkan' : 'menonaktifkan';
  await logActivity({
    userId: adminUser.id,
    userName: adminUser.nama_lengkap,
    role: adminUser.role_code,
    actionType: activeVal === 1 ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
    entityType: 'users',
    entityId: userId,
    description: `Admin ${adminUser.nama_lengkap} ${action} akun ${user.nama_lengkap}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  return {
    user_id: Number(userId),
    user_name: user.nama_lengkap,
    is_active: Boolean(activeVal)
  };
}

/**
 * 9. Aggregate system statistics for monitoring dashboard
 */
export async function getMonitoringStats() {
  // 1. Resources by lifecycle
  const [lifecycleRows] = await pool.query(`
    SELECT lifecycle_status, COUNT(*) AS count 
    FROM resources 
    GROUP BY lifecycle_status
  `);

  // 2. Resources by access classification
  const [accessRows] = await pool.query(`
    SELECT access_classification, COUNT(*) AS count 
    FROM resources 
    GROUP BY access_classification
  `);

  // 3. Resources by category
  const [categoryRows] = await pool.query(`
    SELECT c.name AS category_name, c.slug, COUNT(r.id) AS total_resources,
           SUM(CASE WHEN r.lifecycle_status = 'Dipublikasikan' THEN 1 ELSE 0 END) AS published_resources
    FROM categories c
    LEFT JOIN resources r ON c.id = r.category_id
    GROUP BY c.id
    ORDER BY c.display_order ASC
  `);

  // 4. Books by library category
  const [libraryRows] = await pool.query(`
    SELECT lc.name AS library_category, COUNT(b.id) AS total_books,
           SUM(b.stock_available) AS total_stock_available
    FROM library_categories lc
    LEFT JOIN books b ON lc.id = b.library_category_id
    GROUP BY lc.id
  `);

  // 5. Users by role
  const [userRoleRows] = await pool.query(`
    SELECT r.role_code, r.role_name, COUNT(u.id) AS user_count,
           SUM(CASE WHEN u.is_active = 1 THEN 1 ELSE 0 END) AS active_users
    FROM roles r
    LEFT JOIN users u ON r.id = u.role_id
    GROUP BY r.id
  `);

  // 6. Recent searches
  const [recentSearches] = await pool.query(`
    SELECT query_text, category_filter, results_count, created_at
    FROM search_logs
    ORDER BY id DESC
    LIMIT 10
  `);

  return {
    overview: {
      lifecycle: lifecycleRows,
      access_classification: accessRows,
      categories: categoryRows,
      library_categories: libraryRows,
      users: userRoleRows,
      recent_searches: recentSearches
    }
  };
}

/**
 * 10. Query audit logs (activity_logs and search_logs)
 */
export async function getAuditLogs(params = {}) {
  const type = params.type || 'activity';
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 20));
  const offset = (page - 1) * limit;

  if (type === 'search') {
    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM search_logs');
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    const [items] = await pool.query(`
      SELECT sl.*, u.nama_lengkap AS user_name 
      FROM search_logs sl 
      LEFT JOIN users u ON sl.user_id = u.id 
      ORDER BY sl.id DESC 
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    return {
      items,
      pagination: { page, limit, total, totalPages }
    };
  }

  if (type === 'verification') {
    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM verification_logs');
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    const [items] = await pool.query(`
      SELECT vl.*, r.title AS resource_title, u.nama_lengkap AS verifier_name 
      FROM verification_logs vl 
      JOIN resources r ON vl.resource_id = r.id 
      JOIN users u ON vl.verifier_id = u.id 
      ORDER BY vl.id DESC 
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    return {
      items,
      pagination: { page, limit, total, totalPages }
    };
  }

  // Default: activity_logs
  const conditions = [];
  const queryParams = [];

  if (params.action_type) {
    conditions.push('action_type = ?');
    queryParams.push(params.action_type);
  }

  if (params.user_id) {
    conditions.push('user_id = ?');
    queryParams.push(params.user_id);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM activity_logs ${whereClause}`, queryParams);
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / limit);

  const [items] = await pool.query(`
    SELECT * FROM activity_logs 
    ${whereClause} 
    ORDER BY id DESC 
    LIMIT ? OFFSET ?
  `, [...queryParams, limit, offset]);

  return {
    items,
    pagination: { page, limit, total, totalPages }
  };
}

/**
 * Delete resource (Hard or Soft Delete to Arsip) with audit logging
 */
export async function deleteResource(id, user, hard = false, meta = {}) {
  const [existing] = await pool.query('SELECT * FROM resources WHERE id = ?', [id]);
  if (existing.length === 0) {
    const error = new Error('Sumber belajar tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  const current = existing[0];

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (hard) {
      await connection.query('DELETE FROM resource_tags WHERE resource_id = ?', [id]);
      await connection.query('DELETE FROM search_history WHERE matched_resource_id = ?', [id]);
      await connection.query('DELETE FROM verification_logs WHERE resource_id = ?', [id]);
      await connection.query('DELETE FROM resources WHERE id = ?', [id]);
    } else {
      await connection.query(
        "UPDATE resources SET lifecycle_status = 'Arsip', archived_at = NOW() WHERE id = ?",
        [id]
      );
    }

    await connection.commit();

    await logActivity({
      userId: user.id,
      userName: user.nama_lengkap,
      role: user.role_code,
      actionType: hard ? 'HARD_DELETE_RESOURCE' : 'ARCHIVE_RESOURCE',
      entityType: 'resources',
      entityId: id,
      description: `Administrator ${user.nama_lengkap} ${hard ? 'menghapus permanen' : 'mengarsipkan'} sumber belajar: ${current.title}`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent
    });

    return {
      id: Number(id),
      title: current.title,
      deleted: hard,
      archived: !hard,
      lifecycle_status: hard ? 'Deleted' : 'Arsip'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Change resource lifecycle status directly
 */
export async function updateResourceStatus(id, newStatus, user, meta = {}) {
  const validStatuses = ['Draft', 'Diverifikasi', 'Dipublikasikan', 'Tidak Aktif', 'Arsip'];
  if (!validStatuses.includes(newStatus)) {
    const error = new Error(`Status tidak valid. Harus salah satu dari: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const [existing] = await pool.query('SELECT * FROM resources WHERE id = ?', [id]);
  if (existing.length === 0) {
    const error = new Error('Sumber belajar tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  const current = existing[0];

  let publishedAt = current.published_at;
  let archivedAt = current.archived_at;
  if (newStatus === 'Dipublikasikan' && !publishedAt) {
    publishedAt = new Date();
  } else if (newStatus === 'Arsip') {
    archivedAt = new Date();
  }

  await pool.query(
    'UPDATE resources SET lifecycle_status = ?, published_at = ?, archived_at = ? WHERE id = ?',
    [newStatus, publishedAt, archivedAt, id]
  );

  await logActivity({
    userId: user.id,
    userName: user.nama_lengkap,
    role: user.role_code,
    actionType: 'CHANGE_STATUS_RESOURCE',
    entityType: 'resources',
    entityId: id,
    description: `Administrator ${user.nama_lengkap} mengubah status "${current.title}" dari ${current.lifecycle_status} menjadi ${newStatus}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  return {
    id: Number(id),
    title: current.title,
    previous_status: current.lifecycle_status,
    lifecycle_status: newStatus
  };
}

/**
 * Book CMS: Create Book
 */
export async function createBook(data, file, user, meta = {}) {
  const {
    title,
    isbn = null,
    author = 'Tim Sespimma Lemdiklat Polri',
    publisher = 'Sespimma Lemdiklat Polri',
    published_year = new Date().getFullYear(),
    synopsis = '',
    library_category_id = 1,
    sub_category = null,
    language = 'Indonesia',
    call_number = null,
    physical_location = 'Perpustakaan Sespimma Lemdiklat Polri',
    stock_total = 10,
    stock_available = 10,
    access_classification = 'Terbuka',
    lifecycle_status = 'Dipublikasikan'
  } = data;

  if (!title) {
    const error = new Error('Judul buku wajib diisi');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const bookUuid = crypto.randomUUID();
  const [insert] = await pool.query(
    `INSERT INTO books (
      uuid, isbn, title, author, publisher, published_year,
      synopsis, library_category_id, sub_category, language,
      call_number, physical_location, stock_total, stock_available,
      access_classification, lifecycle_status, created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      bookUuid, isbn, title.trim(), author.trim(), publisher.trim(), published_year,
      synopsis.trim(), library_category_id, sub_category, language,
      call_number, physical_location, stock_total, stock_available,
      access_classification, lifecycle_status, user.id
    ]
  );

  const bookId = insert.insertId;

  if (file) {
    const ext = path.extname(file.originalname).toUpperCase().replace('.', '');
    const fileFormat = ['PDF', 'EPUB', 'DOCX'].includes(ext) ? ext : 'PDF';
    const filePath = `library/${file.filename}`;
    await pool.query(
      `INSERT INTO book_files (book_id, file_format, file_size_bytes, file_path, preview_file_path)
       VALUES (?, ?, ?, ?, ?)`,
      [bookId, fileFormat, file.size, filePath, filePath]
    );
  }

  await logActivity({
    userId: user.id,
    userName: user.nama_lengkap,
    role: user.role_code,
    actionType: 'CREATE_BOOK',
    entityType: 'books',
    entityId: bookId,
    description: `Administrator ${user.nama_lengkap} menambahkan buku katalog: ${title}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  return { id: bookId, uuid: bookUuid, title, author, library_category_id };
}

/**
 * Book CMS: Update Book
 */
export async function updateBook(id, data, file, user, meta = {}) {
  const [existing] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
  if (existing.length === 0) {
    const error = new Error('Buku tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  const current = existing[0];

  const {
    title = current.title,
    author = current.author,
    publisher = current.publisher,
    published_year = current.published_year,
    synopsis = current.synopsis,
    library_category_id = current.library_category_id,
    sub_category = current.sub_category,
    call_number = current.call_number,
    physical_location = current.physical_location,
    stock_total = current.stock_total,
    stock_available = current.stock_available,
    access_classification = current.access_classification,
    lifecycle_status = current.lifecycle_status
  } = data;

  await pool.query(
    `UPDATE books SET
      title = ?, author = ?, publisher = ?, published_year = ?,
      synopsis = ?, library_category_id = ?, sub_category = ?,
      call_number = ?, physical_location = ?, stock_total = ?, stock_available = ?,
      access_classification = ?, lifecycle_status = ?
     WHERE id = ?`,
    [
      title.trim(), author.trim(), publisher.trim(), published_year,
      synopsis.trim(), library_category_id, sub_category,
      call_number, physical_location, stock_total, stock_available,
      access_classification, lifecycle_status, id
    ]
  );

  if (file) {
    const ext = path.extname(file.originalname).toUpperCase().replace('.', '');
    const fileFormat = ['PDF', 'EPUB', 'DOCX'].includes(ext) ? ext : 'PDF';
    const filePath = `library/${file.filename}`;
    const [existingFile] = await pool.query('SELECT id FROM book_files WHERE book_id = ?', [id]);
    if (existingFile.length > 0) {
      await pool.query(
        'UPDATE book_files SET file_format = ?, file_size_bytes = ?, file_path = ?, preview_file_path = ? WHERE id = ?',
        [fileFormat, file.size, filePath, filePath, existingFile[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO book_files (book_id, file_format, file_size_bytes, file_path, preview_file_path) VALUES (?, ?, ?, ?, ?)',
        [id, fileFormat, file.size, filePath, filePath]
      );
    }
  }

  await logActivity({
    userId: user.id,
    userName: user.nama_lengkap,
    role: user.role_code,
    actionType: 'UPDATE_BOOK',
    entityType: 'books',
    entityId: id,
    description: `Administrator ${user.nama_lengkap} memperbarui buku: ${title}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  return { id: Number(id), title, author, library_category_id };
}

/**
 * Book CMS: Delete Book
 */
export async function deleteBook(id, user, meta = {}) {
  const [existing] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
  if (existing.length === 0) {
    const error = new Error('Buku tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }
  const current = existing[0];

  await pool.query('DELETE FROM book_files WHERE book_id = ?', [id]);
  await pool.query('DELETE FROM books WHERE id = ?', [id]);

  await logActivity({
    userId: user.id,
    userName: user.nama_lengkap,
    role: user.role_code,
    actionType: 'DELETE_BOOK',
    entityType: 'books',
    entityId: id,
    description: `Administrator ${user.nama_lengkap} menghapus buku: ${current.title}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  return { id: Number(id), title: current.title, deleted: true };
}

/**
 * User CMS: Create User
 */
export async function createUser(data, user, meta = {}) {
  const { nrp_nip, nama_lengkap, email, password, role_id = 1, phone_number = null } = data;
  if (!nrp_nip || !nama_lengkap || !email || !password) {
    const error = new Error('NRP/NIP, Nama Lengkap, Email, dan Password wajib diisi');
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE nrp_nip = ? OR email = ?', [nrp_nip, email]);
  if (existing.length > 0) {
    const error = new Error('NRP/NIP atau Email sudah terdaftar');
    error.statusCode = 409;
    error.code = 'DUPLICATE_ENTRY';
    throw error;
  }

  const bcrypt = await import('bcryptjs');
  const passwordHash = bcrypt.default.hashSync(password, 10);
  const userUuid = crypto.randomUUID();

  const [insert] = await pool.query(
    'INSERT INTO users (uuid, nrp_nip, nama_lengkap, email, password_hash, role_id, phone_number, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
    [userUuid, nrp_nip.trim(), nama_lengkap.trim(), email.trim(), passwordHash, role_id, phone_number]
  );

  await logActivity({
    userId: user.id,
    userName: user.nama_lengkap,
    role: user.role_code,
    actionType: 'CREATE_USER',
    entityType: 'users',
    entityId: insert.insertId,
    description: `Administrator ${user.nama_lengkap} mendaftarkan pengguna baru: ${nama_lengkap} (${nrp_nip})`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent
  });

  return { id: insert.insertId, uuid: userUuid, nrp_nip, nama_lengkap, email, role_id };
}
