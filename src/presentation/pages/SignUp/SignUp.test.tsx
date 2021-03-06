import React from 'react';
import faker from 'faker';
import { cleanup, render, RenderResult } from '@testing-library/react';

import SignUp from './SignUp';
import { Helper, ValidationStub } from '@/presentation/test';

// Helpers
const { verifyElementChildCount, verifyInputStatus, verifyIsButtonIsDisabled, fillField } = Helper;

type SutTypes = {
  sut: RenderResult;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const sut = render(<SignUp validation={validationStub} />);

  return {
    sut,
  };
};

describe('SignUp View', () => {
  afterEach(cleanup);

  it('should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    verifyElementChildCount({ sut, elementTestId: 'error-wrapper', expectedCount: 0 });
    verifyIsButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });

    verifyInputStatus({ sut, fieldName: 'name', validationError });
    verifyInputStatus({ sut, fieldName: 'email', validationError });
    verifyInputStatus({ sut, fieldName: 'password', validationError });
    verifyInputStatus({
      sut,
      fieldName: 'passwordConfirmation',
      validationError,
    });
  });

  it('should show a name error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'name' });
    verifyInputStatus({ sut, fieldName: 'name', validationError });
  });

  it('should show an email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'email' });
    verifyInputStatus({ sut, fieldName: 'email', validationError });
  });

  it('should show a password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'password' });
    verifyInputStatus({ sut, fieldName: 'password', validationError });
  });

  it('should show a password confirmation error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'passwordConfirmation' });
    verifyInputStatus({ sut, fieldName: 'passwordConfirmation', validationError });
  });

  it('should show valid name state if Validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'name' });
    verifyInputStatus({ sut, fieldName: 'name' });
  });

  it('should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'email' });
    verifyInputStatus({ sut, fieldName: 'email' });
  });

  it('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'password' });
    verifyInputStatus({ sut, fieldName: 'password' });
  });

  it('should show valid passwordConfirmation state if Validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'passwordConfirmation' });
    verifyInputStatus({ sut, fieldName: 'passwordConfirmation' });
  });
});
