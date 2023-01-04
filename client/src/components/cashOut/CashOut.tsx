import { useContext, useRef, useState } from 'react';
import useModal from '../../hooks/useModal';
import useTransaction from '../../hooks/useTransaction';
import AuthContext from '../../store/auth-context';
import ErrorMessage from '../layout/ErrorMessage';
import Modal from '../modals/Modal';
import styles from './CashOut.module.css';
import CashOutConfirmation from './CashOutConfirmation';
import CashOutProof from './CashOutProof';

function CashOut() {
  const authCtx = useContext(AuthContext);

  const { isOpen, toggle } = useModal();
  const { isDone, transactionDone } = useTransaction();

  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredValue, setEnteredValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [receiverUser, setReceiverUser] = useState('');
  const [cashOutvalue, setCashOutvalue] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [isFieldEmpty, setIsFieldEmpty] = useState(true);

  const errorMessageRef = useRef('');

  const usernameChangHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredUsername(event.target.value);
  };

  const valueChangHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(event.target.value);
  };

  const handleTransfer = () => {
    errorMessageRef.current = '';
    transactionDone(false);
    if (!enteredUsername || !enteredValue || enteredValue === '0') {
      setIsFieldEmpty(true);
    } else {
      setIsFieldEmpty(false);
    }
    return toggle();
  };

  const cleanerFormInputs = () => {
    setEnteredUsername('');
    setEnteredValue('');
  };
  const toCashOut = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const enteredValueNumber = Number(enteredValue.replace(/,/g, '.'));

    fetch('http://localhost:4000/api/v1/user/transactions/cashout', {
      method: 'POST',
      body: JSON.stringify({
        username: enteredUsername,
        value: enteredValueNumber,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authCtx.token}`,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data && data.error && data.error.message) {
          errorMessageRef.current = data.error.message;
          setIsLoading(false);
          cleanerFormInputs();
        } else {
          transactionDone(true);
          setTransactionDate(data.data.transaction.date);
          setReceiverUser(data.data.transaction.creditedAccount.username);
          setCashOutvalue(data.data.transaction.value);
          setTransactionId(data.data.transaction.id);
          cleanerFormInputs();
          setIsLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.cashOut_container}>
      <form>
        <div className={styles.form_control}>
          <div className={styles.form_control__value}>
            <label htmlFor="value">Quanto você deseja transferir?</label>
            <div className={styles.currency_sign}>
              <p>R$</p>
              <input
                placeholder="0,00"
                type="text"
                id="value"
                onChange={valueChangHandler}
                value={enteredValue}
              />
            </div>
          </div>
          <div className={styles.form_control__username}>
            <label htmlFor="username">Quem receberá o valor?</label>
            <input
              placeholder="nome do usuário"
              type="text"
              id="username"
              onChange={usernameChangHandler}
              value={enteredUsername}
            />
          </div>
        </div>
      </form>
      <button onClick={handleTransfer} className={styles.btn_transfer}>
        Transferir
      </button>
      <Modal isOpen={isOpen} toggle={toggle}>
        {!isDone && !isFieldEmpty && !errorMessageRef.current && (
          <CashOutConfirmation
            enteredUsername={enteredUsername}
            enteredValue={enteredValue}
            toCashOut={toCashOut}
            toggle={toggle}
            isLoading={isLoading}
          />
        )}
        {isDone && !isFieldEmpty && !errorMessageRef.current && (
          <CashOutProof
            creditedAccount={receiverUser}
            value={cashOutvalue}
            toggle={toggle}
            id={transactionId}
            date={transactionDate}
            transactionDone={transactionDone}
          />
        )}
        {isFieldEmpty && (
          <ErrorMessage
            message="Não se esqueça de informar um valor válido para transferir e um nome de
        usuário para receber este valor :)"
          />
        )}
        {errorMessageRef.current && (
          <ErrorMessage message={errorMessageRef.current} />
        )}
      </Modal>
    </div>
  );
}

export default CashOut;
