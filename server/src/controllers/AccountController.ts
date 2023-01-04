import { NextFunction, Request, Response } from 'express';
import { accountRepository } from '../repositories/accountRepository';

export class AccountController {
  async create(req: Request, res: Response, next: NextFunction) {
    const newAccount = req.account;
    await accountRepository.save(newAccount);
    return res.status(201).json(newAccount);
  }
}
