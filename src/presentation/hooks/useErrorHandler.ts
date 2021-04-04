import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AccessDeniedError } from '@/domain/errors';
import { ApiContext } from '../contexts';

type CallbackType = (error: Error) => void;

export const useErrorHandler = (callback: CallbackType) => {
  const { setCurrentAccount } = useContext(ApiContext);
  const history = useHistory();

  return (error: Error) => {
    if (error instanceof AccessDeniedError) {
      setCurrentAccount(null);
      history.replace('/login');
    } else {
      callback(error);
    }
  };
};
