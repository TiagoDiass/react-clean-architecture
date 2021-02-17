import React from 'react';
import faker from 'faker';
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react';
import Login from './Login';
import { AuthenticationSpy, ValidationStub } from '@/presentation/test';

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const authenticationSpy = new AuthenticationSpy();

  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />);

  return {
    sut,
    authenticationSpy,
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

describe('Login Component', () => {
  afterEach(cleanup);

  it('should not render Spinner and error on start', () => {
    const { sut } = makeSut();
    const errorWrapper = sut.getByTestId('error-wrapper');
    expect(errorWrapper.childElementCount).toBe(0);
  });

  it('should disable the submit button on Login start because fields are not valid yet', () => {
    const { sut } = makeSut({ validationError: faker.random.words() });
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
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

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  it('should show the loading spinner and disable the submit button on form submit', () => {
    const { sut } = makeSut();
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;

    simulateValidSubmit(sut);

    const loadingSpinner = sut.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeTruthy();
    expect(submitButton.disabled).toBe(true);
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
});
