import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import faker from 'faker';
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react';

import Login from './Login';

import { InvalidCredentialsError } from '@/domain/errors';

import {
  AuthenticationSpy,
  SaveAccessTokenMock,
  ValidationStub,
  Helper,
} from '@/presentation/test';

// Helpers
const {
  verifyElementChildCount,
  verifyIfButtonIsDisabled,
  verifyInputStatus,
  fillField,
  verifyIfElementExists,
} = Helper;

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/login'] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();

  const saveAccessTokenMock = new SaveAccessTokenMock();

  const sut = render(
    <Router history={history}>
      <Login
        validation={validationStub}
        authentication={authenticationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>
  );

  return {
    sut,
    authenticationSpy,
    saveAccessTokenMock,
  };
};

const simulateValidSubmit = (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  fillField({ sut, fieldName: 'email', value: email });
  fillField({ sut, fieldName: 'password', value: password });

  const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
  fireEvent.click(submitButton);
};

describe('Login Component', () => {
  afterEach(cleanup);

  it('should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    verifyElementChildCount({ sut, elementTestId: 'error-wrapper', expectedCount: 0 });
    verifyIfButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });
    verifyInputStatus({ sut, fieldName: 'email', validationError });
    verifyInputStatus({ sut, fieldName: 'password', validationError });
  });

  it('should start with empty email and password inputs', () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = sut.getByTestId('password-input') as HTMLInputElement;

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  it('should show an email error if validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'email' });
    verifyInputStatus({ sut, fieldName: 'email', validationError });
  });

  it('should show a password error if validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'password' });

    verifyInputStatus({ sut, fieldName: 'password', validationError });
  });

  it('should show valid email state if validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'email' });
    verifyInputStatus({ sut, fieldName: 'email' });
  });

  it('should show valid password state if validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'password' });

    verifyInputStatus({ sut, fieldName: 'password' });
  });

  it('should enable the submit button if form state is valid', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'email' });
    fillField({ sut, fieldName: 'password' });

    verifyIfButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: false });
  });

  it('should show the loading spinner and disable the submit button on form submit', () => {
    const { sut } = makeSut();

    simulateValidSubmit(sut);

    verifyIfElementExists({ sut, elementTestId: 'loading-spinner' });
    verifyIfButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });
  });

  it('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut();
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password();

    simulateValidSubmit(sut, fakeEmail, fakePassword);

    expect(authenticationSpy.params).toEqual({
      email: fakeEmail,
      password: fakePassword,
    });
  });

  it('should call Authentication only once', async () => {
    const { sut, authenticationSpy } = makeSut();

    await simulateValidSubmit(sut);
    await simulateValidSubmit(sut);

    expect(authenticationSpy.callsCount).toBe(1);
  });

  // Teste pra previnir que o form tenha um submit de uma forma manual, como no console do browser
  it('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);
    expect(authenticationSpy.callsCount).toBe(0);
  });

  it('should present an error message and hide spinner if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut();

    const error = new InvalidCredentialsError();

    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error));

    simulateValidSubmit(sut);

    const errorWrapper = sut.getByTestId('error-wrapper');

    await waitFor(() => errorWrapper);

    const mainError = sut.getByTestId('main-error');
    expect(mainError.textContent).toBe(error.message);

    // somente o main error deve estar por baixo do error wrapper, spinner tem que ter sumido
    expect(errorWrapper.childElementCount).toBe(1);
  });

  it('should call SaveAccessToken if Authentication succeeds', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut();
    simulateValidSubmit(sut);

    await waitFor(() => sut.getByTestId('form'));

    expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken);
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe('/');
  });

  it('should present an error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut();

    const error = new InvalidCredentialsError();

    jest.spyOn(saveAccessTokenMock, 'save').mockReturnValueOnce(Promise.reject(error));

    simulateValidSubmit(sut);

    const errorWrapper = sut.getByTestId('error-wrapper');

    await waitFor(() => errorWrapper);

    const mainError = sut.getByTestId('main-error');
    expect(mainError.textContent).toBe(error.message);

    // somente o main error deve estar por baixo do error wrapper, spinner tem que ter sumido
    expect(errorWrapper.childElementCount).toBe(1);
  });

  it('should navigate to signup page', () => {
    const { sut } = makeSut();
    const signUpLink = sut.getByTestId('signup-link');
    fireEvent.click(signUpLink);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe('/signup');
  });
});
