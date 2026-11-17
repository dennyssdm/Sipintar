import pool from '../config/db.js';

/**
 * Get library categories with book count
 */
export async function getLibraryCategories() {
  const query = `
    SELECT lc.id, lc.name, lc.description,
           COUNT(b.id) AS total_books,
           SUM(CASE WHEN b.stock_available > 0 THEN 1 ELSE 0 END) AS books_available
    FROM library_categories lc
    LEFT JOIN books b ON lc.id = b.library_category_id AND b.lifecycle_status = 'Dipublikasikan'
    GROUP BY lc.id
    ORDER BY lc.id ASC
  `;

  const [categories] = await pool.query(query);
  return categories;
}

/**
 * Get paginated list of books in library/e-library
 * @param {object} params
 */
export async function getBooks(params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 10));
  const offset = (page - 1) * limit;

  const conditions = ["b.lifecycle_status = 'Dipublikasikan'"];
  const queryParams = [];

  if (params.category_id) {
    conditions.push('b.library_category_id = ?');
    queryParams.push(params.category_id);
  }

  if (params.sub_category) {
    conditions.push('b.sub_category = ?');
    queryParams.push(params.sub_category);
  }

  if (params.author) {
    conditions.push('b.author LIKE ?');
    queryParams.push(`%${params.author.trim()}%`);
  }

  if (params.stock_available === 'true' || params.stock_available === true) {
    conditions.push('b.stock_available > 0');
  }

  if (params.search || params.q) {
    const keyword = `%${(params.search || params.q).trim()}%`;
    conditions.push('(b.title LIKE ? OR b.author LIKE ? OR b.synopsis LIKE ? OR b.call_number LIKE ?)');
    queryParams.push(keyword, keyword, keyword, keyword);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Total count
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM books b
    ${whereClause}
  `;
  const [countRows] = await pool.query(countQuery, queryParams);
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / limit);

  // Items query
  const dataQuery = `
    SELECT b.id, b.uuid, b.isbn, b.title, b.author, b.publisher, b.published_year,
           b.synopsis, b.library_category_id, lc.name AS library_category_name,
           b.sub_category, b.language, b.call_number, b.physical_location,
           b.stock_total, b.stock_available, b.cover_image_url, b.cover_color, b.cover_gradient,
           b.access_classification,
           (bf.id IS NOT NULL) AS has_digital_file,
           bf.preview_file_path IS NOT NULL AS has_preview,
           bf.file_format, bf.file_size_label, bf.total_pages, bf.preview_pages
    FROM books b
    LEFT JOIN library_categories lc ON b.library_category_id = lc.id
    LEFT JOIN book_files bf ON b.id = bf.book_id
    ${whereClause}
    ORDER BY b.created_at DESC
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
 * Get single book detail by ID or UUID
 * @param {string|number} identifier
 */
export async function getBookDetail(identifier) {
  let condition = 'b.id = ?';
  let param = identifier;

  if (isNaN(identifier)) {
    condition = 'b.uuid = ?';
  }

  const query = `
    SELECT b.*, lc.name AS library_category_name, lc.description AS library_category_description,
           bf.file_path, bf.preview_file_path, bf.file_format, bf.file_size_label,
           bf.total_pages, bf.preview_pages, bf.download_count
    FROM books b
    LEFT JOIN library_categories lc ON b.library_category_id = lc.id
    LEFT JOIN book_files bf ON b.id = bf.book_id
    WHERE ${condition}
  `;

  const [rows] = await pool.query(query, [param]);

  if (rows.length === 0) {
    const error = new Error('Buku perpustakaan tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const book = rows[0];

  // If access is Metadata Saja, sanitize out file_path so direct link is never exposed
  if (book.access_classification === 'Metadata Saja') {
    delete book.file_path;
  }

  return book;
}

