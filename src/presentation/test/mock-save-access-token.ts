import { AccountModel } from '@/domain/models';
import { UpdateCurrentAccount } from '@/domain/usecases';

export class UpdateCurrentAccountMock implements UpdateCurrentAccount {
  account: AccountModel;

  async update(account: AccountModel): Promise<void> {
    this.account = account;
  }
}
