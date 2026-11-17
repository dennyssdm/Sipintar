import pool from '../config/db.js';

/**
 * Log an audit activity to `activity_logs` table
 * @param {object} params
 * @param {number|null} params.userId
 * @param {string|null} params.userName
 * @param {string|null} params.role
 * @param {string} params.actionType - e.g. LOGIN, LOGOUT, REGISTER, CREATE, UPDATE, DELETE, VERIFY, ARCHIVE
 * @param {string} params.entityType - e.g. users, resources, books, verification
 * @param {string|number|null} params.entityId
 * @param {string|null} [params.satkerSindikat]
 * @param {string} params.description
 * @param {string|null} [params.ipAddress]
 * @param {string|null} [params.userAgent]
 */
export async function logActivity({
  userId = null,
  userName = null,
  role = null,
  actionType,
  entityType,
  entityId = null,
  satkerSindikat = null,
  description,
  ipAddress = null,
  userAgent = null
}) {
  try {
    const query = `
      INSERT INTO activity_logs (
        user_id,
        user_name_snapshot,
        role_snapshot,
        action_type,
        entity_type,
        entity_id,
        satker_sindikat,
        description,
        ip_address,
        user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      userId,
      userName,
      role,
      actionType,
      entityType,
      entityId ? String(entityId) : null,
      satkerSindikat,
      description,
      ipAddress ? String(ipAddress).substring(0, 45) : null,
      userAgent ? String(userAgent).substring(0, 255) : null
    ]);
  } catch (error) {
    // Non-blocking error for logging to avoid breaking primary user request
    console.error('[ActivityLog Error]', error.message);
  }
}

