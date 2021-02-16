import React from 'react';
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react';
import faker from 'faker';
import Login from './Login';
import { ValidationSpy } from '@/presentation/test';

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  validationSpy.errorMessage = faker.random.words();
  const sut = render(<Login validation={validationSpy} />);

  return {
    sut,
    validationSpy,
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
    const { sut, validationSpy } = makeSut();

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe('Campo obrigatório');
    expect(passwordStatus.textContent).toBe('🔴');
  });

  it('should call Validation with correct email value', () => {
    const { sut, validationSpy } = makeSut();
    const emailInput = sut.getByTestId('email-input');
    const fakeEmail = faker.internet.email();

    fireEvent.input(emailInput, { target: { value: fakeEmail } });
    expect(validationSpy.fieldName).toBe('email');
    expect(validationSpy.fieldValue).toBe(fakeEmail);
  });

  it('should call Validation with correct password value', () => {
    const { sut, validationSpy } = makeSut();
    const passwordInput = sut.getByTestId('password-input');
    const fakePassword = faker.internet.password();

    fireEvent.input(passwordInput, { target: { value: fakePassword } });
    expect(validationSpy.fieldName).toBe('password');
    expect(validationSpy.fieldValue).toBe(fakePassword);
  });

  it('should show an email error if validation fails', () => {
    const { sut, validationSpy } = makeSut();
    const errorMessage = faker.random.words();

    const emailInput = sut.getByTestId('email-input');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });
    const emailStatus = sut.getByTestId('email-status');

    expect(emailStatus.title).toBe(validationSpy.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
  });
});
