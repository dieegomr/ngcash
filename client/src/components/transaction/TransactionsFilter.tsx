import React, { useContext, useEffect, useRef, useState } from 'react';
import { RiToggleLine } from 'react-icons/ri';
import { Transaction } from '../../models/transaction';
import AuthContext from '../../store/auth-context';
import ErrorMessage from '../layout/ErrorMessage';
import styles from './TransactionsFilter.module.css';

type Props = {
  toggle: () => void;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
};

const TransactionsFilter = (props: Props) => {
  const { token } = useContext(AuthContext);

  const [selectedRadioDateBtn, setSelectedRadioDateBtn] = useState('allDates');
  const [selectedTransactionRadioBtn, setSelectedTransactionRadioBtn] =
    useState('getAll');
  const [errorMessage, setErrorMessage] = useState('');

  const dayInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  const isRadioDateSelected = (value: string) => selectedRadioDateBtn === value;
  const isRadioTransactionSelected = (value: string) =>
    selectedTransactionRadioBtn === value;

  const handleRadioDateClick = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedRadioDateBtn(e.currentTarget.value);

  const handleRadioTransactionClick = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedTransactionRadioBtn(e.currentTarget.value);

  const isSpecificDate = selectedRadioDateBtn === 'specificDate' ? true : false;
  let date = '';

  const onFilterHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (isSpecificDate) {
      let day = dayInputRef.current!.value;
      let month = monthInputRef.current!.value;
      let year = yearInputRef.current!.value;
      date = `${day}-${month}-${year}`;
    } else {
      date = '';
    }

    fetch(
      `http://localhost:4000/api/v1/user/transactions/${selectedTransactionRadioBtn}/${date}`,
      {
        method: 'GET',
        headers: {
          'Conten-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error && data.error.message) {
          setErrorMessage(data.error.message);
        }

        props.setTransactions(data.data.transactions);
        return props.toggle();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      {!errorMessage && (
        <form onSubmit={onFilterHandler}>
          <fieldset className={styles.transactionType}>
            <legend>Filtrar por tipo de transação:</legend>
            <div className={styles.option}>
              <input
                type="radio"
                name="radioTransactionType"
                value="getAll"
                id="allTransactions"
                checked={isRadioTransactionSelected('getAll')}
                onChange={handleRadioTransactionClick}
              />
              <label htmlFor="allTransactions">Todas as transações</label>
            </div>
            <div className={styles.option}>
              <input
                type="radio"
                name="radioTransactionType"
                value="cashIn"
                id="cashIn"
                checked={isRadioTransactionSelected('cashIn')}
                onChange={handleRadioTransactionClick}
              />
              <label htmlFor="cashIn">Creditado</label>
            </div>
            <div className={styles.option}>
              <input
                type="radio"
                name="radioTransactionType"
                value="cashOut"
                id="cashOut"
                checked={isRadioTransactionSelected('cashOut')}
                onChange={handleRadioTransactionClick}
              />
              <label htmlFor="cashOut">Debitado</label>
            </div>
          </fieldset>
          <fieldset className={styles.filterDate}>
            <legend>Selecione a data:</legend>
            <div className={styles.option}>
              <input
                type="radio"
                name="radioDate"
                value="allDates"
                id="allDates"
                checked={isRadioDateSelected('allDates')}
                onChange={handleRadioDateClick}
              />
              <label htmlFor="allDates">Todas as datas</label>
            </div>
            <div className={styles.option}>
              <input
                type="radio"
                name="radioDate"
                value="specificDate"
                id="specificDate"
                checked={isRadioDateSelected('specificDate')}
                onChange={handleRadioDateClick}
              />
              <label htmlFor="specificDate">Escolher uma data</label>
            </div>
            {isSpecificDate && (
              <div className={styles.dateOptionForm}>
                <input
                  placeholder="dd"
                  type="text"
                  id="day"
                  ref={dayInputRef}
                />
                <span>/</span>
                <input
                  placeholder="mm"
                  type="text"
                  id="month"
                  ref={monthInputRef}
                />
                <span>/</span>
                <input
                  placeholder="aaaa"
                  type="text"
                  id="year"
                  ref={yearInputRef}
                />
              </div>
            )}
          </fieldset>
          <button className={styles.btn_filter}>Filtrar</button>
        </form>
      )}

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};

export default TransactionsFilter;
