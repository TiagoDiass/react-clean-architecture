import React from 'react';
import SignUp from './SignUp';
import { render, RenderResult } from '@testing-library/react';
import { Helper } from '@/presentation/test';

// Helpers
const { verifyElementChildCount, verifyInputStatus, verifyIsButtonIsDisabled } = Helper;

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);

  return {
    sut,
  };
};

describe('SignUp View', () => {
  it('should start with initial state', () => {
    const validationError = 'Campo obrigatório';
    const { sut } = makeSut();
    verifyElementChildCount({ sut, elementTestId: 'error-wrapper', expectedCount: 0 });
    verifyIsButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });
    verifyInputStatus({ sut, fieldName: 'name', validationError });
    verifyInputStatus({ sut, fieldName: 'email', validationError });
    verifyInputStatus({ sut, fieldName: 'password', validationError });
    verifyInputStatus({ sut, fieldName: 'passwordConfirmation', validationError });
  });
});
