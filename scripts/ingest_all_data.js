import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pool from '../src/config/db.js';

function cleanTitle(rawName) {
  return rawName
    .replace(/\.(pdf|docx|pptx|doc|ppt)$/i, '')
    .replace(/^(\d+[\.\s_]+)+/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getFileFormat(filename) {
  const ext = path.extname(filename).toUpperCase().replace('.', '');
  if (['PDF', 'DOCX', 'PPTX', 'EPUB', 'MP4'].includes(ext)) return ext;
  return 'PDF';
}

async function syncTag(tagName, connection) {
  const cleanTag = tagName.toLowerCase().trim().replace(/[^a-z0-9\-]/g, '-');
  if (!cleanTag) return null;
  const [rows] = await connection.query('SELECT id FROM tags WHERE tag_name = ?', [cleanTag]);
  if (rows.length > 0) return rows[0].id;
  const [res] = await connection.query('INSERT INTO tags (tag_name) VALUES (?)', [cleanTag]);
  return res.insertId;
}

async function run() {
  console.log('=== SIPINTAR DATA INGESTION: Modul, Hanjar, SOP, & Library ===');
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Ensure subcategories exist
    console.log('\n[1/4] Ensuring Subcategories...');
    const [subCatRows] = await connection.query('SELECT id, name FROM sub_categories');
    const existingSubCats = new Map(subCatRows.map(s => [s.name, s.id]));

    async function getOrCreateSubCat(name, categoryId, slug) {
      if (existingSubCats.has(name)) return existingSubCats.get(name);
      const [res] = await connection.query(
        'INSERT INTO sub_categories (category_id, name, slug) VALUES (?, ?, ?)',
        [categoryId, name, slug]
      );
      existingSubCats.set(name, res.insertId);
      return res.insertId;
    }

    const subCatModulCore = await getOrCreateSubCat('Modul Core Sespimma', 2, 'modul-core-sespimma');
    const subCatHanjar = await getOrCreateSubCat('Bahan Ajar Hanjar Sespimma', 2, 'bahan-ajar-hanjar-sespimma');
    const subCatSopStandar = await getOrCreateSubCat('Standar Layanan & Operasional', 5, 'standar-layanan-operasional');

    // 2. Ingest Modul & Hanjar (Category ID = 2)
    console.log('\n[2/4] Ingesting Modul & Hanjar...');
    const mhData = JSON.parse(fs.readFileSync('modul_and_hanjar_items.json', 'utf-8'));
    let mhCount = 0;

    const allMhItems = [
      ...mhData.modul.map(m => ({ ...m, sub_cat_id: subCatModulCore, sub_cat_text: 'Modul Core' })),
      ...mhData.hanjar.map(h => ({ ...h, sub_cat_id: subCatHanjar, sub_cat_text: 'Bahan Ajar Hanjar' }))
    ];

    for (const item of allMhItems) {
      const title = cleanTitle(item.name);
      const fileUrl = `modul/${item.name}`;
      const filePath = path.join('uploads', fileUrl);
      const fileSizeBytes = fs.existsSync(filePath) ? fs.statSync(filePath).size : 1024 * 1024;
      const fileFormat = getFileFormat(item.name);

      // Check if resource with same title already exists
      const [exists] = await connection.query('SELECT id FROM resources WHERE title = ?', [title]);
      let resourceId;

      if (exists.length === 0) {
        const uuid = crypto.randomUUID();
        const desc = `Dokumen kurikulum resmi ${item.sub_cat_text} Sespimma Lemdiklat Polri: ${title}. Disusun oleh Pokja Jarlat & Tenaga Pendidik untuk mendukung pengajaran kepemimpinan tingkat staf dan pimpinan pertama.`;
        const author = 'Tim Pokja Kurikulum & Gadik Sespimma Lemdiklat Polri';

        const [ins] = await connection.query(
          `INSERT INTO resources (
            uuid, title, category_id, sub_category_id, sub_category_text,
            description, author_or_instructor, unit_or_source,
            lifecycle_status, access_classification,
            has_digital_file, file_format, file_size_bytes, file_size_label, file_url,
            physical_location, created_by, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Dipublikasikan', 'Internal', 1, ?, ?, ?, ?, 'Ruang Bahan Ajar Bag Jarlat Sespimma', 1, NOW())`,
          [uuid, title, 2, item.sub_cat_id, item.sub_cat_text, desc, author, 'Sespimma Lemdiklat Polri', fileFormat, fileSizeBytes, item.size_label, fileUrl]
        );
        resourceId = ins.insertId;
        mhCount++;
      } else {
        resourceId = exists[0].id;
        // Update file_url and digital flag
        await connection.query(
          `UPDATE resources SET file_url = ?, has_digital_file = 1, file_format = ?, file_size_bytes = ?, file_size_label = ? WHERE id = ?`,
          [fileUrl, fileFormat, fileSizeBytes, item.size_label, resourceId]
        );
      }

      // Link default tags
      const tagList = ['modul-hanjar', item.sub_cat_text === 'Modul Core' ? 'modul-core' : 'hanjar', 'sespimma', 'kurikulum'];
      for (const t of tagList) {
        const tagId = await syncTag(t, connection);
        if (tagId) {
          await connection.query('INSERT IGNORE INTO resource_tags (resource_id, tag_id) VALUES (?, ?)', [resourceId, tagId]);
        }
      }
    }
    console.log(`  -> Processed ${allMhItems.length} Modul & Hanjar items (${mhCount} newly inserted).`);

    // 3. Ingest SOP (Category ID = 5)
    console.log('\n[3/4] Ingesting SOP...');
    const sopData = JSON.parse(fs.readFileSync('sop_items.json', 'utf-8'));
    let sopCount = 0;

    for (const item of sopData) {
      const title = cleanTitle(item.name);
      const fileUrl = `sop/${item.name}`;
      const filePath = path.join('uploads', fileUrl);
      const fileSizeBytes = fs.existsSync(filePath) ? fs.statSync(filePath).size : 1024 * 1024;
      const fileFormat = getFileFormat(item.name);

      const [exists] = await connection.query('SELECT id FROM resources WHERE title = ?', [title]);
      let resourceId;

      if (exists.length === 0) {
        const uuid = crypto.randomUUID();
        const desc = `Standar Operasional Prosedur dan Pedoman Mutu Layanan Sespimma Lemdiklat Polri: ${title}. Memberikan landasan operasional baku bagi seluruh pemangku kepentingan dalam ekosistem pembelajaran.`;
        const author = 'Bagian Pengajaran dan Latihan (Bag Jarlat) Sespimma Lemdiklat Polri';

        const [ins] = await connection.query(
          `INSERT INTO resources (
            uuid, title, category_id, sub_category_id, sub_category_text,
            description, author_or_instructor, unit_or_source,
            lifecycle_status, access_classification,
            has_digital_file, file_format, file_size_bytes, file_size_label, file_url,
            physical_location, created_by, published_at
          ) VALUES (?, ?, ?, ?, 'Standar Layanan & SOP', ?, ?, 'Sespimma Lemdiklat Polri', 'Dipublikasikan', 'Internal', 1, ?, ?, ?, ?, 'Sekretariat Penjamin Mutu Sespimma', 1, NOW())`,
          [uuid, title, 5, subCatSopStandar, desc, author, fileFormat, fileSizeBytes, item.size_label, fileUrl]
        );
        resourceId = ins.insertId;
        sopCount++;
      } else {
        resourceId = exists[0].id;
        await connection.query(
          `UPDATE resources SET file_url = ?, has_digital_file = 1, file_format = ?, file_size_bytes = ?, file_size_label = ? WHERE id = ?`,
          [fileUrl, fileFormat, fileSizeBytes, item.size_label, resourceId]
        );
      }

      const tagList = ['sop', 'standar-layanan', 'sespimma', 'operasional'];
      for (const t of tagList) {
        const tagId = await syncTag(t, connection);
        if (tagId) {
          await connection.query('INSERT IGNORE INTO resource_tags (resource_id, tag_id) VALUES (?, ?)', [resourceId, tagId]);
        }
      }
    }
    console.log(`  -> Processed ${sopData.length} SOP items (${sopCount} newly inserted).`);

    // 4. Ingest Library Data
    console.log('\n[4/4] Ingesting Library Items...');
    // A. 50 Official Inventory Catalogs
    const libCatalogs = JSON.parse(fs.readFileSync('library_inventory_items.json', 'utf-8'));
    let catalogCount = 0;

    for (const cat of libCatalogs) {
      const catCleanName = cat.name.replace('.pdf', '').replace(/^\d{2}_/, '').replace(/_/g, ' ');
      const catalogTitle = `Buku Inventarisasi Perpustakaan Sespimma: Bidang ${catCleanName}`;
      const fileUrl = `library/${cat.name}`;
      const filePath = path.join('uploads', fileUrl);
      const fileSizeBytes = fs.existsSync(filePath) ? fs.statSync(filePath).size : 500 * 1024;

      const [exists] = await connection.query('SELECT id FROM books WHERE title = ?', [catalogTitle]);
      let bookId;

      if (exists.length === 0) {
        const uuid = crypto.randomUUID();
        const callNumber = `INV-${cat.name.substring(0, 2)}-${catCleanName.substring(0, 3).toUpperCase()}/2026`;
        const synopsis = `Daftar inventarisasi resmi perbendaharaan buku referensi bidang ${catCleanName} di Perpustakaan Sespimma Lemdiklat Polri. Memuat seluruh judul buku cetak, penerbit, dan tahun terbit perbendaharaan institusi.`;

        const [ins] = await connection.query(
          `INSERT INTO books (
            uuid, isbn, title, author, publisher, published_year, synopsis,
            library_category_id, sub_category, language, call_number, physical_location,
            stock_total, stock_available, cover_color, cover_gradient,
            lifecycle_status, access_classification, created_by
          ) VALUES (?, ?, ?, ?, ?, 2026, ?, 'buku-fisik', ?, 'Indonesia', ?, 'Gedung Perpustakaan Sespimma, Lemari Inventaris Utama', 1, 1, '#1e3a8a', 'from-blue-900 to-indigo-950', 'Dipublikasikan', 'Internal', 3)`,
          [uuid, `INV-${cat.name.substring(0, 2)}-2026`, catalogTitle, 'Unit Perpustakaan Subbag Renmin Sespimma', 'Sespimma Sespim Lemdiklat Polri', synopsis, catCleanName, callNumber]
        );
        bookId = ins.insertId;
        catalogCount++;

        // Add file record
        await connection.query(
          `INSERT INTO book_files (
            book_id, file_path, preview_file_path, file_format, file_size_label, total_pages, preview_pages
          ) VALUES (?, ?, ?, 'PDF', ?, 20, 10)`,
          [bookId, fileUrl, fileUrl, cat.size_label]
        );
      } else {
        bookId = exists[0].id;
        await connection.query(
          `INSERT INTO book_files (book_id, file_path, preview_file_path, file_format, file_size_label)
           VALUES (?, ?, ?, 'PDF', ?)
           ON DUPLICATE KEY UPDATE file_path = VALUES(file_path), preview_file_path = VALUES(preview_file_path), file_size_label = VALUES(file_size_label)`,
          [bookId, fileUrl, fileUrl, cat.size_label]
        );
      }
    }
    console.log(`  -> Processed ${libCatalogs.length} Library Inventory Catalogs (${catalogCount} newly inserted).`);

    // B. Ingest the 1,895 individual physical books
    console.log('\n  Ingesting 1,895 Individual Physical Books into Library Catalog...');
    const individualBooks = JSON.parse(fs.readFileSync('cleaned_library_books.json', 'utf-8'));
    let bookCount = 0;

    // Batch insert in chunks of 100
    const chunkSize = 100;
    for (let i = 0; i < individualBooks.length; i += chunkSize) {
      const chunk = individualBooks.slice(i, i + chunkSize);
      for (const b of chunk) {
        const [exists] = await connection.query('SELECT id FROM books WHERE title = ? AND sub_category = ?', [b.title, b.category]);
        if (exists.length === 0) {
          const uuid = crypto.randomUUID();
          const callNumber = `SES-${b.category.substring(0, 3).toUpperCase()}-${String(b.no).padStart(3, '0')}`;
          const synopsis = `Buku referensi cetak bidang ${b.category}: ${b.title}. Diterbitkan oleh ${b.publisher} pada tahun ${b.year}. Tersedia sebagai perbendaharaan fisik di rak koleksi Perpustakaan Sespimma.`;

          await connection.query(
            `INSERT INTO books (
              uuid, isbn, title, author, publisher, published_year, synopsis,
              library_category_id, sub_category, language, call_number, physical_location,
              stock_total, stock_available, cover_color, cover_gradient,
              lifecycle_status, access_classification, created_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'buku-fisik', ?, 'Indonesia', ?, ?, 1, 1, '#0f172a', 'from-slate-900 to-blue-950', 'Dipublikasikan', 'Internal', 3)`,
            [
              uuid,
              `ISBN-${b.year}-${String(b.no).padStart(4, '0')}`,
              b.title,
              b.author,
              b.publisher,
              b.year,
              synopsis,
              b.category,
              callNumber,
              `Gedung Perpustakaan Sespimma, Rak ${b.category}`
            ]
          );
          bookCount++;
        }
      }
      process.stdout.write(`    ... processed ${Math.min(i + chunkSize, individualBooks.length)} / ${individualBooks.length} books\r`);
    }
    console.log(`\n  -> Finished: ${bookCount} individual physical books inserted.`);

    await connection.commit();
    console.log('\n=== ALL DATA INGESTION COMPLETED AND COMMITTED SUCCESSFULLY! ===');
  } catch (err) {
    await connection.rollback();
    console.error('\n[Ingestion Error - Transaction Rolled Back]', err);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
}

run();
