import React, { useContext, useEffect, useState } from 'react';
import { Transaction } from '../../models/transaction';
import AuthContext from '../../store/auth-context';
import TransactionItem from './TransactionItem';
import styles from './Transactions.module.css';
import { MdFilterListAlt } from 'react-icons/md';
import { RxUpdate } from 'react-icons/rx';
import Modal from '../modals/Modal';
import useModal from '../../hooks/useModal';
import TransactionsFilter from './TransactionsFilter';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loggedUser, setLoggedUser] = useState<string>('');
  const { toggle, isOpen } = useModal();

  const { token } = useContext(AuthContext);

  const getAllTransactions = () => {
    fetch('http://localhost:4000/api/v1/user/transactions/getAll', {
      method: 'GET',
      headers: {
        'Conten-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setTransactions(data.data.transactions);
        setLoggedUser(data.data.user.username);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllTransactions();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>histórico de transações:</h2>
        <div className={styles.menu}>
          <button onClick={getAllTransactions} className={styles.clickBtn}>
            <RxUpdate />
          </button>
          <button onClick={toggle} className={styles.clickBtn}>
            <MdFilterListAlt />
          </button>
        </div>
      </div>
      <div className={styles.transactions}>
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              transaction={transaction}
              user={loggedUser}
            />
          ))}
        {transactions.length <= 0 && <p>Não existem transações</p>}
      </div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <TransactionsFilter toggle={toggle} setTransactions={setTransactions} />
      </Modal>
    </div>
  );
};

export default Transactions;
