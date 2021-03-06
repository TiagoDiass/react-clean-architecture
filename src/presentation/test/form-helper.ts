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
};

/**
 * @helper Verifica o status de um input
 */
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
