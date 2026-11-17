import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pool from '../src/config/db.js';

async function run() {
  console.log('=== SIPINTAR INGESTION: Kertas Karya Perorangan (Taskap) ===');
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Ingest 12 Master Compilation Books (Angkatan 65 to 76)
    console.log('\n[1/2] Ingesting 12 Master Taskap Compilations...');
    const docxFiles = fs.readdirSync('uploads/taskap').filter(f => f.endsWith('.docx'));
    let compCount = 0;

    for (const file of docxFiles) {
      const match = file.match(/ANGKATAN\s+(\d+)/i);
      const ang = match ? match[1] : 'Sespimma';
      const title = `Buku Registrasi Judul Taskap Peserta Didik Sespimma Lemdiklat Polri Angkatan ${ang}`;
      const filePath = path.join('uploads/taskap', file);
      const fileSizeBytes = fs.statSync(filePath).size;
      const fileSizeLabel = `${Math.round(fileSizeBytes / 1024)} KB`;

      const [exists] = await connection.query('SELECT id FROM books WHERE title = ?', [title]);
      let bookId;

      if (exists.length === 0) {
        const uuid = crypto.randomUUID();
        const callNumber = `REG-TSK-ANG-${ang}`;
        const synopsis = `Daftar registrasi dan inventarisasi komprehensif naskah Kertas Karya Perorangan (Taskap) Peserta Didik Sespimma Sespim Lemdiklat Polri Angkatan ${ang}. Memuat identitas lengkap Serdik, judul penelitian, dan bidang kajian strategis kamtibmas.`;

        const [ins] = await connection.query(
          `INSERT INTO books (
            uuid, isbn, title, author, publisher, published_year, synopsis,
            library_category_id, sub_category, language, call_number, physical_location,
            stock_total, stock_available, cover_color, cover_gradient,
            lifecycle_status, access_classification, created_by
          ) VALUES (?, ?, ?, 'Bagian Pengajaran dan Latihan (Bag Jarlat) Sespimma', 'Sespimma Sespim Lemdiklat Polri', 2026, ?, 'taskap', 'Registrasi Judul Taskap', 'Indonesia', ?, 'Ruang Arsip Taskap Bag Jarlat Sespimma', 1, 1, '#1e1b4b', 'from-indigo-950 to-slate-900', 'Dipublikasikan', 'Internal', 3)`,
          [uuid, `REG-TSK-${ang}`, title, synopsis, callNumber]
        );
        bookId = ins.insertId;
        compCount++;

        await connection.query(
          `INSERT INTO book_files (
            book_id, file_path, preview_file_path, file_format, file_size_label, total_pages, preview_pages
          ) VALUES (?, ?, ?, 'PDF', ?, 25, 10)`,
          [bookId, `taskap/${file}`, `taskap/${file}`, fileSizeLabel]
        );
      }
    }
    console.log(`  -> Processed ${docxFiles.length} Master Taskap Compilations (${compCount} newly inserted).`);

    // 2. Ingest 1,204 Individual Student Taskaps (Metadata Saja)
    console.log('\n[2/2] Ingesting 1,204 Individual Taskap Theses into Library (Metadata Saja)...');
    const theses = JSON.parse(fs.readFileSync('extracted_taskap_theses.json', 'utf-8'));
    let thesisCount = 0;

    const chunkSize = 100;
    for (let i = 0; i < theses.length; i += chunkSize) {
      const chunk = theses.slice(i, i + chunkSize);
      for (const t of chunk) {
        const [exists] = await connection.query(
          'SELECT id FROM books WHERE title = ? AND author = ? AND library_category_id = "taskap"',
          [t.title, t.author]
        );

        if (exists.length === 0) {
          const uuid = crypto.randomUUID();
          const callNumber = `TSK-${t.angkatan}-${String(t.no).padStart(3, '0')}`;
          const synopsis = `Kertas Karya Perorangan (Taskap) Peserta Didik Sespimma Sespim Lemdiklat Polri Angkatan ${t.angkatan}: "${t.title}". Disusun oleh ${t.author}. Naskah tersimpan sebagai deposit perbendaharaan akademik perpustakaan Sespimma Lemdiklat Polri.`;

          await connection.query(
            `INSERT INTO books (
              uuid, isbn, title, author, publisher, published_year, synopsis,
              library_category_id, sub_category, language, call_number, physical_location,
              stock_total, stock_available, cover_color, cover_gradient,
              lifecycle_status, access_classification, created_by
            ) VALUES (?, ?, ?, ?, 'Sespimma Sespim Lemdiklat Polri', ?, ?, 'taskap', 'Kertas Karya Perorangan (Taskap)', 'Indonesia', ?, ?, 1, 1, '#1e293b', 'from-slate-900 to-amber-950', 'Dipublikasikan', 'Metadata Saja', 3)`,
            [
              uuid,
              `TSK-${t.angkatan}-${String(t.no).padStart(4, '0')}`,
              t.title,
              t.author,
              t.year,
              synopsis,
              callNumber,
              `Gedung Perpustakaan Sespimma, Ruang Deposit Taskap Rak Angkatan ${t.angkatan}`
            ]
          );
          thesisCount++;
        }
      }
      process.stdout.write(`    ... processed ${Math.min(i + chunkSize, theses.length)} / ${theses.length} theses\r`);
    }

    console.log(`\n  -> Finished: ${thesisCount} Taskap theses successfully inserted.`);

    await connection.commit();
    console.log('\n=== TASKAP INGESTION COMMITTED SUCCESSFULLY! ===');
  } catch (err) {
    await connection.rollback();
    console.error('\n[Taskap Ingestion Error]', err);
    process.exit(1);
  } finally {
    connection.release();
    process.exit(0);
  }
}

run();
