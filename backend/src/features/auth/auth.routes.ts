import express from 'express';
import { authenticateToken } from './auth.middleware';
import * as authController from './auth.controller';

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/me', authenticateToken, authController.getCurrentUser);

export default router;
