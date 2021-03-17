import { fireEvent, RenderResult } from '@testing-library/react';
import faker from 'faker';

type VerifyElementChildCountParams = {
  sut: RenderResult;
  elementTestId: string;
  expectedCount: number;
};

/**
 * @helper Verifica se o número de filhos de um elemento é o esperado
 */
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
  inputStatus: 'initial' | 'valid' | 'invalid';
};

/**
 * @helper Verifica o status de um input
 */
export const verifyInputStatus = ({
  sut,
  fieldName,
  validationError = '',
  inputStatus,
}: VerifyInputStatusParams): void => {
  const inputWrapper = sut.getByTestId(`${fieldName}-wrapper`);
  const input = sut.getByTestId(`${fieldName}-input`);
  const inputLabel = sut.getByTestId(`${fieldName}-label`);

  expect(inputWrapper.getAttribute('data-status')).toBe(inputStatus);
  expect(input.title).toBe(validationError);
  expect(inputLabel.title).toBe(validationError);

  if (inputStatus === 'invalid') {
    const inputSmall = sut.getByTestId(`${fieldName}-small`);
    expect(inputSmall.textContent).toBe(validationError);
  }
};

type VerifyIfButtonIsDisabledParams = {
  sut: RenderResult;
  elementTestId: string;
  isDisabled: boolean;
};

/**
 * @helper Verifica se um botão está desabilitado
 */
export const verifyIfButtonIsDisabled = ({
  sut,
  elementTestId,
  isDisabled,
}: VerifyIfButtonIsDisabledParams): void => {
  const button = sut.getByTestId(elementTestId) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

type FillFieldParams = {
  sut: RenderResult;
  fieldName: string;
  value?: string;
};

/**
 * @helper Preenche um input
 */
export const fillField = ({
  sut,
  fieldName,
  value = faker.random.word(),
}: FillFieldParams): void => {
  const inputElement = sut.getByTestId(`${fieldName}-input`);
  fireEvent.focus(inputElement);
  fireEvent.input(inputElement, { target: { value } });
};

type VerifyIfElementExistsParams = {
  sut: RenderResult;
  elementTestId: string;
};

/**
 * @helper Verifica se um elemento existe
 */
export const verifyIfElementExists = ({ sut, elementTestId }: VerifyIfElementExistsParams) => {
  const element = sut.getByTestId(elementTestId);
  expect(element).toBeTruthy();
};

type VerifyElementTextParams = {
  sut: RenderResult;
  elementTestId: string;
  text: string;
};

/**
 * @helper Verifica o texto interno de um elemento
 */
export const verifyElementText = ({ sut, elementTestId, text }: VerifyElementTextParams) => {
  const element = sut.getByTestId(elementTestId);
  expect(element.textContent).toBe(text);
};
