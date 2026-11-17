import express from 'express';
import * as gadikController from '../controllers/gadikController.js';

const router = express.Router();

router.get('/', gadikController.listGadik);
router.get('/:id', gadikController.getGadikDetail);

export default router;

