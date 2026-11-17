import * as searchService from '../services/searchService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export async function unifiedSearch(req, res, next) {
  try {
    const { items, pagination } = await searchService.unifiedSearch(req.query, req.user);
    return sendSuccess(res, 'Pencarian terpadu berhasil dilakukan', items, pagination);
  } catch (error) {
    next(error);
  }
}

