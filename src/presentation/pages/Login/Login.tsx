import React from 'react';
import Styles from './Login.styles.scss';
import { Spinner, LoginHeader as Header, Footer, BaseInput } from '@/presentation/components';

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <Header />

      <form className={Styles.form}>
        <h2>Login</h2>

        <BaseInput type='email' name='email' placeholder='Digite seu e-mail' />
        <BaseInput type='password' name='password' placeholder='Digite sua senha' />

        <button type='submit'>Entrar</button>

        <span className={Styles.link}>Quero me cadastrar</span>

        <div className={Styles.errorWrapper}>
          <Spinner className={Styles.spinner} />
          <span className={Styles.error}>Erro</span>
        </div>
      </form>

      <Footer />
    </div>
  );
};

export default Login;
