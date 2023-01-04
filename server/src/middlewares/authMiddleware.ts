import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { AppError, UnauthorizedError } from '../utils/appError';
import bcrypt from 'bcrypt';
import { accountRepository } from '../repositories/accountRepository';

type JwtPayload = {
  id: string;
};

export const protectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new UnauthorizedError(
        'Você precisa fazer Login para acessar essas informações'
      )
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload;

  const currentUser = await userRepository.findOne({
    where: { id: decoded.id },
    relations: { account: true },
  });

  if (!currentUser) {
    return next(new UnauthorizedError('O usuário não existe'));
  }

  req.user = currentUser;

  next();
};

export const signupMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signupUser = req.user;
  const newAccount = accountRepository.create({});
  newAccount.user = signupUser;
  req.account = newAccount;
  next();
};

export const loginMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Preencha email e senha', 400));
  }

  const possibleUser = await userRepository.findOne({
    where: { username },
    select: { password: true, id: true },
  });

  if (!possibleUser) {
    return next(new AppError('Email ou senha incorreto', 400));
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    possibleUser?.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError('Email ou senha incorreto', 400));
  }

  const token = jwt.sign({ id: possibleUser.id }, process.env.JWT_PASS ?? '', {
    expiresIn: '24h',
  });

  const user = await userRepository.findOneBy({ username });

  return res.status(200).json({
    user,
    token: token,
  });
};
