import { AccountModel } from '@/domain/models';
import { createContext } from 'react';

type APIContextType = {
  setCurrentAccount?: (account: AccountModel) => void;
  getCurrentAccount?: () => AccountModel;
};

export default createContext<APIContextType>(null);
