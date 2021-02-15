import { createContext } from 'react';

export type FormContext = {
  state: {
    isLoading: boolean;
  };

  errorState: {
    email: string;
    password: string;
    main: string;
  };
};

export default createContext<FormContext>(null);
