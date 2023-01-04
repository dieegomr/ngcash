import express from 'express';
import { TransactionController } from '../controllers/TransactionController';

const router = express.Router();

router.get('/getAll', new TransactionController().getAll);
router.get('/cashOut/', new TransactionController().getByCashOut);
router.get('/cashIn/', new TransactionController().getByCashIn);
router.get('/getAll/:date', new TransactionController().getByDate);
router.get('/cashOut/:date', new TransactionController().getByCashOutDated);
router.get('/cashIn/:date', new TransactionController().getByCashInDated);

router.post('/cashout', new TransactionController().cashOut);

export default router;
