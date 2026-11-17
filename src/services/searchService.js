import pool from '../config/db.js';

/**
 * Perform unified search across resources, books, and gadik
 * @param {object} params
 * @param {string} params.q - Search query
 * @param {string} [params.category] - Filter category: 'all', 'resources', 'books', 'gadik', or specific slug
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {object|null} user - Authenticated user context
 */
export async function unifiedSearch(params = {}, user = null) {
  const query = (params.q || params.query || '').trim();
  const categoryFilter = params.category || 'all';
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 10));

  if (!query) {
    return {
      items: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  }

  // Build boolean mode search term: e.g. "manajemen risiko" -> "+manajemen* +risiko*"
  const words = query.split(/\s+/).filter(w => w.length > 0);
  const booleanTerm = words.map(w => `+${w.replace(/[+\-><()~*\"@]/g, '')}*`).join(' ');
  const likeTerm = `%${query}%`;

  const results = [];

  const includeResources = ['all', 'resources', 'modul', 'hanjar', 'sop', 'pedoman', 'kurikulum', 'manual'].includes(categoryFilter);
  const includeBooks = ['all', 'books', 'library', 'buku-fisik', 'ebook', 'jurnal', 'taskap'].includes(categoryFilter);
  const includeGadik = ['all', 'gadik'].includes(categoryFilter);

  // 1. Search in Resources
  if (includeResources) {
    let resQuery = `
      SELECT r.id, r.uuid, r.title, r.description, r.author_or_instructor,
             r.lifecycle_status, r.access_classification,
             c.name AS category_name, c.slug AS category_slug,
             'resource' AS item_type,
             (MATCH(r.title, r.description, r.author_or_instructor) AGAINST (? IN BOOLEAN MODE) * 2 +
              CASE WHEN r.title LIKE ? THEN 5 ELSE 0 END) AS score
      FROM resources r
      JOIN categories c ON r.category_id = c.id
      WHERE r.lifecycle_status = 'Dipublikasikan'
        AND (MATCH(r.title, r.description, r.author_or_instructor) AGAINST (? IN BOOLEAN MODE)
             OR r.title LIKE ? OR r.author_or_instructor LIKE ?)
    `;
    const resParams = [booleanTerm, likeTerm, booleanTerm, likeTerm, likeTerm];

    if (!['all', 'resources'].includes(categoryFilter)) {
      resQuery += ' AND c.slug = ?';
      resParams.push(categoryFilter);
    }

    const [resRows] = await pool.query(resQuery, resParams);
    for (const r of resRows) {
      results.push({
        id: r.id,
        uuid: r.uuid,
        type: 'resource',
        title: r.title,
        subtitle: `${r.category_name} • ${r.author_or_instructor}`,
        description: r.description ? r.description.substring(0, 200) + '...' : '',
        category: r.category_name,
        category_slug: r.category_slug,
        access_classification: r.access_classification,
        score: Number(r.score) || 1
      });
    }
  }

  // 2. Search in Library Books
  if (includeBooks) {
    let bookQuery = `
      SELECT b.id, b.uuid, b.title, b.author, b.synopsis, b.call_number,
             b.access_classification, lc.id AS library_category_id, lc.name AS library_category_name,
             'book' AS item_type,
             (MATCH(b.title, b.author, b.synopsis) AGAINST (? IN BOOLEAN MODE) * 2 +
              CASE WHEN b.title LIKE ? THEN 5 ELSE 0 END) AS score
      FROM books b
      JOIN library_categories lc ON b.library_category_id = lc.id
      WHERE b.lifecycle_status = 'Dipublikasikan'
        AND (MATCH(b.title, b.author, b.synopsis) AGAINST (? IN BOOLEAN MODE)
             OR b.title LIKE ? OR b.author LIKE ?)
    `;
    const bookParams = [booleanTerm, likeTerm, booleanTerm, likeTerm, likeTerm];

    if (!['all', 'books', 'library'].includes(categoryFilter)) {
      bookQuery += ' AND lc.id = ?';
      bookParams.push(categoryFilter);
    }

    const [bookRows] = await pool.query(bookQuery, bookParams);
    for (const b of bookRows) {
      results.push({
        id: b.id,
        uuid: b.uuid,
        type: 'book',
        title: b.title,
        subtitle: `${b.library_category_name} • ${b.author} (${b.call_number})`,
        description: b.synopsis ? b.synopsis.substring(0, 200) + '...' : '',
        category: b.library_category_name,
        category_slug: b.library_category_id,
        access_classification: b.access_classification,
        score: Number(b.score) || 1
      });
    }
  }

  // 3. Search in Gadik
  if (includeGadik) {
    const gadikQuery = `
      SELECT u.id, u.uuid, u.nrp_nip, u.nama_lengkap, pg.pangkat, pg.jabatan, pg.bio,
             'gadik' AS item_type,
             (CASE WHEN u.nama_lengkap LIKE ? THEN 10 WHEN pg.jabatan LIKE ? THEN 5 ELSE 2 END) AS score
      FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN user_profiles_gadik pg ON u.id = pg.user_id
      WHERE r.role_code = 'gadik' AND u.is_active = 1
        AND (u.nama_lengkap LIKE ? OR u.nrp_nip LIKE ? OR pg.jabatan LIKE ? OR pg.bio LIKE ?
             OR EXISTS (SELECT 1 FROM gadik_competencies gc WHERE gc.user_id = u.id AND gc.competency_name LIKE ?))
    `;
    const [gadikRows] = await pool.query(gadikQuery, [
      likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm
    ]);

    for (const g of gadikRows) {
      results.push({
        id: g.id,
        uuid: g.uuid,
        type: 'gadik',
        title: g.nama_lengkap,
        subtitle: `${g.pangkat} • ${g.jabatan} (NRP: ${g.nrp_nip})`,
        description: g.bio ? g.bio.substring(0, 200) + '...' : '',
        category: 'Gadik & Tenaga Pendidik',
        category_slug: 'gadik',
        access_classification: 'Terbuka',
        score: Number(g.score) || 1
      });
    }
  }

  // Sort results by score DESC
  results.sort((a, b) => b.score - a.score);

  // Pagination slice
  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const pagedItems = results.slice(offset, offset + limit);

  // Async audit log to search_logs
  pool.query(
    'INSERT INTO search_logs (user_id, query_text, category_filter, results_count) VALUES (?, ?, ?, ?)',
    [user ? user.id : null, query, categoryFilter, total]
  ).catch(err => console.error('[SearchLog Error]', err.message));

  return {
    items: pagedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
}

