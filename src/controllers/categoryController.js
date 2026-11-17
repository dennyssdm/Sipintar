import * as categoryService from '../services/categoryService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export async function listCategories(req, res, next) {
  try {
    const categories = await categoryService.getAllCategories();
    return sendSuccess(res, 'Daftar kategori berhasil diambil', categories);
  } catch (error) {
    next(error);
  }
}

export async function listSubcategories(req, res, next) {
  try {
    const { id } = req.params;
    const subcategories = await categoryService.getSubcategoriesByCategory(id);
    return sendSuccess(res, 'Daftar subkategori berhasil diambil', subcategories);
  } catch (error) {
    next(error);
  }
}

