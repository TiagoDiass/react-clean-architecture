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
    verifyInputStatus({ sut, fieldName: 'email', validationError: 'Campo obrigatório' });
    verifyInputStatus({ sut, fieldName: 'password', validationError: 'Campo obrigatório' });
    verifyInputStatus({
      sut,
      fieldName: 'passwordConfirmation',
      validationError: 'Campo obrigatório',
    });
  });

  it('should show a name error if validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const fieldName = 'name';
    fillField({ sut, fieldName });
    verifyInputStatus({ sut, fieldName, validationError });
  });
});
