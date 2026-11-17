import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';
import { logActivity } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

/**
 * Get MIME type by file extension
 * @param {string} ext
 */
function getMimeType(ext) {
  switch (ext.toLowerCase()) {
    case '.pdf':
      return 'application/pdf';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.doc':
      return 'application/msword';
    case '.pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case '.epub':
      return 'application/epub+zip';
    case '.mp4':
      return 'video/mp4';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Stream or download resource file with access classification enforcement
 * @param {string|number} identifier - Resource ID or UUID
 * @param {object|null} user - Authenticated user context
 * @param {boolean} isDownload - Whether user requested attachment download
 * @param {object} meta - Request IP and User-Agent
 */
export async function getResourceFile(identifier, user = null, isDownload = false, meta = {}) {
  let condition = 'r.id = ?';
  let param = identifier;

  if (isNaN(identifier)) {
    condition = 'r.uuid = ?';
  }

  const query = `
    SELECT id, uuid, title, access_classification, lifecycle_status,
           has_digital_file, file_format, file_url
    FROM resources r
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

  // 1. Guard against 'Metadata Saja'
  if (resource.access_classification === 'Metadata Saja') {
    const error = new Error('Berkas digital tidak tersedia untuk publik. Silakan akses fisik di perpustakaan/ruang baca.');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  // 2. Authorization rules according to Access Classification
  if (resource.access_classification === 'Internal') {
    if (!user) {
      const error = new Error('Akses ditolak: Dokumen berklasifikasi Internal memerlukan autentikasi login.');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }
  } else if (resource.access_classification === 'Terbatas') {
    if (!user) {
      const error = new Error('Akses ditolak: Dokumen berklasifikasi Terbatas memerlukan autentikasi login.');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }
    const allowedRoles = ['admin', 'verifikator', 'gadik'];
    if (!allowedRoles.includes(user.role_code)) {
      const error = new Error('Akses ditolak: Dokumen berklasifikasi Terbatas hanya dapat diakses oleh Admin, Verifikator, atau Tenaga Pendidik.');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }
  }

  // 3. Digital file existence check
  if (!resource.has_digital_file || !resource.file_url) {
    const error = new Error('Berkas digital belum diunggah untuk dokumen ini.');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  // 4. Safe filesystem path resolution
  const relativePath = resource.file_url.replace(/^\/+/, '');
  const safePath = path.resolve(UPLOADS_DIR, relativePath);

  // Path traversal guard
  if (!safePath.startsWith(UPLOADS_DIR)) {
    const error = new Error('Akses jalur berkas tidak sah (Path Traversal Detected)');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  if (!fs.existsSync(safePath)) {
    const error = new Error('Berkas fisik dokumen tidak ditemukan pada penyimpanan server.');
    error.statusCode = 404;
    error.code = 'FILE_NOT_FOUND';
    throw error;
  }

  // 5. Asynchronous audit logging
  if (user) {
    logActivity({
      userId: user.id,
      userName: user.nama_lengkap,
      role: user.role_code,
      actionType: isDownload ? 'DOWNLOAD_FILE' : 'VIEW_FILE',
      entityType: 'resources',
      entityId: resource.id,
      description: `Pengguna ${user.nama_lengkap} ${isDownload ? 'mengunduh' : 'melihat'} berkas: ${resource.title}`,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent
    }).catch(err => console.error('[LogActivity File Error]', err.message));
  }

  const ext = path.extname(safePath);
  const mimeType = getMimeType(ext);

  return {
    filePath: safePath,
    filename: path.basename(safePath),
    title: resource.title,
    mimeType,
    isDownload
  };
}

/**
 * Get safe 10-20 page sample preview file for books
 * @param {string|number} identifier - Book ID or UUID
 */
export async function getBookPreviewFile(identifier) {
  let condition = 'b.id = ?';
  let param = identifier;

  if (isNaN(identifier)) {
    condition = 'b.uuid = ?';
  }

  const query = `
    SELECT b.id, b.uuid, b.title, b.access_classification,
           bf.file_path, bf.preview_file_path, bf.file_format
    FROM books b
    LEFT JOIN book_files bf ON b.id = bf.book_id
    WHERE ${condition}
  `;

  const [rows] = await pool.query(query, [param]);

  if (rows.length === 0) {
    const error = new Error('Buku tidak ditemukan');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  const book = rows[0];

  // 1. Guard against 'Metadata Saja'
  if (book.access_classification === 'Metadata Saja') {
    const error = new Error('Berkas digital tidak tersedia untuk publik. Silakan akses fisik di perpustakaan/ruang baca.');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  const targetPath = book.preview_file_path || book.file_path;
  if (!targetPath) {
    const error = new Error('Pratinjau berkas digital tidak tersedia untuk buku ini.');
    error.statusCode = 404;
    error.code = 'NOT_FOUND';
    throw error;
  }

  // Safe path resolution
  const relativePath = targetPath.replace(/^\/+/, '');
  const safePath = path.resolve(UPLOADS_DIR, relativePath);

  if (!safePath.startsWith(UPLOADS_DIR)) {
    const error = new Error('Akses jalur berkas tidak sah');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  if (!fs.existsSync(safePath)) {
    const error = new Error('Berkas fisik sampel pratinjau tidak ditemukan pada server.');
    error.statusCode = 404;
    error.code = 'FILE_NOT_FOUND';
    throw error;
  }

  const ext = path.extname(safePath);
  const mimeType = getMimeType(ext);

  return {
    filePath: safePath,
    filename: path.basename(safePath),
    title: book.title,
    mimeType
  };
}

