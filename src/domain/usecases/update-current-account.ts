import { AccountModel } from '../models';

export interface UpdateCurrentAccount {
  update: (account: AccountModel) => Promise<void>;
}
