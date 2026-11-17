import * as libraryService from '../services/libraryService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export async function listLibraryCategories(req, res, next) {
  try {
    const categories = await libraryService.getLibraryCategories();
    return sendSuccess(res, 'Daftar kategori perpustakaan berhasil diambil', categories);
  } catch (error) {
    next(error);
  }
}

export async function listBooks(req, res, next) {
  try {
    const { items, pagination } = await libraryService.getBooks(req.query);
    return sendSuccess(res, 'Katalog buku perpustakaan berhasil diambil', items, pagination);
  } catch (error) {
    next(error);
  }
}

export async function getBookDetail(req, res, next) {
  try {
    const { id } = req.params;
    const book = await libraryService.getBookDetail(id);
    return sendSuccess(res, 'Detail buku berhasil diambil', book);
  } catch (error) {
    next(error);
  }
}

