import express from 'express';
import * as searchController from '../controllers/searchController.js';
import { optionalAuthenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuthenticateToken, searchController.unifiedSearch);

export default router;

