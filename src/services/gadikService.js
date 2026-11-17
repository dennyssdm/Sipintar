import pool from '../config/db.js';

/**
 * Get list of Gadik (Tenaga Pendidik / Widyaiswara)
 * @param {object} params
 */
export async function getGadikList(params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 20));
  const offset = (page - 1) * limit;

  const conditions = ["r.role_code = 'gadik'", 'u.is_active = 1'];
  const queryParams = [];

  if (params.fungsional === 'true' || params.fungsional === true) {
    conditions.push("pg.status_fungsional = 'Aktif Fungsional'");
  }

  if (params.pangkat) {
    conditions.push('pg.pangkat = ?');
    queryParams.push(params.pangkat);
  }

  if (params.kategori_jabatan) {
    conditions.push('pg.kategori_jabatan = ?');
    queryParams.push(params.kategori_jabatan);
  }

  if (params.search || params.q) {
    const keyword = `%${(params.search || params.q).trim()}%`;
    conditions.push('(u.nama_lengkap LIKE ? OR u.nrp_nip LIKE ? OR pg.jabatan LIKE ?)');
    queryParams.push(keyword, keyword, keyword);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Total count
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN user_profiles_gadik pg ON u.id = pg.user_id
    ${whereClause}
  `;
  const [countRows] = await pool.query(countQuery, queryParams);
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / limit);

  // Items query
  const dataQuery = `
    SELECT u.id, u.uuid, u.nrp_nip, u.nama_lengkap, u.email, u.phone_number, u.avatar_url,
           pg.no_urut_nominatif, pg.pangkat, pg.jabatan, pg.kategori_jabatan, pg.agama,
           pg.eselon, pg.golongan, pg.status_fungsional, pg.no_sprint, pg.bio
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN user_profiles_gadik pg ON u.id = pg.user_id
    ${whereClause}
    ORDER BY pg.no_urut_nominatif ASC, u.id ASC
    LIMIT ? OFFSET ?
  `;

  const [items] = await pool.query(dataQuery, [...queryParams, limit, offset]);

  // Attach competencies to each Gadik in the result
  if (items.length > 0) {
    const userIds = items.map(g => g.id);
    const [competencies] = await pool.query(
      `SELECT id, user_id, competency_name, competency_type 
       FROM gadik_competencies 
       WHERE user_id IN (?)`,
      [userIds]
    );

    const compMap = {};
    for (const c of competencies) {
      if (!compMap[c.user_id]) compMap[c.user_id] = [];
      compMap[c.user_id].push({
        id: c.id,
        name: c.competency_name,
        type: c.competency_type
      });
    }

    for (const item of items) {
      item.competencies = compMap[item.id] || [];
    }
  }

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
 * Get detailed profile for a single Gadik by ID, UUID, or NRP
 * @param {string|number} identifier
 */
export async function getGadikDetail(identifier) {
  let condition = 'u.id = ?';
  let param = identifier;

  if (isNaN(identifier)) {
    if (identifier.startsWith('usr-') || identifier.includes('-')) {
      condition = 'u.uuid = ?';
    } else {
      condition = 'u.nrp_nip = ?';
    }
  }

  const query = `
    SELECT u.id, u.uuid, u.nrp_nip, u.nama_lengkap, u.email, u.phone_number, u.avatar_url,
           pg.no_urut_nominatif, pg.pangkat, pg.jabatan, pg.kategori_jabatan, pg.agama,
           pg.eselon, pg.golongan, pg.status_fungsional, pg.no_sprint, pg.bio,
           u.created_at, u.updated_at
    FROM users u
    JOIN roles r ON u.role_id = r.id
    LEFT JOIN user_profiles_gadik pg ON u.id = pg.user_id
    WHERE r.role_code = 'gadik' AND ${condition}
  `;

  const [rows] = await pool.query(query, [param]);

  if (rows.length === 0) {
    const error = new Error('Tenaga pendidik (Gadik) tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const gadik = rows[0];

  // Fetch competencies
  const [competencies] = await pool.query(
    `SELECT id, competency_name, competency_type 
     FROM gadik_competencies 
     WHERE user_id = ?`,
    [gadik.id]
  );

  // Fetch associated resources taught or authored by this Gadik
  const nameParts = (gadik.nama_lengkap || '')
    .replace(/(KOMBES POL|AKBP|KOMPOL|IPTU|Dr\.|Prof\.|S\.I\.K\.|S\.H\.|M\.H\.|M\.Si\.|S\.Ak\.|S\.P\.|M\.Sc\.|M\.M\.|,|;)/gi, '')
    .trim()
    .split(/\s+/);
  const mainName = nameParts.length > 1 ? nameParts.slice(-2).join(' ') : nameParts[0];

  const [resources] = await pool.query(
    `SELECT r.id, r.uuid, r.title, r.category_id, c.name AS category_name, c.slug AS category_slug,
            r.sub_category_text, r.author_or_instructor, r.lifecycle_status, r.access_classification,
            r.file_format, r.file_size_label, r.published_at
     FROM resources r
     LEFT JOIN categories c ON r.category_id = c.id
     WHERE r.lifecycle_status = 'Dipublikasikan'
       AND (r.created_by = ? OR (r.author_or_instructor LIKE ? AND ? != ''))
     ORDER BY r.created_at DESC
     LIMIT 10`,
    [gadik.id, `%${mainName}%`, mainName]
  );

  return {
    ...gadik,
    competencies: competencies || [],
    associated_resources: resources || []
  };
}

