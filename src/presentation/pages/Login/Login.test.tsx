import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import faker from 'faker';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import Login from './Login';

import { ValidationStub, Helper } from '@/presentation/test';
import { ApiContext } from '@/presentation/contexts';
import { AccountModel } from '@/domain/models';
import { InvalidCredentialsError } from '@/domain/errors';
import { AuthenticationSpy } from '@/domain/test';

// Helpers
const { verifyInputStatus, fillField } = Helper;

type SutTypes = {
  authenticationSpy: AuthenticationSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/login'] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();

  const setCurrentAccountMock = jest.fn();

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <Login validation={validationStub} authentication={authenticationSpy} />
      </Router>
    </ApiContext.Provider>
  );

  return {
    authenticationSpy,
    setCurrentAccountMock,
  };
};

const simulateValidSubmit = (
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  fillField({ fieldName: 'email', value: email });
  fillField({ fieldName: 'password', value: password });

  const submitButton = screen.getByTestId('submit') as HTMLButtonElement;
  fireEvent.click(submitButton);
};

describe('Login Component', () => {
  it('should start with initial state', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    expect(screen.getByTestId('error-wrapper').children).toHaveLength(0);
    expect(screen.getByTestId('submit')).toBeDisabled();
    verifyInputStatus({ fieldName: 'email', validationError, inputStatus: 'initial' });
    verifyInputStatus({ fieldName: 'password', validationError, inputStatus: 'initial' });
  });

  it('should start with empty email and password inputs', () => {
    makeSut();
    const emailInput = screen.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  it('should show an email error if validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    fillField({ fieldName: 'email' });
    verifyInputStatus({ fieldName: 'email', validationError, inputStatus: 'invalid' });
  });

  it('should show a password error if validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    fillField({ fieldName: 'password' });

    verifyInputStatus({ fieldName: 'password', validationError, inputStatus: 'invalid' });
  });

  it('should show valid email state if validation succeeds', () => {
    makeSut();

    fillField({ fieldName: 'email' });
    verifyInputStatus({ fieldName: 'email', inputStatus: 'valid' });
  });

  it('should show valid password state if validation succeeds', () => {
    makeSut();

    fillField({ fieldName: 'password' });

    verifyInputStatus({ fieldName: 'password', inputStatus: 'valid' });
  });

  it('should enable the submit button if form state is valid', () => {
    makeSut();

    fillField({ fieldName: 'email' });
    fillField({ fieldName: 'password' });

    expect(screen.getByTestId('submit')).toBeEnabled();
  });

  it('should show the loading spinner and disable the submit button on form submit', () => {
    makeSut();

    simulateValidSubmit();

    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByTestId('submit')).toBeDisabled();
  });

  it('should call Authentication with correct values', () => {
    const { authenticationSpy } = makeSut();
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password();

    simulateValidSubmit(fakeEmail, fakePassword);

    expect(authenticationSpy.params).toEqual({
      email: fakeEmail,
      password: fakePassword,
    });
  });

  it('should call Authentication only once', async () => {
    const { authenticationSpy } = makeSut();

    await simulateValidSubmit();
    await simulateValidSubmit();

    expect(authenticationSpy.callsCount).toBe(1);
  });

  // Teste pra previnir que o form tenha um submit de uma forma manual, como no console do browser
  it('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words();
    const { authenticationSpy } = makeSut({ validationError });

    await simulateValidSubmit();
    expect(authenticationSpy.callsCount).toBe(0);
  });

  it('should present an error message and hide spinner if Authentication fails', async () => {
    const { authenticationSpy } = makeSut();

    const error = new InvalidCredentialsError();

    jest.spyOn(authenticationSpy, 'auth').mockRejectedValueOnce(error);

    simulateValidSubmit();

    const errorWrapper = screen.getByTestId('error-wrapper');

    await waitFor(() => errorWrapper);

    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message);

    // somente o main error deve estar por baixo do error wrapper, spinner tem que ter sumido
    expect(screen.getByTestId('error-wrapper').children).toHaveLength(1);
  });

  it('should call SaveAccessToken if Authentication succeeds', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut();
    simulateValidSubmit();

    await waitFor(() => screen.getByTestId('form'));

    expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account);
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe('/');
  });

  it('should navigate to signup page', () => {
    makeSut();
    const signUpLink = screen.getByTestId('signup-link');
    fireEvent.click(signUpLink);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe('/signup');
  });
});
