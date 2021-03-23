import { SetStorage } from '@/data/protocols/cache';
import { UnexpectedError } from '@/domain/errors';
import { AccountModel } from '@/domain/models';
import { UpdateCurrentAccount } from '@/domain/usecases';

export class LocalUpdateCurrentAccount implements UpdateCurrentAccount {
  constructor(private readonly setStorage: SetStorage) {}

  async update(account: AccountModel): Promise<void> {
    if (!account?.accessToken || !account?.name) throw new UnexpectedError();

    await this.setStorage.set('account', JSON.stringify(account));
  }
}
