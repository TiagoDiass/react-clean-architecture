import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import Styles from './SignUp.styles.scss';

import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';
import { Validation } from '@/presentation/protocols';
import { AddAccount, UpdateCurrentAccount } from '@/domain/usecases';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
  updateCurrentAccount: UpdateCurrentAccount;
};

const SignUp: React.FC<Props> = ({ validation, addAccount, updateCurrentAccount }) => {
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: false,

    name: '',
    nameError: '',

    email: '',
    emailError: '',

    password: '',
    passwordError: '',

    passwordConfirmation: '',
    passwordConfirmationError: '',

    mainError: '',
  });

  useEffect(() => {
    const { name, email, password, passwordConfirmation } = state;
    const formData = { name, email, password, passwordConfirmation };

    setState({
      ...state,
      nameError: validation.validate('name', formData),
      emailError: validation.validate('email', formData),
      passwordError: validation.validate('password', formData),
      passwordConfirmationError: validation.validate('passwordConfirmation', formData),
    });
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  const isThereAnError = !!(
    state.nameError ||
    state.emailError ||
    state.passwordError ||
    state.passwordConfirmationError
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (state.isLoading || isThereAnError) {
      return;
    }

    setState({
      ...state,
      isLoading: true,
    });

    await addAccount
      .add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
      })
      .then(async (account) => {
        await updateCurrentAccount.update(account);
        history.replace('/');
      })
      .catch((error) => {
        setState({
          ...state,
          isLoading: false,
          mainError: error.message,
        });
      });
  };

  return (
    <div className={Styles.signupWrapper}>
      <Header />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} data-testid='form' onSubmit={handleSubmit}>
          <h2>Cadastro</h2>

          <BaseInput type='text' name='name' placeholder='Digite seu nome' />
          <BaseInput type='email' name='email' placeholder='Digite seu e-mail' />
          <BaseInput type='password' name='password' placeholder='Digite sua senha' />
          <BaseInput type='password' name='passwordConfirmation' placeholder='Confirme sua senha' />

          <button data-testid='submit' type='submit' disabled={isThereAnError || state.isLoading}>
            Cadastrar
          </button>

          <Link to='/login' data-testid='login-link' className={Styles.link}>
            Já tenho um cadastro
          </Link>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  );
};

export default SignUp;
