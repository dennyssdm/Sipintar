import * as gadikService from '../services/gadikService.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export async function listGadik(req, res, next) {
  try {
    const { items, pagination } = await gadikService.getGadikList(req.query);
    return sendSuccess(res, 'Daftar tenaga pendidik (Gadik) berhasil diambil', items, pagination);
  } catch (error) {
    next(error);
  }
}

export async function getGadikDetail(req, res, next) {
  try {
    const { id } = req.params;
    const gadik = await gadikService.getGadikDetail(id);
    return sendSuccess(res, 'Detail tenaga pendidik berhasil diambil', gadik);
  } catch (error) {
    next(error);
  }
}

