import express from 'express';
import { AccountController } from '../controllers/AccountController';
import { UserController } from '../controllers/UserController';
import {
  loginMiddleware,
  protectMiddleware,
  signupMiddleware,
} from '../middlewares/authMiddleware';
import transactionRoutes from './transactionRoutes';

const router = express.Router();

router.post(
  '/signup',
  new UserController().create,
  signupMiddleware,
  new AccountController().create
);

router.post('/login', loginMiddleware);

router.use(protectMiddleware);

router.get('/balance', new UserController().getBalance);

router.use('/transactions', transactionRoutes);

export default router;
