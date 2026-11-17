import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sipintar_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Test database connection
 * @returns {Promise<{ ok: boolean, message: string, database?: string, timestamp?: string }>}
 */
export async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT DATABASE() AS current_db, NOW() AS db_time');
    return {
      ok: true,
      message: 'Database connection established successfully',
      database: rows[0].current_db,
      timestamp: rows[0].db_time
    };
  } catch (error) {
    return {
      ok: false,
      message: error.message
    };
  }
}

export default pool;

