import React from 'react';
import faker from 'faker';
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';

import SignUp from './SignUp';
import { Helper, ValidationStub } from '@/presentation/test';

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

// Helpers
const { verifyElementChildCount, verifyInputStatus, verifyIfButtonIsDisabled, fillField } = Helper;

type SimulateValidSubmitParams = {
  sut: RenderResult;
  name?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;
};

const simulateValidSubmit = async ({
  sut,
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
}: SimulateValidSubmitParams) => {
  fillField({ sut, fieldName: 'name', value: name });
  fillField({ sut, fieldName: 'email', value: email });
  fillField({ sut, fieldName: 'password', value: password });
  fillField({ sut, fieldName: 'passwordConfirmation', value: password });

  const form = sut.getByTestId('form');
  fireEvent.submit(form);
  await waitFor(() => form);
};

type VerifyIfElementExistsParams = {
  sut: RenderResult;
  elementTestId: string;
};

const verifyIfElementExists = ({ sut, elementTestId }: VerifyIfElementExistsParams) => {
  const element = sut.getByTestId(elementTestId);
  expect(element).toBeTruthy();
};

describe('SignUp View', () => {
  afterEach(cleanup);

  it('should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    verifyElementChildCount({ sut, elementTestId: 'error-wrapper', expectedCount: 0 });
    verifyIfButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });

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

  it('should enable the submit button if form is valid', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'name' });
    fillField({ sut, fieldName: 'email' });
    fillField({ sut, fieldName: 'password' });
    fillField({ sut, fieldName: 'passwordConfirmation' });
    verifyIfButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: false });
  });

  it('should show spinner on form submit', async () => {
    const { sut } = makeSut();

    await simulateValidSubmit({ sut });
    verifyIfElementExists({ sut, elementTestId: 'loading-spinner' });
  });
});
