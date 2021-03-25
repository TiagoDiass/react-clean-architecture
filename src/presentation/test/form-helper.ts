import { fireEvent, screen } from '@testing-library/react';
import faker from 'faker';

type VerifyElementChildCountParams = {
  elementTestId: string;
  expectedCount: number;
};

/**
 * @helper Verifica se o número de filhos de um elemento é o esperado
 */
export const verifyElementChildCount = ({
  elementTestId,
  expectedCount,
}: VerifyElementChildCountParams) => {
  const element = screen.getByTestId(elementTestId);
  expect(element.childElementCount).toBe(expectedCount);
};

type VerifyInputStatusParams = {
  fieldName: string;
  validationError?: string;
  inputStatus: 'initial' | 'valid' | 'invalid';
};

/**
 * @helper Verifica o status de um input
 */
export const verifyInputStatus = ({
  fieldName,
  validationError = '',
  inputStatus,
}: VerifyInputStatusParams): void => {
  const inputWrapper = screen.getByTestId(`${fieldName}-wrapper`);
  const input = screen.getByTestId(`${fieldName}-input`);
  const inputLabel = screen.getByTestId(`${fieldName}-label`);

  expect(inputWrapper.getAttribute('data-status')).toBe(inputStatus);
  expect(input.title).toBe(validationError);
  expect(inputLabel.title).toBe(validationError);

  if (inputStatus === 'invalid') {
    const inputSmall = screen.getByTestId(`${fieldName}-small`);
    expect(inputSmall.textContent).toBe(validationError);
  }
};

type VerifyIfButtonIsDisabledParams = {
  elementTestId: string;
  isDisabled: boolean;
};

/**
 * @helper Verifica se um botão está desabilitado
 */
export const verifyIfButtonIsDisabled = ({
  elementTestId,
  isDisabled,
}: VerifyIfButtonIsDisabledParams): void => {
  const button = screen.getByTestId(elementTestId) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

type FillFieldParams = {
  fieldName: string;
  value?: string;
};

/**
 * @helper Preenche um input
 */
export const fillField = ({ fieldName, value = faker.random.word() }: FillFieldParams): void => {
  const inputElement = screen.getByTestId(`${fieldName}-input`);
  fireEvent.focus(inputElement);
  fireEvent.input(inputElement, { target: { value } });
};

type VerifyIfElementExistsParams = {
  elementTestId: string;
};

/**
 * @helper Verifica se um elemento existe
 */
export const verifyIfElementExists = ({ elementTestId }: VerifyIfElementExistsParams) => {
  const element = screen.getByTestId(elementTestId);
  expect(element).toBeTruthy();
};

type VerifyElementTextParams = {
  elementTestId: string;
  text: string;
};

/**
 * @helper Verifica o texto interno de um elemento
 */
export const verifyElementText = ({ elementTestId, text }: VerifyElementTextParams) => {
  const element = screen.getByTestId(elementTestId);
  expect(element.textContent).toBe(text);
};
