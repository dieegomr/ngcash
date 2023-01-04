import { Transaction } from '../../models/transaction';
import style from './TransactionItem.module.css';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';

type Props = {
  transaction: Transaction;
  user: string;
};

const TransactionItem = ({ transaction, user }: Props) => {
  let transactionType;
  let externalUser;

  if (transaction.creditedAccount.user.username === user) {
    externalUser = transaction.debitedAccount.user.username;
    transactionType = 'Valor Recebido';
  } else {
    externalUser = transaction.creditedAccount.user.username;
    transactionType = 'Valor Debitado';
  }

  const [year, month, day] = transaction.createdAt.split('-');
  const formatedDateJs = new Date(`${month}/${day}/${year}`);

  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  const formatedDate =
    formatedDateJs.getDate() +
    ' ' +
    months[formatedDateJs.getMonth()] +
    ' ' +
    formatedDateJs.getFullYear();

  return (
    <div className={style.transactionItem_container}>
      <RiMoneyDollarCircleFill size={30} />
      <div className={style.transactionItem_type}>
        <p>{transactionType}</p>
        <div>{externalUser}</div>
      </div>
      <div className={style.transactionItem_value}>
        <div>{formatedDate}</div>
        <p>R$ {transaction.value.toString().replace(/\./g, ',')}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
