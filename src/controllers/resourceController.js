import * as resourceService from '../services/resourceService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export async function listResources(req, res, next) {
  try {
    const { items, pagination } = await resourceService.getResources(req.query, req.user);
    return sendSuccess(res, 'Daftar sumber belajar berhasil diambil', items, pagination);
  } catch (error) {
    next(error);
  }
}

export async function getResourceDetail(req, res, next) {
  try {
    const { id } = req.params;
    const resource = await resourceService.getResourceById(id, req.user);
    return sendSuccess(res, 'Detail sumber belajar berhasil diambil', resource);
  } catch (error) {
    next(error);
  }
}

