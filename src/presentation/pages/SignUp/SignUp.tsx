import React, { FormEvent, useEffect, useState } from 'react';
import Styles from './SignUp.styles.scss';
import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';
import { Validation } from '@/presentation/protocols';
import { AddAccount } from '@/domain/usecases';

type Props = {
  validation: Validation;
  addAccount: AddAccount;
};

const SignUp: React.FC<Props> = ({ validation, addAccount }) => {
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
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password),
      passwordConfirmationError: validation.validate(
        'passwordConfirmation',
        state.passwordConfirmation
      ),
    });
  }, [state.name, state.email, state.password, state.passwordConfirmation]);

  const isThereAnError = !!(
    state.mainError ||
    state.nameError ||
    state.emailError ||
    state.passwordError ||
    state.passwordConfirmationError
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setState({
      ...state,
      isLoading: true,
    });

    await addAccount.add({
      name: state.name,
      email: state.email,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation,
    });
  };

  return (
    <div className={Styles.signup}>
      <Header />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form} data-testid='form' onSubmit={handleSubmit}>
          <h2>Cadastro</h2>

          <BaseInput type='text' name='name' placeholder='Digite seu nome' />
          <BaseInput type='email' name='email' placeholder='Digite seu e-mail' />
          <BaseInput type='password' name='password' placeholder='Digite sua senha' />
          <BaseInput type='password' name='passwordConfirmation' placeholder='Confirme sua senha' />

          <button data-testid='submit' type='submit' disabled={isThereAnError || state.isLoading}>
            Entrar
          </button>

          <span className={Styles.link}>Já tenho um cadastro</span>

          <FormStatus />
        </form>
      </Context.Provider>

      <Footer />
    </div>
  );
};

export default SignUp;
