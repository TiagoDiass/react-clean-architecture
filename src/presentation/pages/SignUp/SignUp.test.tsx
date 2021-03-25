import React from 'react';
import faker from 'faker';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import SignUp from './SignUp';
import { AddAccountSpy, Helper, ValidationStub } from '@/presentation/test';
import { AddAccountParams } from '@/domain/usecases';
import { EmailInUseError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { AccountModel } from '@/domain/models';

type SutTypes = {
  addAccountSpy: AddAccountSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/signup'] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const setCurrentAccountMock = jest.fn();
  const addAccountSpy = new AddAccountSpy();

  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <SignUp validation={validationStub} addAccount={addAccountSpy} />
      </Router>
    </ApiContext.Provider>
  );

  return {
    addAccountSpy,
    setCurrentAccountMock,
  };
};

// Helpers
const {
  verifyElementChildCount,
  verifyInputStatus,
  verifyIfButtonIsDisabled,
  fillField,
  verifyIfElementExists,
  verifyElementText,
} = Helper;

type SimulateValidSubmitParams = {
  name?: string;
  email?: string;
  password?: string;
};

const simulateValidSubmit = async ({
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
}: SimulateValidSubmitParams) => {
  fillField({ fieldName: 'name', value: name });
  fillField({ fieldName: 'email', value: email });
  fillField({ fieldName: 'password', value: password });
  fillField({ fieldName: 'passwordConfirmation', value: password });

  const form = screen.getByTestId('form');
  fireEvent.submit(form);
  await waitFor(() => form);
};

describe('SignUp View', () => {
  it('should start with initial state', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });
    verifyElementChildCount({ elementTestId: 'error-wrapper', expectedCount: 0 });
    verifyIfButtonIsDisabled({ elementTestId: 'submit', isDisabled: true });

    verifyInputStatus({ fieldName: 'name', validationError, inputStatus: 'initial' });
    verifyInputStatus({ fieldName: 'email', validationError, inputStatus: 'initial' });
    verifyInputStatus({ fieldName: 'password', validationError, inputStatus: 'initial' });
    verifyInputStatus({
      fieldName: 'passwordConfirmation',
      validationError,
      inputStatus: 'initial',
    });
  });

  it('should show a name error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    fillField({ fieldName: 'name' });
    verifyInputStatus({ fieldName: 'name', validationError, inputStatus: 'invalid' });
  });

  it('should show an email error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    fillField({ fieldName: 'email' });
    verifyInputStatus({ fieldName: 'email', validationError, inputStatus: 'invalid' });
  });

  it('should show a password error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    fillField({ fieldName: 'password' });
    verifyInputStatus({ fieldName: 'password', validationError, inputStatus: 'invalid' });
  });

  it('should show a password confirmation error if Validation fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    fillField({ fieldName: 'passwordConfirmation' });
    verifyInputStatus({
      fieldName: 'passwordConfirmation',
      validationError,
      inputStatus: 'invalid',
    });
  });

  it('should show valid name state if Validation succeeds', () => {
    makeSut();

    fillField({ fieldName: 'name' });
    verifyInputStatus({ fieldName: 'name', inputStatus: 'valid' });
  });

  it('should show valid email state if Validation succeeds', () => {
    makeSut();

    fillField({ fieldName: 'email' });
    verifyInputStatus({ fieldName: 'email', inputStatus: 'valid' });
  });

  it('should show valid password state if Validation succeeds', () => {
    makeSut();

    fillField({ fieldName: 'password' });
    verifyInputStatus({ fieldName: 'password', inputStatus: 'valid' });
  });

  it('should show valid passwordConfirmation state if Validation succeeds', () => {
    makeSut();

    fillField({ fieldName: 'passwordConfirmation' });
    verifyInputStatus({ fieldName: 'passwordConfirmation', inputStatus: 'valid' });
  });

  it('should enable the submit button if form is valid', () => {
    makeSut();

    fillField({ fieldName: 'name' });
    fillField({ fieldName: 'email' });
    fillField({ fieldName: 'password' });
    fillField({ fieldName: 'passwordConfirmation' });
    verifyIfButtonIsDisabled({ elementTestId: 'submit', isDisabled: false });
  });

  it('should show spinner and disable the submit button on form submit', async () => {
    makeSut();

    await simulateValidSubmit({});
    verifyIfElementExists({ elementTestId: 'loading-spinner' });
    verifyIfButtonIsDisabled({ elementTestId: 'submit', isDisabled: true });
  });

  it('should call AddAccount with correct values', async () => {
    const { addAccountSpy } = makeSut();

    const password = faker.internet.password();
    const params: AddAccountParams = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: password,
      passwordConfirmation: password,
    };

    await simulateValidSubmit({ ...params });

    expect(addAccountSpy.params).toEqual(params);
  });

  it('should call AddAccount only once', async () => {
    const { addAccountSpy } = makeSut();

    await simulateValidSubmit({});
    await simulateValidSubmit({});

    expect(addAccountSpy.callsCount).toBe(1);
  });

  it('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words();
    const { addAccountSpy } = makeSut({ validationError });

    await simulateValidSubmit({});

    expect(addAccountSpy.callsCount).toBe(0);
  });

  it('should present an error message and hide spinner if AddAccount fails', async () => {
    const { addAccountSpy } = makeSut();

    const error = new EmailInUseError();

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);

    await simulateValidSubmit({});

    verifyElementText({ elementTestId: 'main-error', text: error.message });

    // somente o main error deve estar por baixo do error wrapper, spinner tem que ter sumido
    verifyElementChildCount({ elementTestId: 'error-wrapper', expectedCount: 1 });
  });

  it('should call SaveAccessToken if AddAccount succeeds', async () => {
    const { addAccountSpy, setCurrentAccountMock } = makeSut();

    await simulateValidSubmit({});
    await waitFor(() => screen.getByTestId('form'));

    expect(setCurrentAccountMock).toHaveBeenCalledWith(addAccountSpy.account);
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe('/');
  });

  it('should navigate to Login page', () => {
    makeSut();
    const loginLink = screen.getByTestId('login-link');
    fireEvent.click(loginLink);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe('/login');
  });
});
