import { createContext } from 'react';

export type FormContextState = {
  isLoading: boolean;
  email: string;
  emailError: string;
  passwordError: string;
  mainError: string;
};

export type FormContext = {
  state: FormContextState;
  setState: (state: FormContextState) => void;
};

export default createContext<FormContext>(null);
