import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import faker from 'faker';
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react';

import Login from './Login';
import { AuthenticationSpy, SaveAccessTokenMock, ValidationStub } from '@/presentation/test';
import { InvalidCredentialsError } from '@/domain/errors';

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
  fillEmailField(sut, email);
  fillPasswordField(sut, password);

  const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
  fireEvent.click(submitButton);
};

const fillEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email-input');
  fireEvent.input(emailInput, { target: { value: email } });
};

const fillPasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password-input');
  fireEvent.input(passwordInput, { target: { value: password } });
};

type VerifyInputStatusParams = {
  sut: RenderResult;
  fieldName: string;
  validationError?: string;
};

const verifyInputStatus = ({ sut, fieldName, validationError }: VerifyInputStatusParams): void => {
  const inputStatus = sut.getByTestId(`${fieldName}-status`);
  expect(inputStatus.title).toBe(validationError || 'Tudo certo!');
  expect(inputStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};

type VerifyIfButtonIsDisabledParams = {
  sut: RenderResult;
  elementTestId: string;
  isDisabled: boolean;
};

const verifyIsButtonIsDisabled = ({
  sut,
  elementTestId,
  isDisabled,
}: VerifyIfButtonIsDisabledParams): void => {
  const button = sut.getByTestId(elementTestId) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

describe('Login Component', () => {
  afterEach(cleanup);

  it('should not render Spinner and error on start', () => {
    const { sut } = makeSut();
    const errorWrapper = sut.getByTestId('error-wrapper');
    expect(errorWrapper.childElementCount).toBe(0);
  });

  it('should disable the submit button on Login start because fields are not valid yet', () => {
    const { sut } = makeSut({ validationError: faker.random.words() });
    verifyIsButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });
  });

  it('should start with empty email and password inputs', () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId('email-input') as HTMLInputElement;
    const passwordInput = sut.getByTestId('password-input') as HTMLInputElement;

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  it('should start email and passoword inputs with an "invalid" state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    verifyInputStatus({ sut, fieldName: 'email', validationError });
    verifyInputStatus({ sut, fieldName: 'password', validationError });
  });

  it('should show an email error if validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillEmailField(sut);
    verifyInputStatus({ sut, fieldName: 'email', validationError });
  });

  it('should show a password error if validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillPasswordField(sut);

    verifyInputStatus({ sut, fieldName: 'password', validationError });
  });

  it('should show valid email state if validation succeeds', () => {
    const { sut } = makeSut();

    fillEmailField(sut);

    verifyInputStatus({ sut, fieldName: 'email' });
  });

  it('should show valid password state if validation succeeds', () => {
    const { sut } = makeSut();

    fillPasswordField(sut);

    verifyInputStatus({ sut, fieldName: 'password' });
  });

  it('should enable the submit button if form state is valid', () => {
    const { sut } = makeSut();
    fillEmailField(sut);
    fillPasswordField(sut);

    verifyIsButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: false });
  });

  it('should show the loading spinner and disable the submit button on form submit', () => {
    const { sut } = makeSut();

    simulateValidSubmit(sut);

    const loadingSpinner = sut.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeTruthy();
    verifyIsButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });
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

  // Teste pra previnir que o form tenha um submit de uma forma manual, como no console do browser
  it('should prevent the submit of the form if there is an error', () => {
    const validationError = faker.random.words();
    const { sut, authenticationSpy } = makeSut({ validationError });

    fillEmailField(sut);
    fireEvent.submit(sut.getByTestId('form'));
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

  it('should navigate to signup page', () => {
    const { sut } = makeSut();
    const signUpLink = sut.getByTestId('signup-link');
    fireEvent.click(signUpLink);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe('/signup');
  });
});
