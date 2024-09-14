import express from 'express'
import AuthController from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/verifyToken.js';

const authRouter = express.Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.get('/logout', authMiddleware, AuthController.logout);

export default authRouter;