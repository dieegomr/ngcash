import { Account } from './account';
export type Transaction = {
  id: string;
  value: number;
  createdAt: string;
  debitedAccount: Account;
  creditedAccount: Account;
};
