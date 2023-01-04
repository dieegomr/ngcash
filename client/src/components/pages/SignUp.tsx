import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import AuthForm from '../form/AuthForm';
import styles from './SignUp.module.css';

function SignUp() {
  const authCtx = useContext(AuthContext);
  return !authCtx.isLoggedIn ? (
    <div className={styles.signUp_container}>
      <h1>Criar conta</h1>
      <p>Informe seu nome de usuário e senha:</p>
      <AuthForm isLogin={false} />
    </div>
  ) : (
    <Navigate to="/user" />
  );
}
export default SignUp;
