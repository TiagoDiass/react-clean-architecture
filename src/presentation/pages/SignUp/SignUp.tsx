import React, { useEffect, useState } from 'react';
import Styles from './SignUp.styles.scss';
import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';
import { Validation } from '@/presentation/protocols';

type Props = {
  validation: Validation;
};

const SignUp: React.FC<Props> = ({ validation }) => {
  const [state, setState] = useState({
    isLoading: false,

    name: '',
    nameError: 'Campo obrigatório',

    email: '',
    emailError: 'Campo obrigatório',
    passwordError: 'Campo obrigatório',
    passwordConfirmationError: 'Campo obrigatório',
    mainError: '',
  });

  useEffect(() => {
    setState({
      ...state,
      nameError: validation.validate('name', state.name),
      emailError: validation.validate('email', state.email),
    });
  }, [state.name, state.email]);

  return (
    <div className={Styles.signup}>
      <Header />

      <Context.Provider value={{ state, setState }}>
        <form className={Styles.form}>
          <h2>Cadastro</h2>

          <BaseInput type='text' name='name' placeholder='Digite seu nome' />
          <BaseInput type='email' name='email' placeholder='Digite seu e-mail' />
          <BaseInput type='password' name='password' placeholder='Digite sua senha' />
          <BaseInput type='password' name='passwordConfirmation' placeholder='Confirme sua senha' />

          <button data-testid='submit' type='submit' disabled>
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
