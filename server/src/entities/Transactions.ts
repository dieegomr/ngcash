import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';

@Entity('Transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @CreateDateColumn({ type: 'date' })
  createdAt: Date;

  @ManyToOne(() => Account, (account) => account.debitedTransactions)
  debitedAccount: Account;

  @ManyToOne(() => Account, (account) => account.creditedTransactions)
  creditedAccount: Account;
}
