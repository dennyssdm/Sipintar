import express from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', categoryController.listCategories);
router.get('/:id/subcategories', categoryController.listSubcategories);

export default router;

