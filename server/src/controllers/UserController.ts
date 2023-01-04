import { NextFunction, Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { AppError, BadRequestError, NotFoundError } from '../utils/appError';
import bcrypt from 'bcrypt';
import { accountRepository } from '../repositories/accountRepository';

const isPasswordValid = (password: string) => {
  const validPasswordRegex = /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z]).*$/g;
  return password.match(validPasswordRegex);
};

const isUsernameValid = (username: string) => {
  const validUsernameRegex = /^.{3,}$/;
  return username.match(validUsernameRegex);
};

export class UserController {
  async create(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(
        new BadRequestError('Preencha um nome de usuário e uma senha')
      );
    }

    if (!isUsernameValid(username)) {
      return next(
        new BadRequestError(
          'O nome de usuário precisa ter pelo menos três caracteres'
        )
      );
    }

    if (!isPasswordValid(password)) {
      return next(
        new BadRequestError(
          'A senha precisa ter pelo menos 8 caracteres, pelo menos uma letra e pelo menos um número'
        )
      );
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = userRepository.create({
      username,
      password: hashPassword,
    });

    const user = await userRepository.findOneBy({ username });

    if (user) {
      return next(new AppError('Nome de usuário já existe', 400));
    }

    await userRepository.save(newUser);

    const createdUser = await userRepository.findOneBy({ id: newUser.id });

    if (!createdUser) {
      return next(new AppError('Não foi possível criar um novo usuário', 400));
    }

    req.user = createdUser;
    next();
  }

  async getBalance(req: Request, res: Response, next: NextFunction) {
    const userAccount = await accountRepository.findOne({
      where: { id: req.user.account.id },
      select: { balance: true, id: true },
    });

    if (!userAccount) {
      return next(new NotFoundError('Conta do usuário não foi encontrada'));
    }

    return res.json({ status: 'success', data: { userAccount } });
  }
}
