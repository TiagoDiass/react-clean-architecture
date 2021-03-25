import { fireEvent, screen } from '@testing-library/react';
import faker from 'faker';

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

  expect(inputWrapper).toHaveAttribute('data-status', inputStatus);
  expect(input).toHaveProperty('title', validationError);
  expect(inputLabel).toHaveProperty('title', validationError);

  if (inputStatus === 'invalid') {
    const inputSmall = screen.getByTestId(`${fieldName}-small`);
    expect(inputSmall).toHaveTextContent(validationError);
  }
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
