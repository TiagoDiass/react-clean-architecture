import React from 'react';
import Styles from './Login.styles.scss';
import Logo from '@/presentation/assets/logo.svg';

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}>
        <img src={Logo} alt='4Dev Enquetes para Programadores' />
        <h1>4Dev Enquetes para Programadores</h1>
      </header>
      <form className={Styles.form}></form>
      <footer className={Styles.footer}>
        <h2>Footer</h2>
      </footer>
    </div>
  );
};

export default Login;
