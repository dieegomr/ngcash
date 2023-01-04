import './style.css';
import myLogo from '../../images/ngCashLogo.svg';

const Header = () => {
  return (
    <header className="main-header">
      <a href="index.html" className="main-header__brand">
        <img src={myLogo} alt="NgCashLogo" />
      </a>
      <nav className="auth-nav">
        <ul className="auth-nav__items">
          <li className="auth-nav__item">
            <a href="user/login">Login</a>
          </li>
          <li className="auth-nav__item">
            <a href="user/signUp">Sign up</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
