import React, { useContext, useRef, useState } from 'react';
import AuthFormModel from '../../models/authForm';
import AuthContext from '../../store/auth-context';
import styles from './AuthForm.module.css';
import SubmitButton from './SubmitButton';
import { useNavigate } from 'react-router-dom';
import Modal from '../modals/Modal';
import useModal from '../../hooks/useModal';
import ErrorMessage from '../layout/ErrorMessage';
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';

const AuthForm: React.FC<AuthFormModel> = ({ isLogin }) => {
  const navigate = useNavigate();
  const text = isLogin ? 'Entrar' : 'Cadastrar';
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHiddenEye, setIsHiddenEye] = useState(false);
  const [isHiddenPassword, setIsHiddenPassword] = useState('password');

  const { isOpen, toggle } = useModal();

  let type = 'password';

  const toggleEye = () => {
    setIsHiddenEye(!isHiddenEye);

    isHiddenEye ? (type = 'password') : (type = 'text');
    setIsHiddenPassword(type);
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredUsername = usernameInputRef.current!.value;
    const enteredPassword = passwordInputRef.current!.value;

    setIsLoading(true);
    let url;
    if (isLogin) {
      url = 'http://localhost:4000/api/v1/user/login';
    } else {
      url = 'http://localhost:4000/api/v1/user/signup';
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        username: enteredUsername,
        password: enteredPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = 'Falha de autenticação!';
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            setErrorMessage(errorMessage);
            return toggle();
          });
        }
      })
      .then((data) => {
        authCtx.login(data.token);
        passwordInputRef.current!.value = '';
        usernameInputRef.current!.value = '';
        navigate('/user', { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form onSubmit={submitHandler} className={styles.form_control}>
        <label htmlFor="username">Nome do usuário</label>
        <div className={styles.inputContainer}>
          <input
            type="text"
            id="username"
            placeholder="o nome de usuário para acessar sua conta"
            ref={usernameInputRef}
          />
        </div>
        <label htmlFor="password">Senha</label>
        <div className={styles.inputContainer}>
          <input
            type={isHiddenPassword}
            id="password"
            placeholder="a senha para acessar sua conta"
            ref={passwordInputRef}
          />
          <span onClick={toggleEye}>
            {!isHiddenEye && <RxEyeClosed />}
            {isHiddenEye && <RxEyeOpen />}
          </span>
        </div>
        {!isLoading && (
          <SubmitButton text={text} customClass="btn_auth" isLoading={false} />
        )}
        {isLoading && (
          <SubmitButton
            text={text}
            customClass="btn_loading"
            isLoading={true}
          />
        )}
      </form>
      {errorMessage && (
        <Modal isOpen={isOpen} toggle={toggle}>
          <ErrorMessage message={errorMessage} />
        </Modal>
      )}
    </div>
  );
};
export default AuthForm;
