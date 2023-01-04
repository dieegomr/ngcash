import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsHourglassSplit } from 'react-icons/bs';
import styles from './CashOutConfirmation.module.css';

type Props = {
  toggle: () => void;
  enteredValue: string;
  enteredUsername: string;
  toCashOut: (event: React.FormEvent) => void;
  isLoading: boolean;
};

const CashOutConfirmation = (props: Props) => {
  return (
    <div className={styles.container}>
      <p>Você está transferindo</p>
      <div>
        <span className={styles.realSign}>R$</span>
        <span className={styles.value}>{props.enteredValue}</span>
      </div>
      <div className={styles.usernameCointainer}>
        <p className={styles.toUsername}>para</p>
        <p className={styles.username}>{props.enteredUsername}</p>
      </div>
      {!props.isLoading && (
        <button
          onClick={props.toCashOut}
          className={styles.btn_transferConfirmation}
        >
          Confirmar transferência
        </button>
      )}
      {props.isLoading && (
        <button
          onClick={props.toCashOut}
          className={styles.btn_transferLoading}
        >
          Confirmar transferência{' '}
          <span>
            <BsHourglassSplit />
          </span>
        </button>
      )}
    </div>
  );
};

export default CashOutConfirmation;
