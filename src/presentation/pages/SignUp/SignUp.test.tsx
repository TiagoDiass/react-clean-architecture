import React from 'react';
import SignUp from './SignUp';
import { render, RenderResult } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from '@/presentation/components';

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<SignUp />);

  return {
    sut,
  };
};

const verifyElementChildCount = (
  sut: RenderResult,
  elementTestId: string,
  expectedCount: number
) => {
  const element = sut.getByTestId(elementTestId);
  expect(element.childElementCount).toBe(expectedCount);
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

describe('SignUp View', () => {
  it('should start with initial state', () => {
    const validationError = 'Campo obrigatório';
    const { sut } = makeSut();
    verifyElementChildCount(sut, 'error-wrapper', 0);
    verifyIsButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });
    verifyInputStatus({ sut, fieldName: 'name', validationError });
    verifyInputStatus({ sut, fieldName: 'email', validationError });
    verifyInputStatus({ sut, fieldName: 'password', validationError });
    verifyInputStatus({ sut, fieldName: 'passwordConfirmation', validationError });
  });
});
