import { RenderResult } from '@testing-library/react';

type VerifyElementChildCountParams = {
  sut: RenderResult;
  elementTestId: string;
  expectedCount: number;
};

export const verifyElementChildCount = ({
  sut,
  elementTestId,
  expectedCount,
}: VerifyElementChildCountParams) => {
  const element = sut.getByTestId(elementTestId);
  expect(element.childElementCount).toBe(expectedCount);
};

type VerifyInputStatusParams = {
  sut: RenderResult;
  fieldName: string;
  validationError?: string;
};

export const verifyInputStatus = ({
  sut,
  fieldName,
  validationError,
}: VerifyInputStatusParams): void => {
  const inputStatus = sut.getByTestId(`${fieldName}-status`);
  expect(inputStatus.title).toBe(validationError || 'Tudo certo!');
  expect(inputStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};

type VerifyIfButtonIsDisabledParams = {
  sut: RenderResult;
  elementTestId: string;
  isDisabled: boolean;
};

export const verifyIsButtonIsDisabled = ({
  sut,
  elementTestId,
  isDisabled,
}: VerifyIfButtonIsDisabledParams): void => {
  const button = sut.getByTestId(elementTestId) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};
