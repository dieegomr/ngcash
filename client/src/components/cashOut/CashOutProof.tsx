import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './CashOutProof.module.css';

type Props = {
  toggle: () => void;
  value: number;
  creditedAccount: string;
  id: string;
  date: string;
  transactionDone: (done: boolean) => void;
};

const CashOutProof = (props: Props) => {
  const convertedValue = props.value.toString().replace(/\./g, ',');

  const onCloseHandler = () => {
    props.transactionDone(false);
    return props.toggle();
  };

  return (
    <div className={styles.container}>
      <div className={styles.tranferDetails}>
        <p className={styles.title}>Comprovante de transferência</p>
        <p className={styles.subtitle}>Valor</p>
        <div className={styles.valueContainer}>
          <span>R$</span>
          <span>{convertedValue}</span>
        </div>
        <div className={styles.dateCointainer}>
          <p>em</p>
          <p className={styles.date}>{props.date}</p>
        </div>
        <div className={styles.usernameCointainer}>
          <p>para</p>
          <p className={styles.username}>{props.creditedAccount}</p>
        </div>
        <div className={styles.transactionContainer}>
          <p className={styles.transactionID}>ID da transação</p>
          <p>{props.id}</p>
        </div>
      </div>
    </div>
  );
};

export default CashOutProof;
