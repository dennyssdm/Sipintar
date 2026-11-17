import pool from '../config/db.js';

/**
 * Get paginated list of resources with filtering
 * @param {object} params
 * @param {object|null} user - Authenticated user context
 */
export async function getResources(params = {}, user = null) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 10));
  const offset = (page - 1) * limit;

  const conditions = [];
  const queryParams = [];

  // Lifecycle status rule:
  // Non-admin / non-verifier users can only view 'Dipublikasikan'
  const isPrivileged = user && ['admin', 'verifikator'].includes(user.role_code);

  if (isPrivileged && params.lifecycle_status) {
    conditions.push('r.lifecycle_status = ?');
    queryParams.push(params.lifecycle_status);
  } else if (!isPrivileged) {
    conditions.push("r.lifecycle_status = 'Dipublikasikan'");
  }

  // Filter by category_id or slug
  if (params.category_id) {
    conditions.push('r.category_id = ?');
    queryParams.push(params.category_id);
  }

  // Filter by sub_category_id
  if (params.sub_category_id) {
    conditions.push('r.sub_category_id = ?');
    queryParams.push(params.sub_category_id);
  }

  // Filter by access_classification
  if (params.access_classification) {
    conditions.push('r.access_classification = ?');
    queryParams.push(params.access_classification);
  }

  // Filter by keyword search
  if (params.search || params.q) {
    const keyword = `%${(params.search || params.q).trim()}%`;
    conditions.push('(r.title LIKE ? OR r.description LIKE ? OR r.author_or_instructor LIKE ?)');
    queryParams.push(keyword, keyword, keyword);
  }

  // Filter by tag
  if (params.tag) {
    conditions.push(`EXISTS (
      SELECT 1 FROM resource_tags rt 
      JOIN tags t ON rt.tag_id = t.id 
      WHERE rt.resource_id = r.id AND t.tag_name = ?
    )`);
    queryParams.push(params.tag);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Get total count
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM resources r
    ${whereClause}
  `;
  const [countRows] = await pool.query(countQuery, queryParams);
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / limit);

  // Get paginated items
  const dataQuery = `
    SELECT r.id, r.uuid, r.title, r.category_id, c.name AS category_name, c.slug AS category_slug,
           r.sub_category_id, sc.name AS sub_category_name, r.sub_category_text,
           r.description, r.author_or_instructor, r.unit_or_source,
           r.lifecycle_status, r.access_classification,
           r.has_digital_file, r.file_format, r.file_size_bytes, r.file_size_label,
           r.physical_location, r.published_at, r.created_at, r.updated_at
    FROM resources r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN sub_categories sc ON r.sub_category_id = sc.id
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const [items] = await pool.query(dataQuery, [...queryParams, limit, offset]);

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
 * Get detailed information for a single resource by ID or UUID
 * @param {string|number} identifier
 * @param {object|null} user
 */
export async function getResourceById(identifier, user = null) {
  let condition = 'r.id = ?';
  let param = identifier;

  if (isNaN(identifier)) {
    condition = 'r.uuid = ?';
  }

  const query = `
    SELECT r.*, c.name AS category_name, c.slug AS category_slug,
           sc.name AS sub_category_name,
           u_creator.nama_lengkap AS creator_name,
           u_verifier.nama_lengkap AS verifier_name
    FROM resources r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN sub_categories sc ON r.sub_category_id = sc.id
    LEFT JOIN users u_creator ON r.created_by = u_creator.id
    LEFT JOIN users u_verifier ON r.verified_by = u_verifier.id
    WHERE ${condition}
  `;

  const [rows] = await pool.query(query, [param]);

  if (rows.length === 0) {
    const error = new Error('Sumber belajar tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const resource = rows[0];

  // Lifecycle security check
  const isPrivileged = user && ['admin', 'verifikator'].includes(user.role_code);
  if (!isPrivileged && resource.lifecycle_status !== 'Dipublikasikan') {
    const error = new Error('Sumber belajar belum dipublikasikan atau berada dalam status non-aktif');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Fetch associated tags
  const [tags] = await pool.query(
    `SELECT t.id, t.tag_name 
     FROM resource_tags rt 
     JOIN tags t ON rt.tag_id = t.id 
     WHERE rt.resource_id = ?`,
    [resource.id]
  );

  return {
    ...resource,
    tags: tags || []
  };
}
