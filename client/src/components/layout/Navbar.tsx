import { Link } from 'react-router-dom';

import Container from './Container';

import styles from './Navbar.module.css';
import logo from '../../images/ngCashLogo.svg';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';

const Navbar: React.FC = (props) => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <nav className={styles.navbar}>
      <Container customClass="black">
        {!isLoggedIn && (
          <Link to="/">
            <img src={logo} alt="NG.CASH" className={styles.logo} />
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/user">
            <img src={logo} alt="NG.CASH" className={styles.logo} />
          </Link>
        )}
        {!isLoggedIn && (
          <ul className={styles.list}>
            <li className={styles.item}>
              <Link to="/signUp">Criar Conta</Link>
            </li>
            <li className={styles.item}>
              <Link to="/login">Acessar Conta</Link>
            </li>
          </ul>
        )}
        {isLoggedIn && (
          <ul className={styles.list}>
            <li className={styles.item}>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          </ul>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
