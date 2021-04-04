import { AccessDeniedError } from '@/domain/errors';
import { useLogout } from './useLogout';

type CallbackType = (error: Error) => void;

export const useErrorHandler = (callback: CallbackType) => {
  const logout = useLogout();

  return (error: Error) => {
    if (error instanceof AccessDeniedError) {
      logout();
    } else {
      callback(error);
    }
  };
};
