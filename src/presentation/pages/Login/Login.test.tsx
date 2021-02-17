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

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  it('should show an email error if validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const emailInput = sut.getByTestId('email-input');
    const emailStatus = sut.getByTestId('email-status');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');
  });

  it('should show a password error if validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const passwordInput = sut.getByTestId('password-input');
    const passwordStatus = sut.getByTestId('password-status');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  it('should show valid email state if validation succeeds', () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId('email-input');
    const emailStatus = sut.getByTestId('email-status');

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    expect(emailStatus.title).toBe('Tudo certo!');
    expect(emailStatus.textContent).toBe('🟢');
  });

  it('should show valid password state if validation succeeds', () => {
    const { sut } = makeSut();
    const passwordInput = sut.getByTestId('password-input');
    const passwordStatus = sut.getByTestId('password-status');

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(passwordStatus.title).toBe('Tudo certo!');
    expect(passwordStatus.textContent).toBe('🟢');
  });

  it('should enable the submit button if form state is valid', () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId('email-input');
    const passwordInput = sut.getByTestId('password-input');

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });

  it('should show the loading spinner on form submit', () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId('email-input');
    const passwordInput = sut.getByTestId('password-input');
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(submitButton.disabled).toBe(false);

    fireEvent.click(submitButton);
    const loadingSpinner = sut.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeTruthy();
    expect(submitButton.disabled).toBe(true);
  });

  it('should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut();
    const emailInput = sut.getByTestId('email-input');
    const passwordInput = sut.getByTestId('password-input');
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;

    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password();

    fireEvent.input(emailInput, { target: { value: fakeEmail } });
    fireEvent.input(passwordInput, { target: { value: fakePassword } });

    expect(submitButton.disabled).toBe(false);

    fireEvent.click(submitButton);
    expect(authenticationSpy.params).toEqual({
      email: fakeEmail,
      password: fakePassword,
    });
  });
});
