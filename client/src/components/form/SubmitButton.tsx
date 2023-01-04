import React from 'react';
import SubmitButtonModel from '../../models/submitButton';
import { BsHourglassSplit } from 'react-icons/bs';

import styles from './SubmitButton.module.css';

const Input: React.FC<SubmitButtonModel> = ({
  text,
  customClass,
  isLoading,
}) => {
  return (
    <div className={styles.btn_container}>
      <button className={styles[customClass]}>
        {text}
        {isLoading && (
          <span>
            <BsHourglassSplit />
          </span>
        )}
      </button>
    </div>
  );
};

export default Input;
