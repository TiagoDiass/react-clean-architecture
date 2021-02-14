import React from 'react';
import Styles from './Login.styles.scss';
import { Spinner, Logo } from '@/presentation/components';

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <header className={Styles.header}>
        <Logo />
        <h1>4Dev Enquetes para Programadores</h1>
      </header>

      <form className={Styles.form}>
        <h2>Login</h2>

        <div className={Styles.inputWrapper}>
          <input type='email' name='email' placeholder='Digite seu e-mail' />
          <span className={Styles.status}>🔴</span>
        </div>

        <div className={Styles.inputWrapper}>
          <input type='password' name='password' placeholder='Digite sua senha' />

          <span className={Styles.status}>🔴</span>
        </div>

        <button type='submit'>Entrar</button>

        <span className={Styles.link}>Quero me cadastrar</span>

        <div className={Styles.errorWrapper}>
          <Spinner className={Styles.spinner} />
          <span className={Styles.error}>Erro</span>
        </div>
      </form>

      <footer className={Styles.footer} />
    </div>
  );
};

export default Login;
