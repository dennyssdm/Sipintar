/**
 * SIPINTAR Sespimma — Automated Database Restore Script
 * Restores SQL dumps into sipintar_db from the backups/ directory
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

const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || '';
const dbName = process.env.DB_NAME || 'sipintar_db';
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || '3306';

// Determine which backup file to restore
let targetFile = process.argv[2];

if (!targetFile) {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.error('\x1b[31m[ERROR]\x1b[0m Direktori cadangan backups/ tidak ditemukan.');
    process.exit(1);
  }

  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('\x1b[31m[ERROR]\x1b[0m Tidak ada berkas cadangan .sql di direktori backups/. Jalankan "npm run db:backup" terlebih dahulu.');
    process.exit(1);
  }

  targetFile = path.join(BACKUP_DIR, files[0]);
} else if (!path.isAbsolute(targetFile)) {
  targetFile = path.resolve(process.cwd(), targetFile);
}

if (!fs.existsSync(targetFile)) {
  console.error(`\x1b[31m[ERROR]\x1b[0m Berkas cadangan tidak ditemukan: ${targetFile}`);
  process.exit(1);
}

// Detect mysql client binary
const possibleBins = [
  '/Applications/XAMPP/xamppfiles/bin/mysql',
  '/usr/local/mysql/bin/mysql',
  '/opt/homebrew/bin/mysql',
  'mysql'
];

let mysqlBin = 'mysql';
for (const b of possibleBins) {
  if (b.startsWith('/') && fs.existsSync(b)) {
    mysqlBin = b;
    break;
  }
}

const passArg = dbPass ? `-p"${dbPass}"` : '';
const cmd = `"${mysqlBin}" -h ${dbHost} -P ${dbPort} -u ${dbUser} ${passArg} --default-character-set=utf8mb4 ${dbName} < "${targetFile}"`;

console.log(`\n============================================================`);
console.log(`  SIPINTAR Sespimma — Database Restore Utility`);
console.log(`  Target Database: ${dbName} on ${dbHost}:${dbPort}`);
console.log(`============================================================\n`);
console.log(`Memulihkan basis data dari cadangan...`);
console.log(`  Berkas : ${targetFile}`);

exec(cmd, (error) => {
  if (error) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Gagal memulihkan basis data:`, error.message);
    process.exit(1);
  }

  console.log(`\x1b[32m[SUKSES]\x1b[0m Basis data ${dbName} berhasil dipulihkan secara utuh!`);
  console.log(`  Waktu  : ${new Date().toLocaleString('id-ID')}\n`);
  process.exit(0);
});
