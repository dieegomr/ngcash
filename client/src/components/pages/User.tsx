import styles from './User.module.css';
import { TiArrowLeftThick } from 'react-icons/ti';

import Transactions from '../transaction/Transactions';
import Balance from '../balance/Balance';
import CashOut from '../cashOut/CashOut';

function User() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Carteira</h1>
        <TiArrowLeftThick size={30} />
      </div>
      <div className={styles.columns}>
        <Transactions />
        <div className={styles.optionsContainer}>
          <div className={styles.balanceContainer}>
            <Balance />
          </div>
          <CashOut />
        </div>
      </div>
    </div>
  );
}

export default User;
