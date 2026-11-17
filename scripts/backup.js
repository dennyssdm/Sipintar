/**
 * SIPINTAR Sespimma — Automated Database Backup Script
 * Creates timestamped SQL dumps of sipintar_db
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.resolve(__dirname, '../backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbName = process.env.DB_NAME || 'sipintar_db';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || '3306';

// Format timestamp: YYYYMMDD_HHMMSS
const now = new Date();
const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
const outputFile = path.join(BACKUP_DIR, `${dbName}_backup_${timestamp}.sql`);

// Detect mysqldump binary
const possibleBins = [
  '/Applications/XAMPP/xamppfiles/bin/mysqldump',
  '/usr/local/mysql/bin/mysqldump',
  '/opt/homebrew/bin/mysqldump',
  'mysqldump'
];

let mysqldumpBin = 'mysqldump';
for (const b of possibleBins) {
  if (b.startsWith('/') && fs.existsSync(b)) {
    mysqldumpBin = b;
    break;
  }
}

const passArg = dbPass ? `-p"${dbPass}"` : '';
const cmd = `"${mysqldumpBin}" -h ${dbHost} -P ${dbPort} -u ${dbUser} ${passArg} --default-character-set=utf8mb4 --skip-routines ${dbName} > "${outputFile}"`;

console.log(`\n============================================================`);
console.log(`  SIPINTAR Sespimma — Database Backup Utility`);
console.log(`  Target Database: ${dbName} on ${dbHost}:${dbPort}`);
console.log(`============================================================\n`);
console.log(`Menjalankan pencadangan basis data...`);

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Gagal melakukan pencadangan:`, error.message);
    process.exit(1);
  }

  if (fs.existsSync(outputFile)) {
    const stats = fs.statSync(outputFile);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`\x1b[32m[SUKSES]\x1b[0m Salinan basis data berhasil dibuat!`);
    console.log(`  Berkas : ${outputFile}`);
    console.log(`  Ukuran : ${sizeKB} KB (${stats.size} bytes)`);
    console.log(`  Waktu  : ${now.toLocaleString('id-ID')}\n`);
    process.exit(0);
  } else {
    console.error(`\x1b[31m[ERROR]\x1b[0m Berkas salinan tidak ditemukan di disk.`);
    process.exit(1);
  }
});
