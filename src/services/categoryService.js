import pool from '../config/db.js';

/**
 * Get all active categories with published resource count
 */
export async function getAllCategories() {
  const query = `
    SELECT c.id, c.name, c.slug, c.description, c.icon_name, c.display_order, c.is_active,
           COUNT(r.id) AS published_resource_count
    FROM categories c
    LEFT JOIN resources r ON c.id = r.category_id AND r.lifecycle_status = 'Dipublikasikan'
    WHERE c.is_active = 1
    GROUP BY c.id
    ORDER BY c.display_order ASC
  `;

  const [categories] = await pool.query(query);
  return categories;
}

/**
 * Get subcategories belonging to a category (by ID or Slug)
 * @param {string|number} identifier - Category ID or Category Slug
 */
export async function getSubcategoriesByCategory(identifier) {
  let categoryCondition = 'c.id = ?';
  let categoryParam = identifier;

  if (isNaN(identifier)) {
    categoryCondition = 'c.slug = ?';
  }

  const query = `
    SELECT sc.id, sc.category_id, c.name AS category_name, c.slug AS category_slug,
           sc.name AS sub_category_name, sc.slug AS sub_category_slug
    FROM sub_categories sc
    JOIN categories c ON sc.category_id = c.id
    WHERE ${categoryCondition}
    ORDER BY sc.id ASC
  `;

  const [subcategories] = await pool.query(query, [categoryParam]);
  return subcategories;
}

