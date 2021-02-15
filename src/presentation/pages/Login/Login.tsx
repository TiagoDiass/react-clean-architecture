import React, { useState } from 'react';
import Styles from './Login.styles.scss';
import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';

const Login: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
  });

  const [errorState] = useState({
    email: 'Campo obrigatório',
    password: 'Campo obrigatório',
    main: '',
  });

  return (
    <div className={Styles.login}>
      <Header />

      <Context.Provider value={{ state, errorState }}>
        <form className={Styles.form}>
          <h2>Login</h2>

          <BaseInput
            data-testid='email-input'
            type='email'
            name='email'
            placeholder='Digite seu e-mail'
          />

          <BaseInput
            data-testid='password-input'
            type='password'
            name='password'
            placeholder='Digite sua senha'
          />

          <button data-testid='submit' disabled type='submit'>
            Entrar
          </button>

          <span className={Styles.link}>Quero me cadastrar</span>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  );
};

export default Login;
