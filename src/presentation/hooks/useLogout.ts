import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ApiContext } from '../contexts';

export const useLogout = () => {
  const { setCurrentAccount } = useContext(ApiContext);
  const history = useHistory();

  return () => {
    setCurrentAccount(null);
    history.replace('/login');
  };
};
