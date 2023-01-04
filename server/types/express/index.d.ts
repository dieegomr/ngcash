import { Account } from '../../src/entities/Account';
import { User } from '../../src/entities/User';

export {};

declare global {
  namespace Express {
    export interface Request {
      account: Account;
      user: User;
    }
  }
}
