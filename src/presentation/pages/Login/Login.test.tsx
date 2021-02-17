import React from 'react';
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react';
import faker from 'faker';
import Login from './Login';
import { ValidationStub } from '@/presentation/test';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = faker.random.words();
  const sut = render(<Login validation={validationStub} />);

  return {
    sut,
    validationStub,
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
    const { sut } = makeSut();
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
    const { sut, validationStub } = makeSut();

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  it('should show an email error if validation fails', () => {
    const { sut, validationStub } = makeSut();

    const emailInput = sut.getByTestId('email-input');
    const emailStatus = sut.getByTestId('email-status');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
  });

  it('should show a password error if validation fails', () => {
    const { sut, validationStub } = makeSut();

    const passwordInput = sut.getByTestId('password-input');
    const passwordStatus = sut.getByTestId('password-status');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  it('should show valid email state if validation succeeds', () => {
    const { sut, validationStub } = makeSut();

    validationStub.errorMessage = null;

    const emailInput = sut.getByTestId('email-input');
    const emailStatus = sut.getByTestId('email-status');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    expect(emailStatus.title).toBe('Tudo certo!');
    expect(emailStatus.textContent).toBe('🟢');
  });

  it('should show valid password state if validation succeeds', () => {
    const { sut, validationStub } = makeSut();

    validationStub.errorMessage = null;

    const passwordInput = sut.getByTestId('password-input');
    const passwordStatus = sut.getByTestId('password-status');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(passwordStatus.title).toBe('Tudo certo!');
    expect(passwordStatus.textContent).toBe('🟢');
  });

  it('should enable the submit button if form state is valid', () => {
    const { sut, validationStub } = makeSut();

    validationStub.errorMessage = null;

    const emailInput = sut.getByTestId('email-input');
    const passwordInput = sut.getByTestId('password-input');

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);
  });
});
