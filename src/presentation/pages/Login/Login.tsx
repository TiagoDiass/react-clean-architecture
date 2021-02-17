import React, { ChangeEvent, useEffect, useState } from 'react';
import Styles from './Login.styles.scss';
import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';
import { Validation } from '@/presentation/protocols';
import { FormContextState } from '@/presentation/contexts/form/form.context';
import { Authentication } from '@/domain/usecases';

type Props = {
  validation: Validation;
  authentication: Authentication;
};

const Login: React.FC<Props> = ({ validation, authentication }) => {
  const [state, setState] = useState<FormContextState>({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
    });
  }, [state.email, state.password]);

  const isThereAnError = !!(state.emailError || state.passwordError);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (state.isLoading || isThereAnError) {
      return;
    }

    setState({
      ...state,
      isLoading: true,
    });

    await authentication.auth({ email: state.email, password: state.password });
  };

  return (
    <div className={Styles.login}>
      <Header />

      <Context.Provider value={{ state, setState }}>
        <form data-testid='form' className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>

          <BaseInput type='email' name='email' placeholder='Digite seu e-mail' />

          <BaseInput type='password' name='password' placeholder='Digite sua senha' />

          <button data-testid='submit' disabled={isThereAnError || state.isLoading} type='submit'>
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
