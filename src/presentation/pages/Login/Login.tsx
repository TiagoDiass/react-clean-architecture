import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Styles from './Login.styles.scss';
import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';
import { Validation } from '@/presentation/protocols';
import { Authentication, SaveAccessToken } from '@/domain/usecases';

type Props = {
  validation: Validation;
  authentication: Authentication;
  saveAccessToken: SaveAccessToken;
};

const Login: React.FC<Props> = ({ validation, authentication, saveAccessToken }) => {
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
  });

  useEffect(() => {
    const { email, password } = state;
    const formData = { email, password };

    setState({
      ...state,
      emailError: validation.validate('email', formData),
      passwordError: validation.validate('password', formData),
    });
  }, [state.email, state.password]);

  const isThereAnError = !!(state.emailError || state.passwordError);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!state.isLoading && !isThereAnError) {
      setState({
        ...state,
        isLoading: true,
      });

      await authentication
        .auth({ email: state.email, password: state.password })
        .then(async (account) => {
          await saveAccessToken.save(account.accessToken);
          history.replace('/');
        })
        .catch((error) => {
          setState({
            ...state,
            isLoading: false,
            mainError: error.message,
          });
        });
    }
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

          <Link data-testid='signup-link' to='/signup' className={Styles.link}>
            Quero me cadastrar
          </Link>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  );
};

export default Login;
