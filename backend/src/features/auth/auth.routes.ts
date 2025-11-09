import express from 'express';
import { authenticateToken } from './auth.middleware';
import AuthController from './auth.controller';

const router = express.Router();

router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);

router.get('/user', authenticateToken, AuthController.getCurrentUser);

export default router;
