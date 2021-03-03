import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './SignUp.styles.scss';
import { LoginHeader as Header, Footer, BaseInput, FormStatus } from '@/presentation/components';
import { FormContext as Context } from '@/presentation/contexts';
import { FormContextState } from '@/presentation/contexts/form/form.context';

const SignUp: React.FC = () => {
  return (
    <div className={Styles.signup}>
      <Header />

      <Context.Provider value={{ state: {} as FormContextState, setState: () => {} }}>
        <form className={Styles.form}>
          <h2>Cadastro</h2>

          <BaseInput type='text' name='name' placeholder='Digite seu nome' />
          <BaseInput type='email' name='email' placeholder='Digite seu e-mail' />
          <BaseInput type='password' name='password' placeholder='Digite sua senha' />
          <BaseInput type='password' name='passwordConfirmation' placeholder='Confirme sua senha' />

          <button type='submit'>Entrar</button>

          <Link to='/login' className={Styles.link}>
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
