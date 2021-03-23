import React from 'react';
import faker from 'faker';
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import SignUp from './SignUp';
import {
  AddAccountSpy,
  Helper,
  UpdateCurrentAccountMock,
  ValidationStub,
} from '@/presentation/test';
import { AddAccountParams } from '@/domain/usecases';
import { EmailInUseError } from '@/domain/errors';

type SutTypes = {
  sut: RenderResult;
  addAccountSpy: AddAccountSpy;
  updateCurrentAccountMock: UpdateCurrentAccountMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/signup'] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;

  const updateCurrentAccountMock = new UpdateCurrentAccountMock();
  const addAccountSpy = new AddAccountSpy();

  const sut = render(
    <Router history={history}>
      <SignUp
        validation={validationStub}
        addAccount={addAccountSpy}
        updateCurrentAccount={updateCurrentAccountMock}
      />
    </Router>
  );

  return {
    sut,
    addAccountSpy,
    updateCurrentAccountMock,
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
  sut: RenderResult;
  name?: string;
  email?: string;
  password?: string;
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

describe('SignUp View', () => {
  afterEach(cleanup);

  it('should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    verifyElementChildCount({ sut, elementTestId: 'error-wrapper', expectedCount: 0 });
    verifyIfButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });

    verifyInputStatus({ sut, fieldName: 'name', validationError, inputStatus: 'initial' });
    verifyInputStatus({ sut, fieldName: 'email', validationError, inputStatus: 'initial' });
    verifyInputStatus({ sut, fieldName: 'password', validationError, inputStatus: 'initial' });
    verifyInputStatus({
      sut,
      fieldName: 'passwordConfirmation',
      validationError,
      inputStatus: 'initial',
    });
  });

  it('should show a name error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'name' });
    verifyInputStatus({ sut, fieldName: 'name', validationError, inputStatus: 'invalid' });
  });

  it('should show an email error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'email' });
    verifyInputStatus({ sut, fieldName: 'email', validationError, inputStatus: 'invalid' });
  });

  it('should show a password error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'password' });
    verifyInputStatus({ sut, fieldName: 'password', validationError, inputStatus: 'invalid' });
  });

  it('should show a password confirmation error if Validation fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    fillField({ sut, fieldName: 'passwordConfirmation' });
    verifyInputStatus({
      sut,
      fieldName: 'passwordConfirmation',
      validationError,
      inputStatus: 'invalid',
    });
  });

  it('should show valid name state if Validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'name' });
    verifyInputStatus({ sut, fieldName: 'name', inputStatus: 'valid' });
  });

  it('should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'email' });
    verifyInputStatus({ sut, fieldName: 'email', inputStatus: 'valid' });
  });

  it('should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'password' });
    verifyInputStatus({ sut, fieldName: 'password', inputStatus: 'valid' });
  });

  it('should show valid passwordConfirmation state if Validation succeeds', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'passwordConfirmation' });
    verifyInputStatus({ sut, fieldName: 'passwordConfirmation', inputStatus: 'valid' });
  });

  it('should enable the submit button if form is valid', () => {
    const { sut } = makeSut();

    fillField({ sut, fieldName: 'name' });
    fillField({ sut, fieldName: 'email' });
    fillField({ sut, fieldName: 'password' });
    fillField({ sut, fieldName: 'passwordConfirmation' });
    verifyIfButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: false });
  });

  it('should show spinner and disable the submit button on form submit', async () => {
    const { sut } = makeSut();

    await simulateValidSubmit({ sut });
    verifyIfElementExists({ sut, elementTestId: 'loading-spinner' });
    verifyIfButtonIsDisabled({ sut, elementTestId: 'submit', isDisabled: true });
  });

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut();

    const password = faker.internet.password();
    const params: AddAccountParams = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: password,
      passwordConfirmation: password,
    };

    await simulateValidSubmit({ sut, ...params });

    expect(addAccountSpy.params).toEqual(params);
  });

  it('should call AddAccount only once', async () => {
    const { sut, addAccountSpy } = makeSut();

    await simulateValidSubmit({ sut });
    await simulateValidSubmit({ sut });

    expect(addAccountSpy.callsCount).toBe(1);
  });

  it('should not call AddAccount if form is invalid', async () => {
    const validationError = faker.random.words();
    const { sut, addAccountSpy } = makeSut({ validationError });

    await simulateValidSubmit({ sut });

    expect(addAccountSpy.callsCount).toBe(0);
  });

  it('should present an error message and hide spinner if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut();

    const error = new EmailInUseError();

    jest.spyOn(addAccountSpy, 'add').mockRejectedValueOnce(error);

    await simulateValidSubmit({ sut });

    verifyElementText({ sut, elementTestId: 'main-error', text: error.message });

    // somente o main error deve estar por baixo do error wrapper, spinner tem que ter sumido
    verifyElementChildCount({ sut, elementTestId: 'error-wrapper', expectedCount: 1 });
  });

  it('should call SaveAccessToken if AddAccount succeeds', async () => {
    const { sut, addAccountSpy, updateCurrentAccountMock } = makeSut();

    await simulateValidSubmit({ sut });
    await waitFor(() => sut.getByTestId('form'));

    expect(updateCurrentAccountMock.account).toEqual(addAccountSpy.account);
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe('/');
  });

  it('should present an error if SaveAccessToken fails', async () => {
    const { sut, updateCurrentAccountMock } = makeSut();

    const error = new EmailInUseError();

    jest.spyOn(updateCurrentAccountMock, 'update').mockRejectedValueOnce(error);

    await simulateValidSubmit({ sut });

    const errorWrapper = sut.getByTestId('error-wrapper');

    await waitFor(() => errorWrapper);

    const mainError = sut.getByTestId('main-error');
    expect(mainError.textContent).toBe(error.message);

    // somente o main error deve estar por baixo do error wrapper, spinner tem que ter sumido
    expect(errorWrapper.childElementCount).toBe(1);
  });

  it('should navigate to Login page', () => {
    const { sut } = makeSut();
    const loginLink = sut.getByTestId('login-link');
    fireEvent.click(loginLink);
    expect(history.length).toBe(2);
    expect(history.location.pathname).toBe('/login');
  });
});
