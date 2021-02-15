import React from 'react';
import { render } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
  it('should not render Spinner and error on start', () => {
    const { getByTestId } = render(<Login />);
    const errorWrapper = getByTestId('error-wrapper');
    expect(errorWrapper.childElementCount).toBe(0);
  });

  it('should disable the submit button on Login start because fields are not valid yet', () => {
    const { getByTestId } = render(<Login />);
    const submitButton = getByTestId('submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });

  it('should start with empty email and password inputs', () => {
    const { getByTestId } = render(<Login />);
    const emailInput = getByTestId('email-input') as HTMLInputElement;
    const passwordInput = getByTestId('password-input') as HTMLInputElement;

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });

  it('should start email and passoword inputs with an "invalid" state', () => {
    const { getByTestId } = render(<Login />);
    const emailStatus = getByTestId('email-status');
    expect(emailStatus.title).toBe('Campo obrigatório');
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = getByTestId('password-status');
    expect(passwordStatus.title).toBe('Campo obrigatório');
    expect(passwordStatus.textContent).toBe('🔴');
  });
});
