import React, { useState } from 'react';
import Styles from './Login.styles.scss';
import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';

type State = {
  isLoading: boolean;
  errorMessage: string;
};

const Login: React.FC = () => {
  const [state, setState] = useState<State>({
    isLoading: false,
    errorMessage: '',
  });

  return (
    <div className={Styles.login}>
      <Header />

      <Context.Provider value={state}>
        <form className={Styles.form}>
          <h2>Login</h2>

          <BaseInput type='email' name='email' placeholder='Digite seu e-mail' />
          <BaseInput type='password' name='password' placeholder='Digite sua senha' />

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
