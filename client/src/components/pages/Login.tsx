import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import AuthForm from '../form/AuthForm';
import styles from './Login.module.css';

function Login() {
  const authCtx = useContext(AuthContext);
  return !authCtx.isLoggedIn ? (
    <div className={styles.login_container}>
      <h1>Acessar conta</h1>
      <p>Informe seu nome de usuário e senha:</p>
      <AuthForm isLogin={true} />
    </div>
  ) : (
    <Navigate to="/user" />
  );
}

export default Login;
