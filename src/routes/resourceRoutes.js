import express from 'express';
import * as resourceController from '../controllers/resourceController.js';
import * as fileController from '../controllers/fileController.js';
import { optionalAuthenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthenticateToken, resourceController.listResources);
router.get('/:id', optionalAuthenticateToken, resourceController.getResourceDetail);
router.get('/:id/related', optionalAuthenticateToken, resourceController.getRelatedResources);
router.get('/:id/file', optionalAuthenticateToken, fileController.serveResourceFile);

export default router;

