import { NextFunction, Request, Response } from 'express';
import { accountRepository } from '../repositories/accountRepository';
import { transactionRepository } from '../repositories/transactionRepository';
import { userRepository } from '../repositories/userRepository';
import { BadRequestError, NotFoundError } from '../utils/appError';

const dateFormatting = (date: string) => {
  const [dayStr, monthStr, yearStr] = date.split('-');
  const day = Number(dayStr);
  const month = Number(monthStr) - 1;
  const year = Number(yearStr);
  return new Date(year, month, day);
};

export class TransactionController {
  async cashOut(req: Request, res: Response, next: NextFunction) {
    const cashOutUser = req.user;
    const { username, value } = req.body;

    const cashInUser = await userRepository.findOne({
      where: { username },
      relations: { account: true },
    });

    if (!cashInUser) {
      return next(new NotFoundError('Nome de usuário não encontrado'));
    }
    const cashInAccount = await accountRepository.findOne({
      where: { id: cashInUser?.account.id },
      select: { balance: true, id: true },
    });

    const cashOutAccount = await accountRepository.findOne({
      where: { id: cashOutUser.account.id },
      relations: { user: true },
      select: { balance: true, id: true },
    });

    if (!cashOutAccount) {
      return next(new NotFoundError('Cash-out user account not found'));
    }

    if (!cashInAccount) {
      return next(new NotFoundError('Cash-in ser account not found'));
    }

    if (
      cashInUser?.id === cashOutUser.id ||
      cashInAccount.id === cashOutAccount.id
    ) {
      return next(
        new BadRequestError(
          'Não é permitido realizar transaçōes entre o mesmo usuário'
        )
      );
    }

    if (Number(cashOutAccount.balance) < value) {
      return next(new BadRequestError('Saldo insuficiente'));
    }

    cashInAccount.balance = Number(cashInAccount.balance) + value;
    await accountRepository.save(cashInAccount);

    cashOutAccount.balance = Number(cashOutAccount.balance) - value;
    await accountRepository.save(cashOutAccount);

    const newTransaction = transactionRepository.create({ value });
    newTransaction.debitedAccount = cashOutAccount;
    newTransaction.creditedAccount = cashInAccount;
    const transaction = await transactionRepository.save(newTransaction);

    res.status(200).json({
      status: 'Success',
      data: {
        transaction: {
          id: transaction.id,
          date: transaction.createdAt,
          value: transaction.value,
          debitedAccount: {
            usernane: cashOutUser.username,
            accountId: cashOutAccount.id,
          },
          creditedAccount: {
            username: cashInUser.username,
            accountId: cashInAccount.id,
          },
        },
      },
    });
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    const transactions = await transactionRepository.find({
      where: [
        { debitedAccount: user.account },
        { creditedAccount: user.account },
      ],
      relations: {
        creditedAccount: { user: true },
        debitedAccount: { user: true },
      },
      order: { createdAt: 'desc' },
    });
    res.status(200).json({
      status: 'success',
      data: {
        user,
        transactions,
      },
    });
  }

  async getByDate(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    const { date } = req.params;

    const filterDate = dateFormatting(date);

    const transactions = await transactionRepository.find({
      where: [
        { debitedAccount: user.account, createdAt: filterDate },
        { creditedAccount: user.account, createdAt: filterDate },
      ],
      relations: {
        creditedAccount: { user: true },
        debitedAccount: { user: true },
      },
    });

    if (transactions.length === 0) {
      return next(new NotFoundError('Não foram feitas transações nesta data'));
    }

    const results = transactions.length;

    res.status(200).json({
      status: 'success',
      results,
      data: {
        user,
        transactions,
      },
    });
  }

  async getByCashOut(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    const debitedTransactions = await transactionRepository.find({
      where: { debitedAccount: user.account },
      relations: {
        creditedAccount: { user: true },
        debitedAccount: { user: true },
      },
      order: { createdAt: 'desc' },
    });

    if (debitedTransactions.length === 0) {
      return next(new NotFoundError('Não existem transações de débito'));
    }

    res.status(200).json({
      status: 'success',
      results: debitedTransactions.length,
      data: {
        user,
        transactions: debitedTransactions,
      },
    });
  }

  async getByCashIn(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    const creditedTransactions = await transactionRepository.find({
      where: { creditedAccount: user.account },
      relations: {
        debitedAccount: { user: true },
        creditedAccount: { user: true },
      },
      order: { createdAt: 'desc' },
    });

    if (creditedTransactions.length === 0) {
      return next(new NotFoundError('Não existem transações recebidas'));
    }

    res.status(200).json({
      status: 'success',
      results: creditedTransactions.length,
      data: {
        user,
        transactions: creditedTransactions,
      },
    });
  }

  async getByCashInDated(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    const { date } = req.params;

    const filterDate = dateFormatting(date);

    const creditedTransactions = await transactionRepository.find({
      where: { creditedAccount: user.account, createdAt: filterDate },
      relations: {
        debitedAccount: { user: true },
        creditedAccount: { user: true },
      },
    });

    if (creditedTransactions.length === 0) {
      return next(
        new NotFoundError('Não existem transações recebidas nesta data')
      );
    }

    res.status(200).json({
      status: 'success',
      results: creditedTransactions.length,
      data: {
        user,
        transactions: creditedTransactions,
      },
    });
  }

  async getByCashOutDated(req: Request, res: Response, next: NextFunction) {
    const user = req.user;
    const { date } = req.params;

    const filterDate = dateFormatting(date);

    const debidetedTransactions = await transactionRepository.find({
      where: { createdAt: filterDate, debitedAccount: user.account },
      relations: {
        creditedAccount: { user: true },
        debitedAccount: { user: true },
      },
    });

    if (debidetedTransactions.length === 0) {
      return next(new NotFoundError('Não existem transações debitadas'));
    }

    res.status(200).json({
      status: 'success',
      results: debidetedTransactions.length,
      data: {
        user,
        transactions: debidetedTransactions,
      },
    });
  }
}
