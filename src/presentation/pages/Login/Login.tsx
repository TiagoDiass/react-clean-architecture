import React, { ChangeEvent, useEffect, useState } from 'react';
import Styles from './Login.styles.scss';
import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';
import { Validation } from '@/presentation/protocols';
import { FormContextState } from '@/presentation/contexts/form/form.context';

type Props = {
  validation: Validation;
};

const Login: React.FC<Props> = ({ validation }) => {
  const [state, setState] = useState<FormContextState>({
    isLoading: false,
    email: '',
    password: '',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    mainError: '',
  });

  useEffect(() => {
    validation.validate({ email: state.email });
  }, [state.email]);

  useEffect(() => {
    validation.validate({ password: state.password });
  }, [state.password]);

  return (
    <div className={Styles.login}>
      <Header />

      <Context.Provider value={{ state, setState }}>
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
