import express from 'express';
import * as libraryController from '../controllers/libraryController.js';
import * as fileController from '../controllers/fileController.js';

const router = express.Router();

router.get('/categories', libraryController.listLibraryCategories);
router.get('/books', libraryController.listBooks);
router.get('/books/:id', libraryController.getBookDetail);
router.get('/books/:id/preview', fileController.serveBookPreview);

export default router;

