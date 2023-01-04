import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../store/auth-context';
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';

import styles from './Balance.module.css';

const Balance: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [balance, setBalance] = useState<number>(0);

  const [isHidden, setIsHidden] = useState<boolean>(true);

  const convertedBalance = balance.toString().replace(/\./g, ',');

  const onClickHandler = () => {
    let toggleIsHidden = !isHidden;
    setIsHidden(toggleIsHidden);
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/user/balance', {
      method: 'GET',
      headers: {
        'Conten-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => setBalance(data.data.userAccount.balance))
      .catch((err) => console.log(err));
  });

  fetch('http://localhost:4000/api/v1/user/balance', {
    method: 'GET',
    headers: {
      'Conten-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    <div className={styles.balance_container}>
      <button onClick={onClickHandler} className={styles.isHidden_btn}>
        {isHidden && <RxEyeClosed />}
        {!isHidden && <RxEyeOpen />}
      </button>
      <div className={styles.balanceContainer}>
        <p>R$</p>
        <div className={styles.balance_value}>
          {!isHidden && <p>{convertedBalance}</p>}
          {isHidden && <p className={styles.hidden_bar}></p>}
        </div>
      </div>
    </div>
  );
};

export default Balance;
