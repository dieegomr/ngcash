import React from 'react';
import { BiMessageError } from 'react-icons/bi';
import styles from './ErrorMessage.module.css';

type Props = {
  message: string;
};

const ErrorMessage = (props: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <BiMessageError size={100} />
      </div>
      <p>Atenção!</p>
      <div className={styles.errorMessage}>{props.message}</div>
    </div>
  );
};

export default ErrorMessage;
